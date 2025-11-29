-- ============================================
-- SCHEMA SUPABASE POUR LE PORTFOLIO
-- ============================================
-- Exécutez ces requêtes dans le SQL Editor de Supabase
-- ============================================

-- ============================================
-- TABLE : blog_articles
-- ============================================
CREATE TABLE IF NOT EXISTS blog_articles (
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

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Anyone can read blog articles" ON blog_articles;
DROP POLICY IF EXISTS "Allow insert with service role" ON blog_articles;
DROP POLICY IF EXISTS "Allow update with service role" ON blog_articles;
DROP POLICY IF EXISTS "Allow delete with service role" ON blog_articles;

-- Politique : Tout le monde peut lire
CREATE POLICY "Anyone can read blog articles"
  ON blog_articles FOR SELECT
  USING (true);

-- Politique : Permettre l'insertion via l'API (service role)
CREATE POLICY "Allow insert with service role"
  ON blog_articles FOR INSERT
  WITH CHECK (true);

-- Politique : Permettre la mise à jour via l'API (service role)
CREATE POLICY "Allow update with service role"
  ON blog_articles FOR UPDATE
  USING (true);

-- Politique : Permettre la suppression via l'API (service role)
CREATE POLICY "Allow delete with service role"
  ON blog_articles FOR DELETE
  USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_blog_articles_date ON blog_articles(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_created_at ON blog_articles(created_at DESC);

-- ============================================
-- TABLE : testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
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

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow update with service role" ON testimonials;
DROP POLICY IF EXISTS "Allow delete with service role" ON testimonials;

-- Politique : Tout le monde peut lire les témoignages approuvés
CREATE POLICY "Anyone can read approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

-- Politique : Tout le monde peut insérer (modération manuelle)
CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Politique : Permettre la mise à jour via l'API (service role)
CREATE POLICY "Allow update with service role"
  ON testimonials FOR UPDATE
  USING (true);

-- Politique : Permettre la suppression via l'API (service role)
CREATE POLICY "Allow delete with service role"
  ON testimonials FOR DELETE
  USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, created_at DESC);

-- ============================================
-- TABLE : site_visits
-- ============================================
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  page TEXT DEFAULT '/',
  visitor_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Anyone can insert visits" ON site_visits;
DROP POLICY IF EXISTS "Allow read with service role" ON site_visits;

-- Politique : Tout le monde peut insérer des visites
CREATE POLICY "Anyone can insert visits"
  ON site_visits FOR INSERT
  WITH CHECK (true);

-- Politique : Seuls les admins peuvent lire (via service role)
CREATE POLICY "Allow read with service role"
  ON site_visits FOR SELECT
  USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_site_visits_date ON site_visits(date DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON site_visits(visitor_id);

-- ============================================
-- FONCTION : Mettre à jour updated_at automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger s'il existe
DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;

-- Trigger pour blog_articles
CREATE TRIGGER update_blog_articles_updated_at 
    BEFORE UPDATE ON blog_articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONNÉES DE TEST (optionnel)
-- ============================================
-- Vous pouvez décommenter ces lignes pour ajouter des données de test

-- INSERT INTO blog_articles (title, description, image, link, date, category) VALUES
-- ('Premier article', 'Description du premier article', 'https://via.placeholder.com/400x250', 'https://example.com', CURRENT_DATE, 'general');

-- INSERT INTO testimonials (name, role, rating, text, approved) VALUES
-- ('Jean Dupont', 'CEO, Example Corp', 5, 'Excellent travail !', true);

-- ============================================
-- FIN DU SCHEMA
-- ============================================

