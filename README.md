# 💼 Portfolio - Dylan Kavundama

<div align="center">

![Portfolio](https://img.shields.io/badge/Portfolio-Dylan%20Kavundama-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Fullstack Mobile Developer** spécialisé en développement d'applications mobiles et web modernes

[🌐 Site Web](https://dylankavundama.com) • [📧 Contact](mailto:contact@dylankavundama.com) • [💬 WhatsApp](https://wa.me/243977734735)

</div>

---

## 📋 À propos

Portfolio professionnel moderne et responsive présentant mes compétences, projets et réalisations en tant que développeur Fullstack Mobile. Le site inclut un système de blog intégré avec administration, support multilingue (FR/EN), thème clair/sombre, et une interface utilisateur animée.

## ✨ Fonctionnalités

### 🎨 Interface Utilisateur
- ✅ **Design moderne et responsive** - Adapté à tous les appareils (mobile, tablette, desktop)
- ✅ **Thème clair/sombre** - Toggle avec sauvegarde des préférences
- ✅ **Multilingue** - Support Français et Anglais avec changement dynamique
- ✅ **Animations fluides** - Transitions et effets visuels modernes
- ✅ **Navigation intuitive** - Menu burger sur mobile, navigation fixe

### 🚀 Sections du Portfolio
- 📱 **Hero Section** - Présentation avec CTA vers WhatsApp et CV
- 👤 **À Propos** - Description professionnelle et parcours
- 💻 **Compétences** - Frontend, Backend, Gestion de Projet
- 🛠️ **Technologies** - Grille interactive de 30+ technologies
- 🎯 **Réalisations** - 16+ projets avec filtres et recherche
- 📝 **Blog** - Articles avec système de lecture et statistiques
- 📺 **YouTube** - Intégration de chaîne YouTube

### 🔐 Administration
- 🔒 **Système de connexion sécurisé** - Page de login avec animations
- 📊 **Tableau de bord** - Statistiques des visites et articles
- ✍️ **Gestion des articles** - CRUD complet pour le blog
- 📈 **Suivi des lectures** - Compteur de vues par article

### 🎯 Fonctionnalités Avancées
- 🔍 **Recherche de projets** - Recherche en temps réel
- 🏷️ **Filtres par catégorie** - E-commerce, Fintech, Mobile, Web, etc.
- 📱 **Compteur de projets** - Affichage dynamique du nombre de projets
- 🌐 **SEO optimisé** - Meta tags, Open Graph, Twitter Cards
- ⚡ **Performance** - Lazy loading, optimisations CSS/JS

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Variables CSS, Grid, Flexbox, Animations
- **JavaScript (Vanilla)** - Pas de framework, performance optimale
- **Font Awesome** - Icônes vectorielles

### Backend & Stockage
- **LocalStorage** - Stockage des données (articles, thème, langue, session)
- **JavaScript ES6+** - Modules, async/await, classes

### Outils & Services
- **Git/GitHub** - Version control
- **Vercel/Netlify** - Déploiement (recommandé)
- **WhatsApp Business API** - Intégration contact

## 📁 Structure du Projet

```
portfolio/
├── index.html              # Page principale du portfolio
├── login.html              # Page de connexion admin
├── admin.html              # Interface d'administration
├── blog-detail.html        # Page de détail d'un article
├── style.css               # Styles principaux
├── style_yt.css            # Styles section YouTube
├── admin.css               # Styles administration
├── blog-detail.css         # Styles détail blog
├── script.js               # Scripts principaux
├── login.js                # Gestion authentification
├── admin.js                # Logique administration
├── blog.js                 # Gestion blog
├── blog-detail.js          # Logique détail article
├── translations.js         # Traductions FR/EN
├── asset/                  # Images et ressources
│   ├── *.png, *.jpg        # Logos projets et images
│   └── assets/             # Assets supplémentaires
├── dylan_cv.pdf            # CV en PDF
└── README.md               # Documentation
```

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un serveur web local (optionnel pour développement)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/dylankavundama/portfolio.git
   cd portfolio
   ```

2. **Ouvrir le projet**
   - Option 1 : Ouvrir `index.html` directement dans le navigateur
   - Option 2 : Utiliser un serveur local :
     ```bash
     # Avec Python
     python -m http.server 8000
     
     # Avec Node.js (http-server)
     npx http-server
     
     # Avec PHP
     php -S localhost:8000
     ```

3. **Accéder au site**
   - Ouvrir `http://localhost:8000` dans votre navigateur

## 📱 Utilisation

### Navigation
- **Accueil** : Section hero avec présentation
- **À Propos** : Informations professionnelles
- **Compétences** : Technologies et compétences
- **Réalisation** : Portfolio de projets avec filtres
- **Blog** : Articles et actualités

### Administration
1. Accéder à `/login.html`
2. Identifiants par défaut :
   - Username: `admin`
   - Password: `0000`
3. Gérer les articles du blog depuis le tableau de bord

### Personnalisation
- **Thème** : Cliquer sur l'icône lune/soleil dans le header
- **Langue** : Cliquer sur l'icône globe pour changer FR/EN
- **Projets** : Modifier le tableau `projects` dans `script.js`

## 🎨 Personnalisation

### Modifier les couleurs
Éditer les variables CSS dans `style.css` :
```css
:root {
    --primary-color: #3c94e7;
    --secondary-color: #2d7dd2;
    --text-color: #333;
    /* ... */
}
```

### Ajouter un projet
Modifier la section projets dans `index.html` ou utiliser le format JSON dans `script.js`.

### Modifier les traductions
Éditer `translations.js` pour ajouter/modifier les textes multilingues.

## 📊 Statistiques

- **16+ Projets** présentés
- **30+ Technologies** affichées
- **Sections** : 7 principales
- **Langues** : 2 (FR/EN)
- **Thèmes** : 2 (Clair/Sombre)

## 🔒 Sécurité

- ⚠️ **Important** : Changer les identifiants par défaut en production
- Les sessions sont stockées dans `localStorage` (24h de validité)
- Pour un environnement de production, migrer vers un backend sécurisé

## 🌐 Déploiement

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
- Glisser-déposer le dossier dans Netlify
- Ou utiliser la CLI : `netlify deploy`

### GitHub Pages
1. Activer GitHub Pages dans les paramètres du repository
2. Sélectionner la branche `main`
3. Le site sera disponible à `https://dylankavundama.github.io/portfolio`

## 📝 Projets Présentés

- **Soko Fast** - E-commerce mobile (Android)
- **U-System** - Système de gestion
- **Millantech** - Application mobile
- **Cavodi** - Plateforme mobile
- **Lifechannel** - Application culturelle
- **Viz** - Application mobile
- **GeoVille** - Application géolocalisation
- **WMA+** - Application mobile
- Et plus...

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Dylan Kavundama**

- 🌐 Site Web: [dylankavundama.com](https://dylankavundama.com)
- 💼 LinkedIn: [Votre LinkedIn](https://linkedin.com/in/votre-profil)
- 🐦 Twitter: [@VotreTwitter](https://twitter.com/votre-handle)
- 📧 Email: contact@dylankavundama.com
- 💬 WhatsApp: [+243 977 734 735](https://wa.me/243977734735)

## 🙏 Remerciements

- [Font Awesome](https://fontawesome.com) pour les icônes
- Tous les clients et collaborateurs qui ont fait confiance à mes services
- La communauté open source

---

<div align="center">

**⭐ Si ce projet vous a aidé, n'hésitez pas à mettre une étoile ! ⭐**

Fait avec ❤️ par [Dylan Kavundama](https://github.com/dylankavundama)

</div>

