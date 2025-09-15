const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Importer multer

const app = express();
const port = 3000;

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Assurez-vous que le dossier de destination existe
        const uploadPath = path.join(__dirname, 'Store', 'assets');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nom de fichier unique pour éviter les conflits
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Middleware pour analyser les requêtes JSON et URL-encodées
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '')));

// Endpoint pour l'insertion de données avec gestion des fichiers
app.post('/add-app', upload.array('images', 10), (req, res) => {
    const newApp = req.body;
    const filePath = path.join(__dirname, 'data', 'data.json');

    // Récupérer les chemins des images téléchargées
    const imagePaths = req.files.map(file => path.join('../Store/assets', file.filename));

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            return res.status(500).send('Erreur lors de la lecture du fichier de données.');
        }

        let appData = JSON.parse(data);
        const newAppId = newApp.title.toLowerCase().replace(/\s/g, '-');

        // Ajouter la nouvelle application avec les chemins des images téléchargées
        appData.apps[newAppId] = {
            title: newApp.title,
            description: newApp.description,
            images: imagePaths,
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