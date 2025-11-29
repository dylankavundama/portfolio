# 🔍 Guide de Débogage - Section Blog Vide

## Problème
La section "MON BLOG" affiche "Aucun article pour le moment" alors que vous avez créé des articles.

## ✅ Vérifications à faire

### 1. Vérifier dans Supabase que les articles existent

1. **Allez sur votre projet Supabase**
2. **Table Editor** → Sélectionnez la table `blog_articles`
3. **Vérifiez** qu'il y a bien des articles dans la table

**Si la table est vide** :
- Les articles n'ont pas été créés correctement
- Vérifiez les logs dans l'admin lors de la création

**Si la table contient des articles** :
- Le problème vient de l'API ou des politiques RLS
- Passez à l'étape 2

### 2. Vérifier les politiques RLS dans Supabase

1. **Allez dans** Authentication → Policies
2. **Vérifiez** que la politique "Anyone can read blog articles" existe pour la table `blog_articles`
3. **Si elle n'existe pas**, exécutez cette requête SQL :

```sql
CREATE POLICY "Anyone can read blog articles"
  ON blog_articles FOR SELECT
  USING (true);
```

### 3. Tester l'API directement

Ouvrez dans votre navigateur (remplacez par votre URL Vercel) :
```
https://votre-site.vercel.app/api/blog
```

**Résultats possibles** :
- `[]` → Aucun article dans la base (vérifiez Supabase)
- `[{...}]` → Les articles existent, le problème vient du frontend
- `{"error": "..."}` → Erreur API (vérifiez les variables d'environnement)

### 4. Vérifier les variables d'environnement sur Vercel

1. **Allez sur Vercel** → Votre projet → Settings → Environment Variables
2. **Vérifiez** que ces 3 variables existent :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### 5. Vérifier la console du navigateur

1. **Ouvrez** votre site
2. **Appuyez sur F12** pour ouvrir la console
3. **Allez sur l'onglet Console**
4. **Recherchez** les messages d'erreur en rouge
5. **Regardez** les messages qui commencent par "Articles reçus:" ou "Erreur"

### 6. Vérifier les logs Vercel

1. **Allez sur Vercel** → Votre projet → Functions
2. **Cliquez sur** `/api/blog`
3. **Regardez** les logs des dernières requêtes
4. **Cherchez** les erreurs

## 🔧 Solutions courantes

### Solution 1 : Les articles n'ont pas été créés

**Symptôme** : La table `blog_articles` est vide dans Supabase

**Solution** :
1. Créez un nouvel article depuis l'admin
2. Vérifiez qu'un message de succès s'affiche
3. Vérifiez dans Supabase que l'article apparaît

### Solution 2 : Les politiques RLS bloquent l'accès

**Symptôme** : Les articles existent dans Supabase mais l'API retourne une erreur 401 ou 403

**Solution** :
Exécutez cette requête SQL dans Supabase :

```sql
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can read blog articles" ON blog_articles;

-- Créer la nouvelle politique
CREATE POLICY "Anyone can read blog articles"
  ON blog_articles FOR SELECT
  USING (true);
```

### Solution 3 : Les variables d'environnement sont incorrectes

**Symptôme** : L'API retourne une erreur 500 avec "Configuration Supabase manquante"

**Solution** :
1. Vérifiez que les variables sont bien configurées sur Vercel
2. **Redéployez** votre projet après avoir ajouté/modifié les variables
3. Vérifiez que les clés sont correctes (copiées depuis Supabase)

### Solution 4 : Le format de date est incorrect

**Symptôme** : Les articles existent mais ne s'affichent pas

**Solution** :
Vérifiez que le format de date dans Supabase est `YYYY-MM-DD` (ex: `2025-01-27`)

## 📝 Test rapide

Exécutez cette requête dans le SQL Editor de Supabase pour vérifier les articles :

```sql
SELECT id, title, date, created_at 
FROM blog_articles 
ORDER BY created_at DESC 
LIMIT 10;
```

Si cette requête retourne des résultats, les articles existent et le problème vient de l'API ou du frontend.

## 🆘 Si rien ne fonctionne

1. **Vérifiez** que vous avez bien exécuté `supabase-schema.sql` dans Supabase
2. **Vérifiez** que les tables existent (Table Editor)
3. **Vérifiez** que les politiques RLS sont activées et correctes
4. **Vérifiez** les logs Vercel pour les erreurs détaillées
5. **Contactez** le support si le problème persiste

---

**Note** : Après avoir modifié les politiques RLS ou les variables d'environnement, attendez quelques secondes avant de tester à nouveau.

