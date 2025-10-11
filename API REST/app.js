const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { log } = require('console');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

let data = loadDataFromFile();

app.listen(port, () => {
    console.log("Serveur écoutant sur le port " + port);
});

let nextBiereId = data.bieres?.length > 0 ? Math.max(...data.bieres.map(biere => biere.id)) + 1 : 1;
let nextNoteId = data.notes?.length > 0 ? Math.max(...data.notes.map(note => note.id)) + 1 : 1;
let nextUserId = data.users?.length > 0 ? Math.max(...data.users.map(user => parseInt(user.id))) + 1 : 1;

// Fonction pour charger les données depuis le fichier JSON
function loadDataFromFile() {
    try {
        const rawData = fs.readFileSync('data.json', 'utf8');
        const parsedData = JSON.parse(rawData);
        if (!parsedData.users) {
            parsedData.users = []; // Initialiser les utilisateurs si absents
        }
        return parsedData;
    } catch (err) {
        console.error("Erreur lors du chargement du fichier JSON:", err);
        return { bieres: [], notes: [], users: [] };
    }
}

// Fonction pour sauvegarder les données dans le fichier JSON
function saveDataToFile() {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('data.json', jsonData, 'utf8');
    } catch (err) {
        console.error("Erreur lors de la sauvegarde du fichier JSON:", err);
    }
}

// Routes pour les bières
app.get('/bieres', (req, res) => {
    res.json(data.bieres);
});

app.get('/bieres/:id', (req, res) => {
    const biereId = parseInt(req.params.id);
    const biere = data.bieres.find(b => b.id === biereId);
    if (biere) {
        const notes = data.notes.filter(note => note.biereId === biere.id);
        const averageNote = notes.length > 0 ? (notes.reduce((sum, note) => sum + note.note, 0) / notes.length).toFixed(2) : 0;
        res.json({ ...biere, note: parseFloat(averageNote) });
    } else {
        res.status(404).json({ error: 'Bière non trouvée' });
    }
});

app.post('/bieres', (req, res) => {
    console.log(`Ajout d'une nouvelle bière: ${JSON.stringify(req.body)}`);
    const newBiere = {
        id: nextBiereId++,
        nom: req.body.nom,
        alcool: req.body.alcool,
        type: req.body.type,
        note: 0,
        nb_notes: 0,
    };
    data.bieres.push(newBiere);
    saveDataToFile();
    res.status(201).json({ message: 'Bière ajoutée avec succès', biere: newBiere });
});

app.put('/bieres/:id', (req, res) => {
    console.log(`Mise à jour de la bière avec l'ID ${req.params.id}: ${JSON.stringify(req.body)}`);
    const biereId = parseInt(req.params.id);
    const biere = data.bieres.find(b => b.id === biereId);

    if (biere) {
        biere.nom = req.body.nom;
        biere.alcool = req.body.alcool;
        biere.type = req.body.type;
        updateBiereAverageNote(biereId); 
        saveDataToFile();
        res.json({ message: 'Bière mise à jour avec succès', biere });
    } else {
        res.status(404).json({ error: 'Bière non trouvée' });
    }
});

app.delete('/bieres/:id', (req, res) => {
    console.log(`Suppression de la bière avec l'ID ${req.params.id}`);
    const biereId = parseInt(req.params.id);
    data.bieres = data.bieres.filter(b => b.id !== biereId);
    saveDataToFile();
    res.json({ message: 'Bière supprimée avec succès' });
});

// Routes pour les notes
app.get('/bieres/:biereId/notes', (req, res) => {
    console.log(`Récupération des notes pour la bière avec l'ID ${req.params.biereId}`);
    const biereId = parseInt(req.params.biereId);
    const notes = data.notes.filter(note => note.biereId === biereId);
    res.json(notes);
});

app.post('/notes', (req, res) => {
    console.log(`Ajout d'une nouvelle note: ${JSON.stringify(req.body)}`);
    const newNote = {
        id: nextNoteId++,
        note: req.body.note,
        commentaire: req.body.commentaire,
        date: req.body.date,
        biereId: req.body.biereId,
        userId: req.body.userId,
    };
    data.notes.push(newNote);
    updateBiereAverageNote(req.body.biereId);
    saveDataToFile();
    res.status(201).json({ message: 'Note ajoutée avec succès', note: newNote });
});

app.put('/notes/:id', (req, res) => {
    console.log(`Mise à jour de la note avec l'ID ${req.params.id}: ${JSON.stringify(req.body)}`);
    const noteId = parseInt(req.params.id);
    const note = data.notes.find(n => n.id === noteId);

    if (note) {
        note.note = req.body.note;
        note.commentaire = req.body.commentaire;
        note.date = req.body.date;
        updateBiereAverageNote(req.body.biereId);
        saveDataToFile();
        res.json({ message: 'Note mise à jour avec succès', note });
    } else {
        res.status(404).json({ error: 'Note non trouvée' });
    }
});

app.delete('/notes/:id', (req, res) => {
    console.log(`Suppression de la note avec l'ID ${req.params.id}`);
    const noteId = parseInt(req.params.id);
    data.notes = data.notes.filter(n => n.id !== noteId);
    updateBiereAverageNote(req.body.biereId);
    saveDataToFile();
    res.json({ message: 'Note supprimée avec succès' });
});

// Routes pour les utilisateurs
app.get('/users', (req, res) => {
    console.log("Récupération de tous les utilisateurs");
    res.json(data.users);
});

app.get('/users/:id', (req, res) => {
    console.log(`Récupération de l'utilisateur avec l'ID ${req.params.id}`);
    const userId = req.params.id;
    const user = data.users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
});

app.post('/users', (req, res) => {
    console.log(`Ajout d'un nouvel utilisateur: ${JSON.stringify(req.body)}`);
    const newUser = {
        id: nextUserId.toString(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        surnom: req.body.surnom,
    };
    nextUserId++;
    data.users.push(newUser);
    saveDataToFile();
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', user: newUser });
});

app.put('/users/:id', (req, res) => {
    console.log(`Mise à jour de l'utilisateur avec l'ID ${req.params.id}: ${JSON.stringify(req.body)}`);
    const userId = req.params.id;
    const user = data.users.find(u => u.id === userId);

    if (user) {
        user.nom = req.body.nom;
        user.prenom = req.body.prenom;
        user.surnom = req.body.surnom;
        saveDataToFile();
        res.json({ message: 'Utilisateur mis à jour avec succès', user });
    } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
});

app.delete('/users/:id', (req, res) => {
    console.log(`Suppression de l'utilisateur avec l'ID ${req.params.id}`);
    const userId = req.params.id;
    data.users = data.users.filter(u => u.id !== userId);
    saveDataToFile();
    res.json({ message: 'Utilisateur supprimé avec succès' });
});

function updateBiereAverageNote(biereId) {
    console.log(`Mise à jour de la note pour la bière avec l'ID ${biereId}`);
    const notes = data.notes.filter(note => note.biereId === biereId);
    const averageNote = notes.length > 0 ? (notes.reduce((sum, note) => sum + note.note, 0) / notes.length).toFixed(2) : 0;
    const biere = data.bieres.find(b => b.id === biereId);
    if (biere) {
        biere.note = averageNote;
        biere.nb_notes = notes.length;
        saveDataToFile();
    }
}
