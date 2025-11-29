// ============================================
// API ROUTE : Statistiques du site
// GET : Récupérer les statistiques agrégées
// ============================================

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Configuration Supabase manquante' 
    });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // Utiliser la clé service pour les statistiques (besoin de plus de permissions)
    const apiKey = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

    // Récupérer toutes les visites
    const allVisitsResponse = await fetch(`${SUPABASE_URL}/rest/v1/site_visits?select=*`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!allVisitsResponse.ok) {
      throw new Error('Erreur lors de la récupération des visites');
    }

    const allVisits = await allVisitsResponse.json();

    // Calculer les statistiques
    const totalVisits = allVisits.length;

    // Visiteurs uniques (nombre de visitor_id uniques)
    const uniqueVisitors = new Set(
      allVisits
        .filter(v => v.visitor_id)
        .map(v => v.visitor_id)
    ).size;

    // Visites aujourd'hui
    const todayVisits = allVisits.filter(v => v.date === today).length;

    // Visites cette semaine
    const weekVisits = allVisits.filter(v => {
      const visitDate = new Date(v.date);
      const weekAgoDate = new Date(weekAgoStr);
      return visitDate >= weekAgoDate;
    }).length;

    // Visites par jour (pour les graphiques futurs)
    const visitsByDate = {};
    allVisits.forEach(visit => {
      if (!visitsByDate[visit.date]) {
        visitsByDate[visit.date] = 0;
      }
      visitsByDate[visit.date]++;
    });

    return res.status(200).json({
      totalVisits,
      uniqueVisitors,
      todayVisits,
      weekVisits,
      visitsByDate
    });
  } catch (error) {
    console.error('Erreur API stats:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des statistiques',
      details: error.message
    });
  }
}

