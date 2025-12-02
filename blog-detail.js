// ============================================
// GESTION DE LA PAGE DE DÉTAIL DU BLOG
// Utilise Supabase via les API routes Vercel
// ============================================

const API_BASE_URL = '/api/blog';

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadBlogArticle();
    initLanguage();
});

// Charger l'article depuis l'URL
async function loadBlogArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        showError('Article non trouvé');
        return;
    }

    try {
        // Charger l'article depuis l'API (cela incrémente aussi les vues automatiquement)
        const response = await fetch(`${API_BASE_URL}/${articleId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                showError('Article non trouvé');
                return;
            }
            throw new Error('Erreur lors du chargement de l\'article');
        }

        const article = await response.json();

        // Mettre à jour les meta tags Open Graph pour le partage social
        updateOpenGraphTags(article);

        // Afficher l'article
        displayArticle(article);
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement de l\'article');
    }
}

// Afficher l'article
function displayArticle(article) {
    const articleContainer = document.getElementById('blog-article');
    if (!articleContainer) return;

    const views = article.views || 0;
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
                ${article.link ? `
                <a href="${escapeHtml(article.link)}" target="_blank" class="blog-detail-link">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Lire l'article complet</span>
                </a>
                ` : ''}
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

// Mettre à jour les meta tags Open Graph pour le partage social
function updateOpenGraphTags(article) {
    // Titre
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', article.title);

    // Description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', article.description || article.title);

    // Image
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', article.image);

    // URL
    const shareUrl = article.link || window.location.href;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', shareUrl);

    // Type
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
        ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'article');

    // Twitter Cards
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
        twitterTitle = document.createElement('meta');
        twitterTitle.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', article.title);

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
        twitterDescription = document.createElement('meta');
        twitterDescription.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', article.description || article.title);

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', article.image);

    // Mettre à jour le titre de la page
    document.title = `${article.title} - Dylan Kavundama`;
}

// Fonction de partage pour la page de détail
async function shareArticleDetail(articleId, platform) {
    try {
        const response = await fetch(`${API_BASE_URL}/${articleId}`);
        if (!response.ok) return;
        
        const article = await response.json();
        if (!article) return;
    
        // Utiliser le lien de l'article s'il existe, sinon l'URL actuelle
        const shareUrl = article.link || window.location.href;
        const url = encodeURIComponent(shareUrl);
        const title = encodeURIComponent(article.title);
        const description = encodeURIComponent((article.description || article.title).substring(0, 200));
        const image = encodeURIComponent(article.image || '');
    
        let shareLink = '';
    
        switch(platform) {
            case 'facebook':
                // Facebook utilise les meta tags Open Graph, mais on peut aussi passer l'URL
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'twitter':
                // Twitter avec description et image via les Cards
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}%20-%20${description}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'linkedin':
                // LinkedIn utilise les meta tags Open Graph
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'whatsapp':
                // WhatsApp avec titre, description et URL
                const whatsappText = `${title}%0A%0A${description}%0A%0A${url}`;
                shareLink = `https://wa.me/?text=${whatsappText}`;
                window.open(shareLink, '_blank');
                break;
        }
    } catch (error) {
        console.error('Erreur lors du partage:', error);
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
            <a href="blog.html">Retour au blog</a>
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

