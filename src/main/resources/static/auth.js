// Authentication handling for login page
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        // Already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Add form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add quick login buttons for demo
    addQuickLoginButtons();
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get('email'),
            motDePasse: formData.get('password')
        };
        
        // Validate inputs
        if (!credentials.email || !credentials.motDePasse) {
            throw new Error('Veuillez remplir tous les champs');
        }
        
        if (!validateEmail(credentials.email)) {
            throw new Error('Format d\'email invalide');
        }
        
        // Make login request
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erreur de connexion');
        }
        
        const data = await response.json();
        
        // Store authentication data
        const authToken = data.token;
        const currentUser = {
            id: data.id,
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
            role: data.role
        };
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show success message
        showNotification('Connexion réussie ! Redirection...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Erreur de connexion', 'error');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Quick login for demo purposes
function addQuickLoginButtons() {
    const testAccounts = document.querySelector('.test-accounts');
    if (!testAccounts) return;
    
    // Add admin quick login
    const adminCard = testAccounts.querySelector('.account-card:first-child');
    if (adminCard) {
        const adminButton = document.createElement('button');
        adminButton.className = 'btn btn-sm btn-primary';
        adminButton.innerHTML = '<i class="fas fa-bolt"></i> Connexion rapide';
        adminButton.onclick = () => quickLogin('admin@gestionrh.com', 'password123');
        adminCard.appendChild(adminButton);
    }
    
    // Add user quick login
    const userCard = testAccounts.querySelector('.account-card:last-child');
    if (userCard) {
        const userButton = document.createElement('button');
        userButton.className = 'btn btn-sm btn-secondary';
        userButton.innerHTML = '<i class="fas fa-bolt"></i> Connexion rapide';
        userButton.onclick = () => quickLogin('jean.dupont@gestionrh.com', 'password123');
        userCard.appendChild(userButton);
    }
}

// Quick login function
async function quickLogin(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    
    // Trigger form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.dispatchEvent(new Event('submit'));
    }
}

// Utility functions specific to login page
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Constants for API
const API_BASE_URL = 'http://localhost:8080/api';