require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Resolution = require('./models/Resolution');
const Groupe = require('./models/Groupe');
const Etudiant = require('./models/Etudiant');
const Cours = require('./models/Cours');

const students = [];

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 4001;

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

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('connectToGroup', async (data) => {
        try {
            const {
                groupeId,
                etudiantId
            } = data;
            
            const etudiant = await Etudiant.findById(etudiantId).lean();
            const groupe = await Groupe.findById(groupeId).populate('serieId');
            
            if (etudiant && groupe){
                const coursData = await Cours.findById(groupe.serieId?.coursId).lean();
                const existingEtudiant = students.find((student) => student._id.toString() === etudiant._id.toString());
                if (existingEtudiant){
                    socket.emit('error', 'You are already connected to a group');
                    return;
                }

                const resolution = await Resolution.findOne({
                    etudiantId,
                    serieId: groupe.serieId
                }).lean()
                const etudiantData = {
                    ...etudiant,
                    cours: coursData,
                    groupe: groupe,
                    reponses: resolution ? resolution.reponses : []
                }
                students.push(etudiantData);
                socket.emit('connectToGroup', etudiantData);
                // console.log("Data students :", students);

                socket.emit('allStudents', students);
            } else {
                socket.emit('error', 'Student or group not found');
            }
        } catch (error) {
            console.error('Error in connectToGroup:', error);
            socket.emit('error', 'Internal server error');
        }
    });

    socket.on('allStudents', () => {

        socket.emit('allStudents', students);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    try {
        db.connectDB();
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        console.error(`Error running on port ${port}`);
    }
});
