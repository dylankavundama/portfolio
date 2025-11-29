// ============================================
// GESTION DES ARTICLES DE BLOG
// ============================================

// Clé pour le localStorage
const STORAGE_KEY = 'blog_articles';

// Initialiser la date par défaut à aujourd'hui
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('blog-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Compteur de caractères
    const descriptionTextarea = document.getElementById('blog-description');
    const charCount = document.getElementById('char-count');
    
    if (descriptionTextarea && charCount) {
        descriptionTextarea.addEventListener('input', () => {
            const count = descriptionTextarea.value.length;
            charCount.textContent = `${count} / 500 caractères`;
            
            if (count > 450) {
                charCount.style.color = '#e74c3c';
            } else if (count > 400) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = 'var(--primary-color, #3c94e7)';
            }
        });
    }

    // Charger les articles existants
    loadArticles();
    
    // Charger les statistiques de visites
    loadSiteStats();

    // Gestion du formulaire
    const form = document.getElementById('blog-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Bouton de réinitialisation
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const dateInput = document.getElementById('blog-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
        });
    }

    // Bouton supprimer tout
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', confirmClearAll);
    }
});

const API_BASE_URL = '/api/blog';

// Récupérer les articles depuis l'API
async function getArticles() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des articles');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Gérer la soumission du formulaire
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const linkValue = formData.get('link')?.trim();
    const articleData = {
        image: formData.get('image'),
        title: formData.get('title'),
        description: formData.get('description'),
        link: linkValue || null, // null si vide
        date: formData.get('date'),
        category: formData.get('category') || 'general'
    };

    // Valider l'URL de l'image
    if (!isValidUrl(articleData.image)) {
        alert('Veuillez entrer une URL d\'image valide');
        return;
    }

    // Valider l'URL du lien (optionnel)
    if (articleData.link && !isValidUrl(articleData.link)) {
        alert('Veuillez entrer une URL valide pour le lien');
        return;
    }

    try {
        // Vérifier si on est en mode édition
        const form = e.target;
        const editingId = form.getAttribute('data-editing-id');
        
        let response;
        if (editingId) {
            // Mode édition : PUT
            response = await fetch(`${API_BASE_URL}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });
            // Retirer l'attribut d'édition
            form.removeAttribute('data-editing-id');
        } else {
            // Mode création : POST
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la création de l\'article');
        }

        // Recharger l'affichage
        await loadArticles();
        
        // Réinitialiser le formulaire
        e.target.reset();
        const dateInput = document.getElementById('blog-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        // Réinitialiser le compteur
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0 / 500 caractères';
            charCount.style.color = 'var(--primary-color, #3c94e7)';
        }

        // Message de succès
        showNotification(editingId ? 'Article modifié avec succès !' : 'Article ajouté avec succès !', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification(error.message || 'Erreur lors de la création de l\'article', 'error');
    }
}

// Charger et afficher les articles
async function loadArticles() {
    const articlesList = document.getElementById('articles-list');
    const articlesCount = document.getElementById('articles-count');

    if (!articlesList) return;

    try {
        // Afficher un loader
        articlesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</p>';

        const articles = await getArticles();

        if (articlesCount) {
            articlesCount.textContent = articles.length;
        }

        if (articles.length === 0) {
            articlesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Aucun article pour le moment.</p>';
            return;
        }

        articlesList.innerHTML = articles.map(article => `
            <div class="article-item" data-id="${article.id}">
                <div class="article-item-header">
                    <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" class="article-item-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                    <div class="article-item-info">
                        <div class="article-item-title">${escapeHtml(article.title)}</div>
                        <div class="article-item-description">${escapeHtml(article.description)}</div>
                        <div class="article-item-meta">
                            <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                            <span><i class="fas fa-eye"></i> ${article.views || 0} vues</span>
                            ${article.link ? `<a href="${escapeHtml(article.link)}" target="_blank" class="article-item-link">
                                <i class="fas fa-external-link-alt"></i> Voir l'article
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="article-item-actions">
                    <button class="btn btn-edit" onclick="editArticle('${article.id}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-delete" onclick="deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        articlesList.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 40px;">Erreur lors du chargement des articles.</p>';
    }
}

// Supprimer un article
async function deleteArticle(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la suppression');
        }

        await loadArticles();
        showNotification('Article supprimé avec succès !', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification(error.message || 'Erreur lors de la suppression', 'error');
    }
}

// Modifier un article
async function editArticle(id) {
    try {
        const articles = await getArticles();
        const article = articles.find(a => a.id === id);
        
        if (!article) {
            showNotification('Article non trouvé', 'error');
            return;
        }

    // Remplir le formulaire avec les données de l'article
    document.getElementById('blog-image').value = article.image;
    document.getElementById('blog-title').value = article.title;
    document.getElementById('blog-description').value = article.description;
    document.getElementById('blog-link').value = article.link;
    document.getElementById('blog-date').value = article.date;

    // Mettre à jour le compteur
    const charCount = document.getElementById('char-count');
    if (charCount) {
        const count = article.description.length;
        charCount.textContent = `${count} / 500 caractères`;
    }

    // Stocker l'ID de l'article en cours d'édition
    document.getElementById('blog-form').setAttribute('data-editing-id', id);

    // Scroller vers le formulaire
    document.querySelector('.admin-form-section')?.scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Article chargé pour modification. Modifiez et enregistrez.', 'info');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement de l\'article', 'error');
    }
}

// Confirmer la suppression de tous les articles
async function confirmClearAll() {
    try {
        const articles = await getArticles();
        if (articles.length === 0) {
            alert('Aucun article à supprimer.');
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer tous les ${articles.length} articles ? Cette action est irréversible.`)) {
            // Supprimer tous les articles un par un
            for (const article of articles) {
                await fetch(`${API_BASE_URL}/${article.id}`, {
                    method: 'DELETE'
                });
            }
            await loadArticles();
            showNotification('Tous les articles ont été supprimés.', 'success');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Valider une URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Afficher une notification
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// STATISTIQUES DES VISITES DU SITE
// Utilise Supabase via les API routes Vercel
// ============================================
const STATS_API_URL = '/api/stats';

// Charger et afficher les statistiques
async function loadSiteStats() {
    try {
        const response = await fetch(STATS_API_URL);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des statistiques');
        }
        
        const stats = await response.json();
        
        // Total des visites
        const totalVisitsEl = document.getElementById('total-visits');
        if (totalVisitsEl) {
            totalVisitsEl.textContent = (stats.totalVisits || 0).toLocaleString('fr-FR');
        }
        
        // Visiteurs uniques
        const uniqueVisitorsEl = document.getElementById('unique-visitors');
        if (uniqueVisitorsEl) {
            uniqueVisitorsEl.textContent = (stats.uniqueVisitors || 0).toLocaleString('fr-FR');
        }
        
        // Visites aujourd'hui
        const todayVisitsEl = document.getElementById('today-visits');
        if (todayVisitsEl) {
            todayVisitsEl.textContent = (stats.todayVisits || 0).toLocaleString('fr-FR');
        }
        
        // Visites cette semaine
        const weekVisitsEl = document.getElementById('week-visits');
        if (weekVisitsEl) {
            weekVisitsEl.textContent = (stats.weekVisits || 0).toLocaleString('fr-FR');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        
        // Fallback : utiliser les données locales si disponibles
        const totalVisits = parseInt(localStorage.getItem('site_total_visits') || '0');
        const totalVisitsEl = document.getElementById('total-visits');
        if (totalVisitsEl) {
            totalVisitsEl.textContent = totalVisits.toLocaleString('fr-FR');
        }
        
        const today = new Date().toISOString().split('T')[0];
        const visits = JSON.parse(localStorage.getItem('site_visits') || '{}');
        const todayVisits = visits[today] || 0;
        const todayVisitsEl = document.getElementById('today-visits');
        if (todayVisitsEl) {
            todayVisitsEl.textContent = todayVisits.toLocaleString('fr-FR');
        }
    }
}

// Ajouter les animations CSS si elles n'existent pas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

