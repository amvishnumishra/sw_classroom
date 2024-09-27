import React, { useEffect, useState } from 'react';
import Classroom from './components/Classroom';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
    const [role, setRole] = useState('');
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const [classActive, setClassActive] = useState(true);

    const handleRoleSelection = (selectedRole) => {
        const input = prompt(`Enter your ${selectedRole} ID`);
        if (input) {
            setUserId(input);
            setRole(selectedRole);
            setRoomId('Classroom');
            socket.emit('join-class', { roomId: 'Classroom', role: selectedRole, name: input });
        } else {
            alert(`${selectedRole} ID cannot be empty. Please try again.`);
        }
    };

    useEffect(() => {
        socket.on('update-class', (data) => {
            setClassActive(data.classActive);
        });

        return () => {
            socket.off('update-class');
        };
    }, []);

    return (
        <div>
            {!role ? (
                <div class="container_full_width">
                <div class="container">
                <img class="logo" src="images/class_icon.png" alt="SW Logo"></img>
                <h1>SW Classroom</h1>
                <h2>Welcome!</h2>
                </div>
                <div>
                    <button onClick={() => handleRoleSelection('teacher')}>Teacher</button>
                    <button onClick={() => handleRoleSelection('student')}>Student</button>
                </div>
                </div>
            ) : (<Classroom
                role={role}
                roomId={roomId}
                userId={userId}
                setClassActive={setClassActive}
                classActive={classActive}
            />
            )}
        </div>
    );
}

export default App;