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

        // Afficher l'article
        displayArticle(article);
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement de l\'article');
    }
}

// Mettre à jour les métadonnées Open Graph et Twitter Cards
function updateMetaTags(article) {
    const baseUrl = window.location.origin;
    const articleUrl = `${baseUrl}/blog-detail.html?id=${article.id}`;
    const articleImage = article.image || `${baseUrl}/asset/b.jpg`;
    const articleTitle = article.title || 'Détail de l\'article - Dylan Kavundama';
    const articleDescription = article.description || 'Découvrez cet article sur le développement, les technologies et les expériences en développement mobile et web.';
    
    // Mettre à jour le titre de la page
    document.title = `${articleTitle} - Dylan Kavundama`;
    
    // Mettre à jour les métadonnées de base
    updateMetaTag('description', articleDescription);
    updateMetaTag('keywords', `Dylan Kavundama, blog, ${articleTitle}, développement, technologies`);
    
    // Mettre à jour Open Graph
    updateMetaTag('og:url', articleUrl, 'property');
    updateMetaTag('og:title', articleTitle, 'property');
    updateMetaTag('og:description', articleDescription, 'property');
    updateMetaTag('og:image', articleImage, 'property');
    updateMetaTag('og:type', 'article', 'property');
    
    // Mettre à jour Twitter Cards
    updateMetaTag('twitter:url', articleUrl, 'property');
    updateMetaTag('twitter:title', articleTitle, 'property');
    updateMetaTag('twitter:description', articleDescription, 'property');
    updateMetaTag('twitter:image', articleImage, 'property');
    
    // Mettre à jour l'URL canonique
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', articleUrl);
}

// Fonction utilitaire pour mettre à jour les métadonnées
function updateMetaTag(name, content, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

// Afficher l'article
function displayArticle(article) {
    const articleContainer = document.getElementById('blog-article');
    if (!articleContainer) return;

    // Mettre à jour les métadonnées pour le partage
    updateMetaTags(article);

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
                ${article.link ? '<p>Pour lire l\'article complet, cliquez sur le lien ci-dessous.</p>' : '<p>Cet article est disponible sur cette page.</p>'}
            </div>
            
            <div class="blog-detail-actions">
                ${article.link ? `
                <a href="${escapeHtml(article.link)}" target="_blank" rel="noopener noreferrer" class="blog-detail-link">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Lire l'article complet</span>
                </a>
                ` : ''}
                <div class="blog-detail-share">
                    <span class="blog-detail-share-label">Partager :</span>
                    <div class="blog-detail-share-buttons">
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'facebook')" title="Partager sur Facebook" aria-label="Partager sur Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'twitter')" title="Partager sur Twitter" aria-label="Partager sur Twitter">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'linkedin')" title="Partager sur LinkedIn" aria-label="Partager sur LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'whatsapp')" title="Partager sur WhatsApp" aria-label="Partager sur WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="blog-detail-share-btn" onclick="shareArticleDetail('${article.id}', 'copy')" title="Copier le lien" aria-label="Copier le lien">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction de partage pour la page de détail
async function shareArticleDetail(articleId, platform) {
    try {
        const response = await fetch(`${API_BASE_URL}/${articleId}`);
        if (!response.ok) return;
        
        const article = await response.json();
        if (!article) return;
    
        // Toujours utiliser l'URL de la page de détail pour rediriger vers le blog
        const baseUrl = window.location.origin;
        const shareUrl = `${baseUrl}/blog-detail.html?id=${articleId}`;
        const url = encodeURIComponent(shareUrl);
        const title = encodeURIComponent(article.title);
        const description = encodeURIComponent(article.description || '');
    
        let shareLink = '';
    
        switch(platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
                break;
                
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}${description ? `&description=${description}` : ''}`;
                window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
                break;
                
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
                break;
                
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${title}%20-%20${description}%20${url}`;
                window.open(shareLink, '_blank', 'noopener,noreferrer');
                break;
                
            case 'copy':
                // Copier le lien dans le presse-papiers
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        showShareNotification('Lien copié dans le presse-papiers !');
                    }).catch(() => {
                        fallbackCopyTextToClipboard(shareUrl);
                    });
                } else {
                    fallbackCopyTextToClipboard(shareUrl);
                }
                break;
        }
    } catch (error) {
        console.error('Erreur lors du partage:', error);
        showShareNotification('Erreur lors du partage', 'error');
    }
}

// Fonction de fallback pour copier le texte
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showShareNotification('Lien copié dans le presse-papiers !');
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        showShareNotification('Erreur lors de la copie du lien', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Afficher une notification de partage
function showShareNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `share-notification share-notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
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

// Ajouter les animations CSS pour les notifications si elles n'existent pas
const shareStyle = document.createElement('style');
shareStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
if (!document.querySelector('style[data-share-animations]')) {
    shareStyle.setAttribute('data-share-animations', 'true');
    document.head.appendChild(shareStyle);
}

