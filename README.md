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
- 💬 **Témoignages** - Avis clients avec système de notation et formulaire
- 📺 **YouTube** - Intégration de chaîne YouTube

### 🔐 Administration
- 🔒 **Système de connexion sécurisé** - Page de login avec animations
- 📊 **Tableau de bord** - Statistiques des visites et articles
- ✍️ **Gestion des articles** - CRUD complet pour le blog
- 📈 **Suivi des lectures** - Compteur de vues par article

### 🎯 Fonctionnalités Avancées
- 🔍 **Recherche de projets** - Recherche en temps réel avec debounce
- 🏷️ **Filtres par catégorie** - E-commerce, Fintech, Mobile, Web, Gestion, Culture, etc.
- 📱 **Compteur de projets** - Affichage dynamique du nombre de projets
- 🌐 **SEO optimisé** - Meta tags, Open Graph, Twitter Cards
- ⚡ **Performance** - Lazy loading, optimisations CSS/JS, Intersection Observer
- 📤 **Partage social** - Partage d'articles sur Facebook, Twitter, LinkedIn, WhatsApp
- 📈 **Analytics** - Suivi des visites, visiteurs uniques, statistiques quotidiennes et hebdomadaires

## 🛠️ Technologies Utilisées

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
- **HTML5** - Structure sémantique
- **CSS3** - Variables CSS, Grid, Flexbox, Animations
- **JavaScript (Vanilla)** - Pas de framework, performance optimale
- **Font Awesome** - Icônes vectorielles

### Mobile Development
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white)
- **Flutter** - Développement mobile multiplateforme
- **React Native** - Applications mobiles cross-platform
- **Dart** - Langage de programmation Flutter

### Backend & Stockage
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
- **Node.js** - Runtime JavaScript côté serveur
- **PHP** - Langage de programmation backend
- **LocalStorage** - Stockage des données (articles, thème, langue, session)
- **JavaScript ES6+** - Modules, async/await, classes

### Outils & Services
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white)
- **Git/GitHub** - Version control
- **Vercel/Netlify** - Déploiement (recommandé)
- **WhatsApp Business API** - Intégration contact
- **Firebase** - Services backend
- **Analytics** - Suivi des statistiques

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

- **16 Projets** présentés (E-commerce, Fintech, Culture, Gestion, etc.)
- **30+ Technologies** affichées (Flutter, React Native, Node.js, PHP, etc.)
- **Sections** : 8 principales (Hero, À Propos, Compétences, Technologies, Réalisations, Blog, Témoignages, YouTube)
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

### 🛒 E-commerce
- **[Soko Fast](https://play.google.com/store/apps/details?id=com.sokofast.btc)** - Boutique de vente en ligne spécialisée dans les produits électroniques (Android)
- **[Millantech](https://play.google.com/store/apps/details?id=com.phx.boutique)** - Boutique en ligne à Bunia, RDC (Android)
- **[Easykivu](https://easykivu.com/wp/)** - Marketplace e-commerce pour l'est de la RDC
- **[Babutik](https://babutik.com/)** - Application e-commerce multiplateforme
- **[joyfashions](https://joyfashions.shop/)** - Boutique de mode en ligne

### 💰 Fintech
- **[YannExchange](https://yannexchange.com/)** - Plateforme d'échange de crypto-monnaies à Goma, RDC
- **[MbiyoPay](https://mbiyopay.com/)** - Application de paiement mobile sécurisée

### 🎵 Culture & Média
- **[WMA Hub](https://wmahub.com/)** - Plateforme internationale de distribution musicale
- **[WMA+](https://wmaplus.vercel.app/)** - Plateforme premium de streaming musical africain
- **[Viz](https://play.google.com/store/apps/details?id=com.viz)** - Parc numérique artistique avec réalité virtuelle
- **[Gayux](https://gayux.vercel.app/)** - Plateforme de films et documentaires gratuits
- **[Lifechannel](https://lifechannel.vercel.app/)** - Source d'informations en temps réel

### 📊 Gestion & ERP
- **[U-System](https://manager.shopushindi.com/)** - Système de gestion complet pour vente de véhicules
- **[Winnercompany](https://winnercompany.net/)** - Système de gestion de boutique avec ERP

### 🌍 Autres
- **[Cavodi](https://play.google.com/store/apps/details?id=com.viz.cavodi)** - Carnet de voyage numérique
- **[GeoVille](https://play.google.com/store/apps/details?id=com.viz.geoville)** - Application quiz sur les villes du monde
- **[Mosungi](https://www.mosungi.org/)** - Site web pour fondation humanitaire congolaise

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
- 📧 Email: contact@dylankavundama.com
- 💬 WhatsApp: [+243 977 734 735](https://wa.me/243977734735)
- 🐙 GitHub: [@dylankavundama](https://github.com/dylankavundama)

## 🙏 Remerciements

- [Font Awesome](https://fontawesome.com) pour les icônes
- Tous les clients et collaborateurs qui ont fait confiance à mes services
- La communauté open source

---

<div align="center">

**⭐ Si ce projet vous a aidé, n'hésitez pas à mettre une étoile ! ⭐**

Fait avec ❤️ par [Dylan Kavundama](https://github.com/dylankavundama)

</div>

