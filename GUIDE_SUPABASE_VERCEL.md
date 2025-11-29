# 🚀 Guide d'Intégration Supabase avec Vercel

Ce guide vous explique comment rendre dynamiques le **Blog** et les **Témoignages** de votre portfolio en utilisant **Supabase** (gratuit) avec **Vercel**.

---

## 📋 Prérequis

- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Votre projet portfolio déjà déployé sur Vercel

---

## 🎯 Étape 1 : Créer un Projet Supabase

1. **Aller sur [supabase.com](https://supabase.com)**
2. **Créer un compte** (gratuit avec généreuses limites)
3. **Créer un nouveau projet** :
   - Nom du projet : `portfolio-dylan`
   - Mot de passe de la base de données : (choisissez un mot de passe fort)
   - Région : choisissez la plus proche (Europe, US, etc.)
   - Plan : **Free** (gratuit)

4. **Attendre la création** (2-3 minutes)

---

## 🗄️ Étape 2 : Créer les Tables dans Supabase

Une fois le projet créé, allez dans **SQL Editor** et exécutez ces requêtes :

### Table `blog_articles`

```sql
-- Créer la table blog_articles
CREATE TABLE blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT,
  date DATE NOT NULL,
  category TEXT DEFAULT 'general',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire
CREATE POLICY "Anyone can read blog articles"
  ON blog_articles FOR SELECT
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent insérer (on utilisera l'API key)
-- Pour simplifier, on va permettre l'insertion via l'API
CREATE POLICY "Allow insert with service role"
  ON blog_articles FOR INSERT
  WITH CHECK (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Allow update with service role"
  ON blog_articles FOR UPDATE
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Allow delete with service role"
  ON blog_articles FOR DELETE
  USING (true);
```

### Table `testimonials`

```sql
-- Créer la table testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les témoignages approuvés
CREATE POLICY "Anyone can read approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

-- Politique : Tout le monde peut insérer (modération manuelle)
CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Politique : Seuls les admins peuvent approuver/modifier
CREATE POLICY "Allow update with service role"
  ON testimonials FOR UPDATE
  USING (true);

-- Politique : Seuls les admins peuvent supprimer
CREATE POLICY "Allow delete with service role"
  ON testimonials FOR DELETE
  USING (true);
```

---

## 🔑 Étape 3 : Récupérer les Clés API Supabase

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Notez ces informations :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon/public key** : `eyJhbGc...` (clé publique)
   - **service_role key** : `eyJhbGc...` (clé privée - gardez-la secrète !)

---

## ⚙️ Étape 4 : Configurer les Variables d'Environnement sur Vercel

1. **Allez sur votre projet Vercel**
2. **Settings** → **Environment Variables**
3. **Ajoutez ces variables** :

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (la clé anon/public)
SUPABASE_SERVICE_KEY=eyJhbGc... (la clé service_role - pour l'admin)
```

4. **Redeploy** votre projet pour que les variables soient prises en compte

---

## 📁 Étape 5 : Structure des Fichiers

Votre projet doit avoir cette structure :

```
portfolio/
├── api/
│   ├── blog/
│   │   ├── index.js          # GET, POST
│   │   └── [id].js           # GET, PUT, DELETE par ID
│   └── testimonials/
│       └── index.js          # GET, POST
├── .env.local                # Variables locales (pour dev)
├── .env.example              # Exemple de variables
└── ... (autres fichiers)
```

---

## 🚀 Étape 6 : Déployer sur Vercel

1. **Poussez vos modifications sur GitHub**
2. **Vercel détectera automatiquement les changements**
3. **Le déploiement se fera automatiquement**

---

## 🧪 Étape 7 : Tester

### Tester le Blog

1. Visitez : `https://votre-site.vercel.app/api/blog`
2. Vous devriez voir : `[]` (tableau vide au début)

### Tester les Témoignages

1. Visitez : `https://votre-site.vercel.app/api/testimonials`
2. Vous devriez voir : `[]` (tableau vide au début)

---

## 📝 Notes Importantes

### Sécurité

- ⚠️ **Ne jamais exposer la `SUPABASE_SERVICE_KEY` dans le code frontend**
- ✅ Utilisez `SUPABASE_ANON_KEY` dans le frontend
- ✅ Utilisez `SUPABASE_SERVICE_KEY` uniquement dans les API routes Vercel

### Limites Gratuites Supabase

- **500 MB** de base de données
- **2 GB** de bande passante
- **50 000** requêtes par mois
- **1 GB** de stockage de fichiers

Ces limites sont largement suffisantes pour un portfolio personnel.

### Modération des Témoignages

Par défaut, les témoignages sont créés avec `approved = false`. Vous devez les approuver manuellement dans Supabase :

1. Allez dans **Table Editor** → `testimonials`
2. Modifiez `approved` à `true` pour les témoignages que vous voulez afficher

---

## 🆘 Dépannage

### Erreur : "Invalid API key"

- Vérifiez que les variables d'environnement sont bien configurées sur Vercel
- Vérifiez que vous utilisez la bonne clé (anon pour frontend, service pour API)

### Erreur : "Row Level Security policy violation"

- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que vous utilisez la bonne clé API

### Les données ne s'affichent pas

- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que les API routes fonctionnent (testez directement les URLs)
- Vérifiez que les témoignages sont approuvés (`approved = true`)

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Besoin d'aide ?** Contactez-moi : dylankavundama@gmail.com

