const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware pour analyser les requêtes JSON et URL-encodées
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '')));

// Endpoint pour l'insertion de données
app.post('/add-app', (req, res) => {
    const newApp = req.body;
    const filePath = path.join(__dirname, 'data', 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            return res.status(500).send('Erreur lors de la lecture du fichier de données.');
        }

        let appData = JSON.parse(data);
        const newAppId = newApp.title.toLowerCase().replace(/\s/g, '-');

        // Ajouter la nouvelle application
        appData.apps[newAppId] = {
            title: newApp.title,
            description: newApp.description,
            images: newApp.images.split(',').map(img => img.trim()),
            downloadLink: newApp.downloadLink
        };

        // Écrire les données mises à jour dans le fichier
        fs.writeFile(filePath, JSON.stringify(appData, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Erreur d\'écriture du fichier:', err);
                return res.status(500).send('Erreur lors de l\'écriture du fichier de données.');
            }
            console.log('Nouvelle application ajoutée avec succès:', newAppId);
            res.status(200).send('Application ajoutée avec succès !');
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});