// ============================================
// API ROUTE : Test de Configuration
// Vérifie que les variables d'environnement sont bien configurées
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

  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    variables: {
      SUPABASE_URL: {
        configured: !!SUPABASE_URL,
        value: SUPABASE_URL ? (SUPABASE_URL.substring(0, 20) + '...') : 'NON CONFIGURÉ',
        valid: SUPABASE_URL ? SUPABASE_URL.startsWith('https://') : false
      },
      SUPABASE_ANON_KEY: {
        configured: !!SUPABASE_ANON_KEY,
        value: SUPABASE_ANON_KEY ? (SUPABASE_ANON_KEY.substring(0, 20) + '...') : 'NON CONFIGURÉ',
        valid: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.startsWith('eyJ') : false
      },
      SUPABASE_SERVICE_KEY: {
        configured: !!SUPABASE_SERVICE_KEY,
        value: SUPABASE_SERVICE_KEY ? (SUPABASE_SERVICE_KEY.substring(0, 20) + '...') : 'NON CONFIGURÉ',
        valid: SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.startsWith('eyJ') : false
      }
    },
    tests: {
      supabaseConnection: null,
      blogTable: null,
      testimonialsTable: null
    },
    status: 'checking'
  };

  // Test 1 : Vérifier la connexion à Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      });

      results.tests.supabaseConnection = {
        success: healthCheck.ok,
        status: healthCheck.status,
        message: healthCheck.ok ? 'Connexion réussie' : `Erreur ${healthCheck.status}`
      };
    } catch (error) {
      results.tests.supabaseConnection = {
        success: false,
        error: error.message
      };
    }
  } else {
    results.tests.supabaseConnection = {
      success: false,
      message: 'Variables manquantes'
    };
  }

  // Test 2 : Vérifier la table blog_articles
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const blogTest = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      results.tests.blogTable = {
        success: blogTest.ok,
        status: blogTest.status,
        message: blogTest.ok 
          ? 'Table blog_articles accessible' 
          : blogTest.status === 404 
            ? 'Table blog_articles non trouvée (vérifiez le schéma SQL)' 
            : `Erreur ${blogTest.status}`
      };
    } catch (error) {
      results.tests.blogTable = {
        success: false,
        error: error.message
      };
    }
  } else {
    results.tests.blogTable = {
      success: false,
      message: 'Variables manquantes'
    };
  }

  // Test 3 : Vérifier la table testimonials
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const testimonialsTest = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      results.tests.testimonialsTable = {
        success: testimonialsTest.ok,
        status: testimonialsTest.status,
        message: testimonialsTest.ok 
          ? 'Table testimonials accessible' 
          : testimonialsTest.status === 404 
            ? 'Table testimonials non trouvée (vérifiez le schéma SQL)' 
            : `Erreur ${testimonialsTest.status}`
      };
    } catch (error) {
      results.tests.testimonialsTable = {
        success: false,
        error: error.message
      };
    }
  } else {
    results.tests.testimonialsTable = {
      success: false,
      message: 'Variables manquantes'
    };
  }

  // Déterminer le statut global
  const allVariablesConfigured = results.variables.SUPABASE_URL.configured && 
                                  results.variables.SUPABASE_ANON_KEY.configured && 
                                  results.variables.SUPABASE_SERVICE_KEY.configured;

  const allTestsPassed = results.tests.supabaseConnection?.success && 
                         results.tests.blogTable?.success && 
                         results.tests.testimonialsTable?.success;

  if (allVariablesConfigured && allTestsPassed) {
    results.status = 'success';
    results.message = '✅ Toutes les configurations sont correctes !';
  } else if (allVariablesConfigured) {
    results.status = 'warning';
    results.message = '⚠️ Variables configurées mais certains tests ont échoué';
  } else {
    results.status = 'error';
    results.message = '❌ Variables d\'environnement manquantes ou invalides';
  }

  // Retourner les résultats
  const statusCode = results.status === 'success' ? 200 : 
                     results.status === 'warning' ? 200 : 500;

  return res.status(statusCode).json(results);
}

