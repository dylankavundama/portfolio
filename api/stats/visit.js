// ============================================
// API ROUTE : Enregistrer une visite
// POST : Enregistrer une nouvelle visite
// ============================================

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Configuration Supabase manquante' 
    });
  }

  try {
    const { date, page, visitorId } = req.body;

    // Validation
    if (!date) {
      return res.status(400).json({ 
        error: 'La date est requise' 
      });
    }

    const visitData = {
      date,
      page: page || '/',
      visitor_id: visitorId || null,
      timestamp: new Date().toISOString()
    };

    // Utiliser la clé anon pour l'insertion (respecte les politiques RLS)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(visitData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erreur Supabase:', error);
      return res.status(response.status).json({ 
        error: 'Erreur lors de l\'enregistrement de la visite',
        details: error
      });
    }

    const newVisit = await response.json();
    return res.status(201).json(newVisit[0] || newVisit);
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur lors de l\'enregistrement de la visite',
      details: error.message
    });
  }
}

