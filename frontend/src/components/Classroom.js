import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Classroom.css';

const socket = io('http://localhost:4000');

const Classroom = ({ role, roomId, userId, setClassActive }) => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classActive, setLocalClassActive] = useState(false);

    useEffect(() => {
        socket.emit('join-class', { roomId, role, name: userId });

        socket.on('update-class', (data) => {
            setTeachers(data.teachers);
            setStudents(data.students);
            setLocalClassActive(data.classActive);
            setClassActive(data.classActive);
        });

        socket.on('access-denied', () => {
            alert('Class has not started yet.');
            resetToInitialScreen(); 
        });

        socket.on('class-started', () => {
            setLocalClassActive(true); 
            setClassActive(true);
        });

        socket.on('class-ended', () => {
            alert('The class has ended.');
            resetToInitialScreen();
        });

        return () => {
            socket.off('update-class');
            socket.off('access-denied');
            socket.off('class-started');
            socket.off('class-ended');
            socket.emit('leave-class', { roomId, role, name: userId });
        };
    }, [roomId, role, userId, setClassActive]);

    const startClass = () => {
        socket.emit('start-class', roomId);
    };

    const endClass = () => {
        socket.emit('end-class', roomId);
    };

    const resetToInitialScreen = () => {
        setLocalClassActive(false); 
        setClassActive(false);
        window.location.reload();
    };

    return (
        <div className="classroom-container">
            <div className="classroom-header">
                <h1 className="classroom-title">{roomId}</h1>
                {role === 'teacher' && (
                    <div className="classroom-controls">
                        <button onClick={startClass} disabled={classActive}>Start Class</button>
                        <button onClick={endClass} disabled={!classActive}>End Class</button>
                    </div>
                )}
            </div>

            <div className="classroom-body">
                <div className="classroom-list">
                    <h2>Students</h2>
                    <ul>
                        {students.map((student, index) => (
                            <li key={index}>{student}</li>
                        ))}
                    </ul>
                </div>
                <div className="classroom-list">
                    <h2>Teachers</h2>
                    <ul>
                        {teachers.map((teacher, index) => (
                            <li key={index}>{teacher}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Classroom;