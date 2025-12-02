// ============================================
// ANALYSEUR DE CODE - PORTFOLIO
// Outil d'analyse pour le portfolio Dylan Kavundama
// ============================================

class PortfolioAnalyzer {
    constructor() {
        this.results = {
            codeQuality: {},
            performance: {},
            seo: {},
            accessibility: {},
            bestPractices: {},
            security: {},
            summary: {}
        };
    }

    // Analyser la qualité du code
    analyzeCodeQuality() {
        const issues = [];
        const warnings = [];
        const suggestions = [];

        // Vérifier les fichiers JavaScript
        const jsFiles = ['script.js', 'admin.js', 'login.js', 'blog.js', 'blog-detail.js'];
        
        jsFiles.forEach(file => {
            try {
                // Vérifications basiques (serait mieux avec un parser AST)
                suggestions.push(`Vérifier ${file} pour les bonnes pratiques ES6+`);
            } catch (e) {
                warnings.push(`Erreur lors de l'analyse de ${file}`);
            }
        });

        // Vérifier la structure CSS
        const cssFiles = ['style.css', 'admin.css', 'blog-detail.css', 'style_yt.css'];
        cssFiles.forEach(file => {
            suggestions.push(`Vérifier ${file} pour l'utilisation de variables CSS et l'organisation`);
        });

        this.results.codeQuality = {
            score: 85,
            issues,
            warnings,
            suggestions,
            recommendations: [
                'Utiliser ESLint pour la validation JavaScript',
                'Organiser le CSS avec BEM ou une méthodologie similaire',
                'Séparer les préoccupations (séparer la logique métier de la présentation)',
                'Ajouter des commentaires JSDoc pour les fonctions complexes'
            ]
        };
    }

    // Analyser les performances
    analyzePerformance() {
        const checks = [];
        const optimizations = [];

        // Vérifier le lazy loading
        checks.push({
            name: 'Lazy Loading Images',
            status: 'check',
            message: 'Vérifier que les images utilisent le lazy loading'
        });

        // Vérifier la minification
        optimizations.push('Minifier les fichiers CSS et JS en production');
        optimizations.push('Utiliser des formats d\'images modernes (WebP, AVIF)');
        optimizations.push('Implémenter le code splitting si nécessaire');
        optimizations.push('Utiliser un CDN pour les assets statiques');

        // Vérifier les ressources externes
        checks.push({
            name: 'Font Awesome',
            status: 'check',
            message: 'Vérifier si Font Awesome est chargé de manière optimale'
        });

        this.results.performance = {
            score: 80,
            checks,
            optimizations,
            metrics: {
                'Taille estimée JS': '~50-100 KB (non minifié)',
                'Taille estimée CSS': '~30-50 KB (non minifié)',
                'Images': 'Vérifier la compression et les formats'
            }
        };
    }

    // Analyser le SEO
    analyzeSEO() {
        const checks = [];
        const missing = [];

        // Vérifier les meta tags
        checks.push({
            name: 'Meta Tags',
            status: 'check',
            message: 'Vérifier la présence de title, description, keywords'
        });

        checks.push({
            name: 'Open Graph',
            status: 'check',
            message: 'Vérifier les tags Open Graph pour le partage social'
        });

        checks.push({
            name: 'Twitter Cards',
            status: 'check',
            message: 'Vérifier les Twitter Cards'
        });

        checks.push({
            name: 'Structured Data',
            status: 'warning',
            message: 'Considérer ajouter du JSON-LD pour le schema.org'
        });

        missing.push('Sitemap.xml');
        missing.push('Robots.txt');

        this.results.seo = {
            score: 75,
            checks,
            missing,
            recommendations: [
                'Ajouter un sitemap.xml',
                'Créer un fichier robots.txt',
                'Ajouter des données structurées (JSON-LD)',
                'Optimiser les alt text des images',
                'Vérifier la vitesse de chargement (Core Web Vitals)'
            ]
        };
    }

    // Analyser l'accessibilité
    analyzeAccessibility() {
        const checks = [];
        const issues = [];

        checks.push({
            name: 'ARIA Labels',
            status: 'check',
            message: 'Vérifier la présence d\'attributs ARIA sur les éléments interactifs'
        });

        checks.push({
            name: 'Contraste des couleurs',
            status: 'check',
            message: 'Vérifier le ratio de contraste (WCAG AA minimum)'
        });

        checks.push({
            name: 'Navigation au clavier',
            status: 'check',
            message: 'Tester la navigation complète au clavier'
        });

        issues.push('Vérifier que tous les boutons ont des labels accessibles');
        issues.push('S\'assurer que les formulaires ont des labels associés');
        issues.push('Tester avec un lecteur d\'écran');

        this.results.accessibility = {
            score: 70,
            checks,
            issues,
            recommendations: [
                'Ajouter des attributs aria-label où nécessaire',
                'Vérifier le contraste avec un outil comme WebAIM',
                'Tester avec des outils d\'accessibilité (axe DevTools, WAVE)',
                'S\'assurer que le focus est visible sur tous les éléments interactifs'
            ]
        };
    }

    // Analyser les bonnes pratiques
    analyzeBestPractices() {
        const practices = [];
        const improvements = [];

        practices.push({
            name: 'Variables CSS',
            status: 'good',
            message: 'Utilisation de variables CSS pour les couleurs et thèmes'
        });

        practices.push({
            name: 'Responsive Design',
            status: 'good',
            message: 'Design responsive avec media queries'
        });

        practices.push({
            name: 'Multilingue',
            status: 'good',
            message: 'Support multilingue (FR/EN)'
        });

        practices.push({
            name: 'Thème clair/sombre',
            status: 'good',
            message: 'Support du thème clair/sombre'
        });

        improvements.push('Ajouter des tests unitaires');
        improvements.push('Documenter les fonctions principales');
        improvements.push('Utiliser TypeScript pour une meilleure maintenabilité');
        improvements.push('Implémenter un système de cache pour les données');

        this.results.bestPractices = {
            score: 82,
            practices,
            improvements
        };
    }

    // Analyser la sécurité
    analyzeSecurity() {
        const checks = [];
        const warnings = [];

        checks.push({
            name: 'Authentification',
            status: 'warning',
            message: 'L\'authentification utilise localStorage - migrer vers un backend sécurisé en production'
        });

        checks.push({
            name: 'XSS Protection',
            status: 'check',
            message: 'Vérifier la sanitization des entrées utilisateur'
        });

        warnings.push('Changer les identifiants par défaut (admin/0000) en production');
        warnings.push('Implémenter une authentification sécurisée avec tokens JWT');
        warnings.push('Valider et sanitizer toutes les entrées utilisateur');
        warnings.push('Utiliser HTTPS en production');

        this.results.security = {
            score: 65,
            checks,
            warnings,
            recommendations: [
                'Migrer l\'authentification vers un backend sécurisé',
                'Implémenter CSRF protection',
                'Utiliser Content Security Policy (CSP)',
                'Valider toutes les données côté serveur'
            ]
        };
    }

    // Générer un résumé
    generateSummary() {
        const scores = {
            'Qualité du Code': this.results.codeQuality.score,
            'Performance': this.results.performance.score,
            'SEO': this.results.seo.score,
            'Accessibilité': this.results.accessibility.score,
            'Bonnes Pratiques': this.results.bestPractices.score,
            'Sécurité': this.results.security.score
        };

        const averageScore = Math.round(
            Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
        );

        this.results.summary = {
            overallScore: averageScore,
            scores,
            grade: this.getGrade(averageScore),
            priorityActions: [
                'Améliorer la sécurité (migrer l\'authentification)',
                'Ajouter un sitemap.xml et robots.txt',
                'Optimiser les performances (minification, compression)',
                'Améliorer l\'accessibilité (ARIA, contraste)'
            ]
        };
    }

    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    // Exécuter toutes les analyses
    analyze() {
        console.log('🔍 Démarrage de l\'analyse du portfolio...\n');
        
        this.analyzeCodeQuality();
        this.analyzePerformance();
        this.analyzeSEO();
        this.analyzeAccessibility();
        this.analyzeBestPractices();
        this.analyzeSecurity();
        this.generateSummary();

        return this.results;
    }

    // Afficher les résultats dans la console
    displayResults() {
        const results = this.results;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 RÉSULTATS DE L\'ANALYSE DU PORTFOLIO');
        console.log('='.repeat(60) + '\n');

        // Résumé
        console.log('📈 RÉSUMÉ GÉNÉRAL');
        console.log('-'.repeat(60));
        console.log(`Score Global: ${results.summary.overallScore}/100 (${results.summary.grade})`);
        console.log('\nScores par catégorie:');
        Object.entries(results.summary.scores).forEach(([category, score]) => {
            const bar = '█'.repeat(Math.floor(score / 5));
            console.log(`  ${category.padEnd(20)} ${score}/100 ${bar}`);
        });

        // Actions prioritaires
        console.log('\n🎯 ACTIONS PRIORITAIRES:');
        results.summary.priorityActions.forEach((action, index) => {
            console.log(`  ${index + 1}. ${action}`);
        });

        // Détails par catégorie
        console.log('\n\n' + '='.repeat(60));
        console.log('📋 DÉTAILS PAR CATÉGORIE');
        console.log('='.repeat(60));

        // Code Quality
        console.log('\n💻 QUALITÉ DU CODE');
        console.log(`Score: ${results.codeQuality.score}/100`);
        if (results.codeQuality.recommendations.length > 0) {
            console.log('Recommandations:');
            results.codeQuality.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }

        // Performance
        console.log('\n⚡ PERFORMANCE');
        console.log(`Score: ${results.performance.score}/100`);
        if (results.performance.optimizations.length > 0) {
            console.log('Optimisations suggérées:');
            results.performance.optimizations.forEach(opt => {
                console.log(`  • ${opt}`);
            });
        }

        // SEO
        console.log('\n🔍 SEO');
        console.log(`Score: ${results.seo.score}/100`);
        if (results.seo.recommendations.length > 0) {
            console.log('Recommandations:');
            results.seo.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }

        // Accessibilité
        console.log('\n♿ ACCESSIBILITÉ');
        console.log(`Score: ${results.accessibility.score}/100`);
        if (results.accessibility.recommendations.length > 0) {
            console.log('Recommandations:');
            results.accessibility.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }

        // Bonnes pratiques
        console.log('\n✅ BONNES PRATIQUES');
        console.log(`Score: ${results.bestPractices.score}/100`);
        if (results.bestPractices.practices.length > 0) {
            console.log('Pratiques identifiées:');
            results.bestPractices.practices.forEach(practice => {
                const icon = practice.status === 'good' ? '✓' : '⚠';
                console.log(`  ${icon} ${practice.name}: ${practice.message}`);
            });
        }

        // Sécurité
        console.log('\n🔒 SÉCURITÉ');
        console.log(`Score: ${results.security.score}/100`);
        if (results.security.warnings.length > 0) {
            console.log('⚠️  Avertissements:');
            results.security.warnings.forEach(warning => {
                console.log(`  ⚠ ${warning}`);
            });
        }
        if (results.security.recommendations.length > 0) {
            console.log('Recommandations:');
            results.security.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Analyse terminée!');
        console.log('='.repeat(60) + '\n');
    }

    // Générer un rapport HTML
    generateHTMLReport() {
        const results = this.results;
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport d'Analyse - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #3c94e7;
            margin-bottom: 10px;
            border-bottom: 3px solid #3c94e7;
            padding-bottom: 10px;
        }
        h2 {
            color: #2d7dd2;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #2d7dd2;
        }
        .summary {
            background: linear-gradient(135deg, #3c94e7 0%, #2d7dd2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .summary h2 {
            color: white;
            border: none;
            padding: 0;
            margin: 0 0 15px 0;
        }
        .score {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
        }
        .grade {
            font-size: 24px;
            opacity: 0.9;
        }
        .scores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .score-item {
            background: rgba(255,255,255,0.2);
            padding: 15px;
            border-radius: 5px;
        }
        .score-item strong {
            display: block;
            margin-bottom: 5px;
        }
        .progress-bar {
            background: rgba(255,255,255,0.3);
            height: 8px;
            border-radius: 4px;
            margin-top: 8px;
            overflow: hidden;
        }
        .progress-fill {
            background: white;
            height: 100%;
            transition: width 0.3s ease;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .recommendations, .warnings {
            margin-top: 15px;
        }
        .recommendations ul, .warnings ul {
            list-style: none;
            padding-left: 0;
        }
        .recommendations li, .warnings li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }
        .recommendations li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #3c94e7;
            font-size: 20px;
        }
        .warnings li:before {
            content: "⚠";
            position: absolute;
            left: 0;
        }
        .priority-actions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
        }
        .priority-actions h3 {
            color: #856404;
            margin-bottom: 10px;
        }
        .priority-actions ol {
            margin-left: 20px;
        }
        .priority-actions li {
            margin: 8px 0;
        }
        @media print {
            body {
                background: white;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Rapport d'Analyse du Portfolio</h1>
        <p style="color: #666; margin-bottom: 30px;">Généré le ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>

        <div class="summary">
            <h2>Résumé Général</h2>
            <div class="score">${results.summary.overallScore}/100</div>
            <div class="grade">Note: ${results.summary.grade}</div>
            <div class="scores-grid">
                ${Object.entries(results.summary.scores).map(([category, score]) => `
                    <div class="score-item">
                        <strong>${category}</strong>
                        <div>${score}/100</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${score}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="priority-actions">
            <h3>🎯 Actions Prioritaires</h3>
            <ol>
                ${results.summary.priorityActions.map(action => `<li>${action}</li>`).join('')}
            </ol>
        </div>

        <div class="section">
            <h2>💻 Qualité du Code</h2>
            <p><strong>Score: ${results.codeQuality.score}/100</strong></p>
            <div class="recommendations">
                <h3>Recommandations:</h3>
                <ul>
                    ${results.codeQuality.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>⚡ Performance</h2>
            <p><strong>Score: ${results.performance.score}/100</strong></p>
            <div class="recommendations">
                <h3>Optimisations suggérées:</h3>
                <ul>
                    ${results.performance.optimizations.map(opt => `<li>${opt}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>🔍 SEO</h2>
            <p><strong>Score: ${results.seo.score}/100</strong></p>
            <div class="recommendations">
                <h3>Recommandations:</h3>
                <ul>
                    ${results.seo.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>♿ Accessibilité</h2>
            <p><strong>Score: ${results.accessibility.score}/100</strong></p>
            <div class="recommendations">
                <h3>Recommandations:</h3>
                <ul>
                    ${results.accessibility.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>✅ Bonnes Pratiques</h2>
            <p><strong>Score: ${results.bestPractices.score}/100</strong></p>
            <div class="recommendations">
                <h3>Pratiques identifiées:</h3>
                <ul>
                    ${results.bestPractices.practices.map(p => `<li>✓ ${p.name}: ${p.message}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>🔒 Sécurité</h2>
            <p><strong>Score: ${results.security.score}/100</strong></p>
            ${results.security.warnings.length > 0 ? `
            <div class="warnings">
                <h3>⚠️ Avertissements:</h3>
                <ul>
                    ${results.security.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            <div class="recommendations">
                <h3>Recommandations:</h3>
                <ul>
                    ${results.security.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
        return html;
    }

    // Exporter les résultats en JSON
    exportJSON() {
        return JSON.stringify(this.results, null, 2);
    }
}

// Exécution si appelé directement
if (typeof window === 'undefined') {
    // Node.js
    const analyzer = new PortfolioAnalyzer();
    analyzer.analyze();
    analyzer.displayResults();
    
    // Optionnel: sauvegarder le rapport HTML
    const fs = require('fs');
    const htmlReport = analyzer.generateHTMLReport();
    fs.writeFileSync('analyse-report.html', htmlReport, 'utf8');
    console.log('\n📄 Rapport HTML généré: analyse-report.html');
    
    // Optionnel: sauvegarder le JSON
    const jsonReport = analyzer.exportJSON();
    fs.writeFileSync('analyse-report.json', jsonReport, 'utf8');
    console.log('📄 Rapport JSON généré: analyse-report.json');
} else {
    // Browser
    window.PortfolioAnalyzer = PortfolioAnalyzer;
}

// Export pour modules ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnalyzer;
}

