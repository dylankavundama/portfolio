// ============================================
// API ROUTE : Testimonials
// GET : Récupérer tous les témoignages approuvés
// POST : Créer un nouveau témoignage
// ============================================

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Configuration Supabase manquante. Vérifiez les variables d\'environnement.' 
    });
  }

  // GET : Récupérer tous les témoignages approuvés
  if (req.method === 'GET') {
    try {
      // Utiliser la clé anon pour la lecture (respecte les politiques RLS)
      const response = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=*&approved=eq.true&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erreur Supabase:', error);
        return res.status(response.status).json({ error: 'Erreur lors de la récupération des témoignages' });
      }

      const testimonials = await response.json();
      return res.status(200).json(testimonials);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des témoignages' });
    }
  }

  // POST : Créer un nouveau témoignage
  if (req.method === 'POST') {
    try {
      const { name, role, rating, text } = req.body;

      // Validation
      if (!name || !rating || !text) {
        return res.status(400).json({ 
          error: 'Les champs name, rating et text sont requis' 
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          error: 'La note doit être entre 1 et 5' 
        });
      }

      const testimonialData = {
        name: name.trim(),
        role: role ? role.trim() : null,
        rating: parseInt(rating),
        text: text.trim(),
        approved: false // Par défaut, non approuvé (modération manuelle)
      };

      // Utiliser la clé anon pour l'insertion (respecte les politiques RLS)
      const response = await fetch(`${SUPABASE_URL}/rest/v1/testimonials`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(testimonialData)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erreur Supabase:', error);
        return res.status(response.status).json({ error: 'Erreur lors de la création du témoignage' });
      }

      const newTestimonial = await response.json();
      return res.status(201).json(newTestimonial[0]);
    } catch (error) {
      console.error('Erreur API:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la création du témoignage' });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ error: 'Méthode non autorisée' });
}

