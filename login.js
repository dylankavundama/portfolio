// ============================================
// GESTION DE LA CONNEXION
// ============================================

// Identifiants par défaut (à changer en production)
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = '0000';

// Clé pour le localStorage
const AUTH_KEY = 'blog_auth';
const SESSION_KEY = 'blog_session';

// Vérifier si l'utilisateur est déjà connecté (uniquement sur login.html)
document.addEventListener('DOMContentLoaded', () => {
    // Ne pas exécuter cette vérification si on est déjà sur admin.html
    if (window.location.pathname.includes('admin.html')) {
        return;
    }
    
    // Vérifier la session uniquement sur login.html
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // Vérifier si la session est toujours valide (24 heures)
        if (sessionData.expires > now) {
            window.location.href = 'admin.html';
            return;
        } else {
            // Session expirée
            localStorage.removeItem(SESSION_KEY);
        }
    }

    // Gestion du toggle du mot de passe
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Gérer la connexion
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loginBtn = document.getElementById('login-btn');
    const loginBox = document.querySelector('.login-box');

    // Masquer les messages précédents
    if (errorMessage) errorMessage.classList.remove('show');
    if (successMessage) successMessage.classList.remove('show');

    // Activer l'état de chargement
    if (loginBtn) {
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = '<i class="fas fa-spinner"></i><span>Connexion...</span>';
    }

    // Récupérer les identifiants sauvegardés ou utiliser les valeurs par défaut
    const savedAuth = localStorage.getItem(AUTH_KEY);
    let authData;
    
    if (savedAuth) {
        authData = JSON.parse(savedAuth);
    } else {
        // Première connexion, utiliser les identifiants par défaut
        authData = {
            username: DEFAULT_USERNAME,
            password: DEFAULT_PASSWORD
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }

    // Simuler un délai pour l'animation (meilleure UX)
    setTimeout(() => {
        // Vérifier les identifiants
        if (username === authData.username && password === authData.password) {
            // Créer une session valide pour 24 heures
            const sessionData = {
                username: username,
                expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 heures
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

            // Afficher un message de succès
            if (successMessage) {
                successMessage.classList.add('show');
            }

            // Animation de succès
            if (loginBox) {
                loginBox.style.animation = 'pulse 0.5s ease';
            }

            // Rediriger vers la page d'administration après un court délai
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            // Réinitialiser le bouton
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Se connecter</span>';
            }

            // Afficher l'erreur
            if (errorMessage) {
                errorMessage.classList.add('show');
            }

            // Effacer le champ mot de passe
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }

            // Animation de secousse
            if (loginBox) {
                loginBox.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    loginBox.style.animation = '';
                }, 500);
            }
        }
    }, 800); // Délai pour l'animation de chargement
}

// Afficher un message de succès (fonction conservée pour compatibilité)
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.add('show');
    }
}

// Fonction pour vérifier la session (à utiliser dans admin.html)
function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }

    const sessionData = JSON.parse(session);
    const now = new Date().getTime();

    if (sessionData.expires <= now) {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

// Fonction pour déconnecter
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

