const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'Store', 'assets');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '')));

// Middleware pour les requêtes de type application/json
app.use(bodyParser.json());

// Point de terminaison pour l'insertion de données
app.post('/add-app', (req, res) => {
    // Vérifier si la requête est une soumission de fichier
    const contentType = req.headers['content-type'];

    if (contentType && contentType.startsWith('multipart/form-data')) {
        // C'est un téléchargement de fichier, on utilise multer
        upload.array('images', 10)(req, res, (err) => {
            if (err) {
                console.error('Erreur lors du téléchargement des fichiers:', err);
                return res.status(500).send('Erreur lors du téléchargement des fichiers.');
            }
            handleAppSubmission(req, res, req.files.map(file => path.join('../Store/assets', file.filename)));
        });
    } else {
        // C'est une soumission de liens JSON
        handleAppSubmission(req, res, req.body.imageLinks);
    }
});

function handleAppSubmission(req, res, images) {
    const newApp = req.body;
    const filePath = path.join(__dirname, 'data', 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            return res.status(500).send('Erreur lors de la lecture du fichier de données.');
        }

        let appData = JSON.parse(data);
        const newAppId = newApp.title.toLowerCase().replace(/\s/g, '-');
        
        appData.apps[newAppId] = {
            title: newApp.title,
            description: newApp.description,
            images: images,
            downloadLink: newApp.downloadLink
        };

        fs.writeFile(filePath, JSON.stringify(appData, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Erreur d\'écriture du fichier:', err);
                return res.status(500).send('Erreur lors de l\'écriture du fichier de données.');
            }
            console.log('Nouvelle application ajoutée avec succès:', newAppId);
            res.status(200).send('Application ajoutée avec succès !');
        });
    });
}

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});