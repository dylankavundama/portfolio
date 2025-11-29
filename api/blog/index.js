// ============================================
// API ROUTE : Blog Articles
// GET : Récupérer tous les articles
// POST : Créer un nouvel article
// ============================================

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ 
      error: 'Configuration Supabase manquante. Vérifiez les variables d\'environnement.' 
    });
  }

  // GET : Récupérer tous les articles
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erreur Supabase:', error);
        return res.status(response.status).json({ error: 'Erreur lors de la récupération des articles' });
      }

      const articles = await response.json();
      return res.status(200).json(articles);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles' });
    }
  }

  // POST : Créer un nouvel article
  if (req.method === 'POST') {
    try {
      const { title, description, image, link, date, category } = req.body;

      // Validation
      if (!title || !description || !image || !date) {
        return res.status(400).json({ 
          error: 'Les champs title, description, image et date sont requis' 
        });
      }

      const articleData = {
        title,
        description,
        image,
        link: link || null,
        date,
        category: category || 'general',
        views: 0
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(articleData)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erreur Supabase:', error);
        return res.status(response.status).json({ error: 'Erreur lors de la création de l\'article' });
      }

      const newArticle = await response.json();
      return res.status(201).json(newArticle[0]);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la création de l\'article' });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ error: 'Méthode non autorisée' });
}

