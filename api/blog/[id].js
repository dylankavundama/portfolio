// ============================================
// API ROUTE : Blog Article par ID
// GET : Récupérer un article spécifique
// PUT : Mettre à jour un article
// DELETE : Supprimer un article
// ============================================

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY } = process.env;
  const { id } = req.query;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ 
      error: 'Configuration Supabase manquante. Vérifiez les variables d\'environnement.' 
    });
  }

  if (!id) {
    return res.status(400).json({ error: 'ID de l\'article requis' });
  }

  // GET : Récupérer un article spécifique
  if (req.method === 'GET') {
    try {
      // Utiliser la clé anon pour la lecture (respecte les politiques RLS)
      const apiKey = SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY;
      const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?id=eq.${id}&select=*`, {
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Erreur lors de la récupération de l\'article' });
      }

      const articles = await response.json();
      
      if (articles.length === 0) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Incrémenter le compteur de vues
      await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          views: (articles[0].views || 0) + 1 
        })
      });

      return res.status(200).json(articles[0]);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'article' });
    }
  }

  // PUT : Mettre à jour un article
  if (req.method === 'PUT') {
    try {
      const { title, description, image, link, date, category } = req.body;

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (image) updateData.image = image;
      if (link !== undefined) updateData.link = link;
      if (date) updateData.date = date;
      if (category) updateData.category = category;
      updateData.updated_at = new Date().toISOString();

      const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erreur Supabase:', error);
        return res.status(response.status).json({ error: 'Erreur lors de la mise à jour de l\'article' });
      }

      const updatedArticle = await response.json();
      return res.status(200).json(updatedArticle[0]);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article' });
    }
  }

  // DELETE : Supprimer un article
  if (req.method === 'DELETE') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?id=eq.${id}`, {
        method: 'DELETE',
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
        return res.status(response.status).json({ error: 'Erreur lors de la suppression de l\'article' });
      }

      return res.status(200).json({ message: 'Article supprimé avec succès' });
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article' });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ error: 'Méthode non autorisée' });
}

