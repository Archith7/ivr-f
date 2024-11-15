const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Admin IDs (assuming you have predefined admin IDs)
const adminIds = ['admin1', 'admin2'];
let adminSockets = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('adminLogin', (adminId) => {
        socket.join(adminId); // Join the room corresponding to the admin ID
        adminSockets[adminId] = socket; // Store the socket for admin
        socket.emit('adminLoginSuccess');
    });

    socket.on('login', () => {
        socket.emit('loginSuccess');
    });

    socket.on('offer', (offer) => {
        io.emit('offer', offer); // Broadcast offer to all connected clients (admins)
    });

    socket.on('answer', (answer) => {
        io.emit('answer', answer); // Broadcast answer to all connected clients (users)
    });

    socket.on('candidate', (candidate) => {
        io.emit('candidate', candidate); // Broadcast candidate to all connected clients
    });

    socket.on('endCall', () => {
        io.emit('endCall'); // Broadcast end call signal to all connected clients
    });

    socket.on('transcript', (transcript) => {
        // Broadcast transcript to all admin sockets
        Object.values(adminSockets).forEach(adminSocket => {
            adminSocket.emit('transcript', transcript);
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove from adminSockets when disconnected
        Object.keys(adminSockets).forEach(adminId => {
            if (adminSockets[adminId] === socket) {
                delete adminSockets[adminId];
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port${PORT}`);
});


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static('public'));

// let adminSocket = null;
// const adminId = 'admin123';

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('adminLogin', (id, callback) => {
//     if (id === adminId) {
//       adminSocket = socket;
//       console.log('Admin logged in');
//       callback({ success: true });
//     } else {
//       callback({ success: false, message: 'Invalid admin ID' });
//     }
//   });

//   socket.on('userLogin', (id, callback) => {
//     console.log('User logged in with ID:', id);
//     callback({ success: true });
//   });

//   socket.on('checkAdmin', (callback) => {
//     if (adminSocket) {
//       callback({ success: true });
//     } else {
//       callback({ success: false });
//     }
//   });

//   socket.on('offer', (offer) => {
//     if (adminSocket) {
//       adminSocket.emit('offer', offer);
//     } else {
//       socket.emit('adminNotAvailable');
//     }
//   });

//   socket.on('answer', (answer) => {
//     socket.broadcast.emit('answer', answer);
//   });

//   socket.on('candidate', (candidate) => {
//     socket.broadcast.emit('candidate', candidate);
//   });

//   socket.on('endCall', () => {
//     socket.broadcast.emit('endCall');
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//     if (socket === adminSocket) {
//       adminSocket = null;
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
