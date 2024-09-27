require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

let db;
MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db('virtual-classroom');
});

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {

    socket.on('join-class', async (data) => {
        const { roomId, role, name } = data;

        let classroom = await db.collection('classrooms').findOne({ roomId });

        if (!classroom) {
            classroom = { roomId, teachers: [], students: [], classActive: false };
            await db.collection('classrooms').insertOne(classroom);
        }

        if (role === 'teacher') {
            if (!classroom.teachers.includes(name)) {
                classroom.teachers.push(name);
            }
            await db.collection('classrooms').updateOne({ roomId }, { $set: { teachers: classroom.teachers } });
            socket.join(roomId);
            io.to(roomId).emit('update-class', classroom);
            logEvent(roomId, 'join', role, name);

        } else if (role === 'student') {
            if (classroom.classActive) {
                if (!classroom.students.includes(name)) {
                    classroom.students.push(name);
                }
                await db.collection('classrooms').updateOne({ roomId }, { $set: { students: classroom.students } });
                socket.join(roomId);
                io.to(roomId).emit('update-class', classroom);
                logEvent(roomId, 'join', role, name);
            } else {
                socket.emit('access-denied');
            }
        }
    });

    socket.on('start-class', async (roomId) => {
        const classroom = await db.collection('classrooms').findOne({ roomId });

        if (classroom) {
            await db.collection('classrooms').updateOne({ roomId }, { $set: { classActive: true } });
            io.to(roomId).emit('class-started');
            logEvent(roomId, 'start_class', 'teacher');
            io.to(roomId).emit('update-class', { ...classroom, classActive: true });
        }
    });

    socket.on('end-class', async (roomId) => {
        const classroom = await db.collection('classrooms').findOne({ roomId });
    
        if (classroom) {
            await db.collection('classrooms').updateOne({ roomId }, { $set: { classActive: false, students: [], teachers: [] } });
            io.to(roomId).emit('class-ended'); 
            logEvent(roomId, 'end_class', 'teacher');
            io.to(roomId).emit('update-class', { roomId, classActive: false, students: [], teachers: [] });
        }
    });

    socket.on('leave-class', async (data) => {
        const { roomId, role, name } = data;

        const classroom = await db.collection('classrooms').findOne({ roomId });

        if (classroom) {
            if (role === 'teacher') {
                classroom.teachers = classroom.teachers.filter(teacher => teacher !== name);
            } else if (role === 'student') {
                classroom.students = classroom.students.filter(student => student !== name);
            }
            await db.collection('classrooms').updateOne({ roomId }, { $set: { teachers: classroom.teachers, students: classroom.students } });
            io.to(roomId).emit('update-class', classroom);
            logEvent(roomId, 'leave', role, name);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

function logEvent(roomId, type, role, name = null) {
    const log = {
        roomId,
        type,
        role,
        name,
        timestamp: new Date(),
    };
    db.collection('classroom_logs').insertOne(log);
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));