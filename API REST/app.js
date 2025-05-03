const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Module pour travailler avec les fichiers
const cors = require('cors'); // Middleware pour gérer CORS

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

let data = loadDataFromFile(); // Charger les données depuis le fichier JSON

app.listen(port, () => {
    console.log("Serveur écoutant sur le port " + port);
});

let nextPizzaId = getNextPizzaId(data.pizzas); // Initialiser le prochain ID disponible pour les tâches
let nextLocationId = getNextLocationId(data.locations);


// Fonction pour charger les données depuis le fichier JSON
function loadDataFromFile() {
    try {
        const rawData = fs.readFileSync('data.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error("Erreur lors du chargement du fichier JSON:", err);
        return { locations: [], pizzas: [] };
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

// Fonction pour obtenir le prochain ID disponible pour les tâches
function getNextPizzaId(pizzas) {
    return pizzas.length > 0 ? Math.max(...pizzas.map(pizza => pizza.id)) + 1 : 1;
}

function getNextLocationId(locations) {
    return locations.length > 0 ? Math.max(...locations.map(location => location.id)) + 1 : 1;
}


// Routes pour les pizzas (Exemple)
app.get('/pizzas', (req, res) => {
    res.json(data.pizzas);
    console.log('data retourner :' + data/pizzas)
});

app.get('/pizzas/:id', (req, res) => {
    const pizzaId = parseInt(req.params.id);
    const pizza = data.pizzas.find(pizza => pizza.id === pizzaId);

    if (pizza) {
        res.json(pizza);
    } else {
        res.status(404).json({ error: 'Pizza non trouvée' });
    }
});

app.post('/pizzas', (req, res) => {
    const newPizza = {
        id: nextPizzaId++,
        name: req.body.name,
        description: req.body.description,
        small_price: req.body.small_price,
        large_price: req.body.large_price,
        categorie: req.body.categorie,
    };
    data.pizzas.push(newPizza);
    saveDataToFile(); // Sauvegarder après l'ajout d'une pizza
    res.status(201).json({ message: 'Pizza ajoutée avec succès', pizza: newPizza });
});

app.put('/pizzas/:id', (req, res) => {
    const pizzaId = parseInt(req.params.id);
    const pizza = data.pizzas.find(pizza => pizza.id === pizzaId);

    if (pizza) {
        pizza.name = req.body.name;
        pizza.description = req.body.description;
        pizza.small_price= req.body.small_price;
        pizza.large_price= req.body.large_price;
        pizza.categorie = req.body.categorie;

        saveDataToFile(); // Sauvegarder après la mise à jour d'une pizza
        res.json({ message: 'Pizza mise à jour avec succès', pizza });
    } else {
        res.status(404).json({ error: 'Pizza non trouvée' });
    }
});

app.delete('/pizzas/:id', (req, res) => {
    const pizzaId = parseInt(req.params.id);
    data.pizzas = data.pizzas.filter(pizza => pizza.id !== pizzaId);
    saveDataToFile(); // Sauvegarder après la suppression d'une pizza
    res.json({ message: 'Pizza supprimée avec succès' });
});

app.get('/locations', (req, res) => {
    res.json(data.locations);
    console.log('data retourner :' + data/locations)
});

app.post('/locations', (req, res) => {
    const newlocation = {
        id: nextLocationId++,
        name: req.body.name,
        description: req.body.description,
        creationDate: new Date().toISOString()
    };
    data.locations.push(newlocation);
    saveDataToFile(); // Sauvegarder après l'ajout d'une pizza
    res.status(201).json({ message: 'Localisation ajoutée avec succès', location: newlocation });
});

app.put('/locations/:id', (req, res) => {
    const locationId = parseInt(req.params.id);
    const location = data.locations.find(location => location.id === locationId);

    if (location) {
        location.name = req.body.name;
        location.day = req.body.day
        location.map = req.body.map;
        saveDataToFile(); // Sauvegarder après la mise à jour d'une pizza
        res.json({ message: 'Localisation mise à jour avec succès', location });
    } else {
        res.status(404).json({ error: 'localisation non trouvée' });
    }
});

app.delete('/locations/:id', (req, res) => {
    const locationId = parseInt(req.params.id);
    data.locations = data.locations.filter(location => location.id !== locationId);
    saveDataToFile(); // Sauvegarder après la suppression d'une pizza
    res.json({ message: 'localisation supprimée avec succès' });
});

// Routes pour les catégories
app.get('/categories', (req, res) => {
    res.json(data.categories);
});

app.get('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const categorie = data.categories.find(cat => cat.id === categorieId);

    if (categorie) {
        res.json(categorie);
    } else {
        res.status(404).json({ error: 'Catégorie non trouvée' });
    }
});

app.post('/categories', (req, res) => {
    const newCategorie = {
        id: data.categories.length > 0 ? Math.max(...data.categories.map(cat => cat.id)) + 1 : 1,
        name: req.body.name,
    };
    data.categories.push(newCategorie);
    saveDataToFile();
    res.status(201).json({ message: 'Catégorie ajoutée avec succès', categorie: newCategorie });
});

app.put('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const categorie = data.categories.find(cat => cat.id === categorieId);

    if (categorie) {
        categorie.name = req.body.name;
        saveDataToFile();
        res.json({ message: 'Catégorie mise à jour avec succès', categorie });
    } else {
        res.status(404).json({ error: 'Catégorie non trouvée' });
    }
});

app.delete('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);
    data.categories = data.categories.filter(cat => cat.id !== categorieId);
    saveDataToFile();
    res.json({ message: 'Catégorie supprimée avec succès' });
});

// Routes pour les boissons
app.get('/boissons', (req, res) => {
    res.json(data.boissons);
});

app.get('/boissons/:id', (req, res) => {
    const boissonId = parseInt(req.params.id);
    const boisson = data.boissons.find(b => b.id === boissonId);

    if (boisson) {
        res.json(boisson);
    } else {
        res.status(404).json({ error: 'Boisson non trouvée' });
    }
});

app.post('/boissons', (req, res) => {
    const newBoisson = {
        id: data.boissons.length > 0 ? Math.max(...data.boissons.map(b => b.id)) + 1 : 1,
        name: req.body.name,
        price: req.body.price,
        quantité: req.body.quantité,
        commentaire: req.body.commentaire || null,
    };
    data.boissons.push(newBoisson);
    saveDataToFile();
    res.status(201).json({ message: 'Boisson ajoutée avec succès', boisson: newBoisson });
});

app.put('/boissons/:id', (req, res) => {
    const boissonId = parseInt(req.params.id);
    const boisson = data.boissons.find(b => b.id === boissonId);

    if (boisson) {
        boisson.name = req.body.name;
        boisson.price = req.body.price;
        boisson.quantité = req.body.quantité;
        boisson.commentaire = req.body.commentaire || null;
        saveDataToFile();
        res.json({ message: 'Boisson mise à jour avec succès', boisson });
    } else {
        res.status(404).json({ error: 'Boisson non trouvée' });
    }
});

app.delete('/boissons/:id', (req, res) => {
    const boissonId = parseInt(req.params.id);
    data.boissons = data.boissons.filter(b => b.id !== boissonId);
    saveDataToFile();
    res.json({ message: 'Boisson supprimée avec succès' });
});
