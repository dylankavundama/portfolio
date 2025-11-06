// ============================================
// GESTION DE LA PAGE DE DÉTAIL DU BLOG
// ============================================

const STORAGE_KEY = 'blog_articles';
const VIEWS_KEY = 'blog_views';

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadBlogArticle();
    initLanguage();
});

// Charger l'article depuis l'URL
function loadBlogArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        showError('Article non trouvé');
        return;
    }

    const articles = getBlogArticles();
    const article = articles.find(a => a.id === articleId);

    if (!article) {
        showError('Article non trouvé');
        return;
    }

    // Incrémenter le compteur de vues
    incrementViews(articleId);

    // Afficher l'article
    displayArticle(article);
}

// Récupérer les articles
function getBlogArticles() {
    const articles = localStorage.getItem(STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
}

// Récupérer les vues
function getViews() {
    const views = localStorage.getItem(VIEWS_KEY);
    return views ? JSON.parse(views) : {};
}

// Sauvegarder les vues
function saveViews(views) {
    localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
}

// Incrémenter le compteur de vues
function incrementViews(articleId) {
    const views = getViews();
    
    if (!views[articleId]) {
        views[articleId] = 0;
    }
    
    views[articleId]++;
    saveViews(views);
    
    // Mettre à jour les vues dans l'article
    updateArticleViews(articleId, views[articleId]);
}

// Mettre à jour les vues dans l'article
function updateArticleViews(articleId, viewCount) {
    const articles = getBlogArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex !== -1) {
        if (!articles[articleIndex].views) {
            articles[articleIndex].views = 0;
        }
        articles[articleIndex].views = viewCount;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
}

// Obtenir le nombre de vues
function getArticleViews(articleId) {
    const views = getViews();
    return views[articleId] || 0;
}

// Afficher l'article
function displayArticle(article) {
    const articleContainer = document.getElementById('blog-article');
    if (!articleContainer) return;

    const views = getArticleViews(article.id);
    const formattedDate = formatDate(article.date);

    articleContainer.innerHTML = `
        <div class="blog-detail-image-container">
            <img src="${escapeHtml(article.image)}" 
                 alt="${escapeHtml(article.title)}" 
                 class="blog-detail-image"
                 onerror="this.src='https://via.placeholder.com/900x400?text=Image+non+disponible'">
        </div>
        <div class="blog-detail-content">
            <div class="blog-detail-header">
                <div class="blog-detail-meta">
                    <div class="blog-detail-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="blog-views-count">
                        <i class="fas fa-eye"></i>
                        <span id="views-count">${views}</span>
                        <span>${views === 1 ? 'vue' : 'vues'}</span>
                    </div>
                </div>
                <h1 class="blog-detail-title">${escapeHtml(article.title)}</h1>
                <p class="blog-detail-description">${escapeHtml(article.description)}</p>
            </div>
            
            <div class="blog-detail-body">
                <p>${escapeHtml(article.description)}</p>
                <p>Pour lire l'article complet, cliquez sur le lien ci-dessous.</p>
            </div>
            
            <div class="blog-detail-actions">
                <a href="${escapeHtml(article.link)}" target="_blank" class="blog-detail-link">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Lire l'article complet</span>
                </a>
                <div class="blog-detail-share">
                    <span class="blog-detail-share-label">Partager :</span>
                    <div class="blog-detail-share-buttons">
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'facebook')" title="Partager sur Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'twitter')" title="Partager sur Twitter">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'linkedin')" title="Partager sur LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'whatsapp')" title="Partager sur WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction de partage pour la page de détail
function shareArticleDetail(articleId, platform) {
    const articles = getBlogArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) return;
    
    const url = encodeURIComponent(article.link);
    const title = encodeURIComponent(article.title);
    const currentUrl = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            window.open(shareUrl, '_blank');
            break;
    }
}

// Afficher une erreur
function showError(message) {
    const articleContainer = document.getElementById('blog-article');
    if (!articleContainer) return;

    articleContainer.innerHTML = `
        <div class="blog-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>${message}</h2>
            <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <a href="index.html#blog">Retour au blog</a>
        </div>
    `;
}

// Fonctions utilitaires
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialiser la langue
function initLanguage() {
    if (typeof initLanguage === 'function' && typeof translations !== 'undefined') {
        // La fonction initLanguage est déjà définie dans script.js
        return;
    }
    
    // Fallback si script.js n'est pas chargé
    let currentLanguage = localStorage.getItem('language') || 'fr';
    
    function updateLanguage(lang) {
        if (!translations || !translations[lang]) return;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let translation = translations[lang];
            
            for (const k of keys) {
                translation = translation?.[k];
            }
            
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    updateLanguage(currentLanguage);
}

