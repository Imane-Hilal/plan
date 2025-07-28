// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let authToken = null;

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication on page load
    checkAuthentication();
    
    // Initialize navigation
    initializeNavigation();
    
    // Set current date for dashboard
    updateCurrentDate();
});

// Authentication Functions
function checkAuthentication() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (!savedToken || !savedUser) {
        // Not logged in, redirect to login
        if (window.location.pathname !== '/frontend/login.html' && 
            !window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    
    // Set global variables
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    
    // Update UI based on user role
    updateUIForUserRole();
    
    return true;
}

function updateUIForUserRole() {
    if (!currentUser) return;
    
    // Show/hide admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    const isAdmin = currentUser.role === 'ADMIN';
    
    adminElements.forEach(element => {
        element.style.display = isAdmin ? '' : 'none';
    });
    
    // Update navigation
    const employeesNav = document.getElementById('employeesNav');
    if (employeesNav) {
        employeesNav.style.display = isAdmin ? 'block' : 'none';
    }
    
    // Update user name in welcome sections
    const userNameElements = document.querySelectorAll('#userName, .user-name');
    userNameElements.forEach(element => {
        element.textContent = `${currentUser.prenom} ${currentUser.nom}`;
    });
    
    // Update user role display
    const userRoleElements = document.querySelectorAll('#userRole, .user-role');
    userRoleElements.forEach(element => {
        element.textContent = currentUser.role === 'ADMIN' ? 'Administrateur' : 'Collaborateur';
    });
}

function logout() {
    // Clear stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    
    // Show notification
    showNotification('Déconnexion réussie', 'info');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// API Functions
async function apiRequest(endpoint, method = 'GET', body = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            showNotification('Session expirée, veuillez vous reconnecter', 'warning');
            return null;
        }
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erreur lors de la requête');
        }
        
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Navigation Functions
function initializeNavigation() {
    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Reset form if it exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Notification Functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
}

function formatTime(timeObject) {
    if (!timeObject) return '';
    const hours = String(timeObject.hour || 0).padStart(2, '0');
    const minutes = String(timeObject.minute || 0).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function timeStringToObject(timeString) {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    return {
        hour: parseInt(hours),
        minute: parseInt(minutes),
        second: 0,
        nano: 0
    };
}

function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}

function calculateTimeDuration(startTime, endTime) {
    if (!startTime || !endTime) return '';
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    let diffMinutes = endTotalMinutes - startTotalMinutes;
    
    // Handle overnight shifts
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h${minutes > 0 ? minutes.toString().padStart(2, '0') : ''}`;
}

function updateCurrentDate() {
    const currentDateElements = document.querySelectorAll('#currentDate, .current-date');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    currentDateElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

function validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return false;
    return new Date(startDate) <= new Date(endDate);
}

// Export data functions
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, filename, 'text/csv');
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
}

// Loading states
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

// Error handling
function handleError(error, context = '') {
    console.error(`Error ${context}:`, error);
    
    let message = 'Une erreur est survenue';
    if (context) {
        message += ` lors de ${context}`;
    }
    
    if (error.message) {
        message += `: ${error.message}`;
    }
    
    showNotification(message, 'error');
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showNotification('Une erreur inattendue s\'est produite', 'error');
});

// Status badges helper
function getStatusBadgeClass(status) {
    const statusMap = {
        'EN_ATTENTE': 'status-en-attente',
        'VALIDE': 'status-valide',
        'REJETE': 'status-rejete'
    };
    return statusMap[status] || '';
}

function getStatusText(status) {
    const statusMap = {
        'EN_ATTENTE': 'En attente',
        'VALIDE': 'Validé',
        'REJETE': 'Rejeté'
    };
    return statusMap[status] || status;
}

function getRoleClass(role) {
    return role === 'ADMIN' ? 'role-admin' : 'role-collaborateur';
}

function getRoleText(role) {
    return role === 'ADMIN' ? 'Administrateur' : 'Collaborateur';
}