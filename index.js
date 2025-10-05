require('dotenv').config();
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const Resolution = require('./models/Resolution');
const Groupe = require('./models/Groupe');
const Etudiant = require('./models/Etudiant');

const students = [];

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
};
const db = require('./utils/Database');
const routes = require('./routes');

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1', routes);

socketIo.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('connectToGroup', (data) => {
        const {
            groupId,
            etudiantId
        } = data;
        
        const etudiant = Etudiant.findById(etudiantId).lean();
        const groupe = Groupe.findById(groupId).populate('serieId');
        
        if (etudiant){
            const existingEtudiant = students.find((student) => student._id.toString() === etudiant._id.toString());
            if (existingEtudiant){
                socket.emit('error', 'You are already connected to a group');
                return;
            }
            const etudiantData = {
                ...etudiant.toObject(),
                groupeId: groupe._id,
                serieId: groupe.serieId
            }
            students.push(etudiantData);
            socket.emit('connectToGroup', etudiantData);
        }
    });

    socket.on('allStudents', () => {
        socket.emit('allStudents', students);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(port, () => {
    try {
        db.connectDB();
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        console.error(`Error running on port ${port}`);
    }
});
