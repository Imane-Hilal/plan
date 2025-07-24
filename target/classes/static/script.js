// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let authToken = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const employeesSection = document.getElementById('employeesSection');
const schedulesSection = document.getElementById('schedulesSection');
const leavesSection = document.getElementById('leavesSection');
const mainNav = document.getElementById('mainNav');
const employeesNav = document.getElementById('employeesNav');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Add event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('addEmployeeForm').addEventListener('submit', handleAddEmployee);
    document.getElementById('addScheduleForm').addEventListener('submit', handleAddSchedule);
    document.getElementById('addLeaveForm').addEventListener('submit', handleAddLeave);
});

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                motDePasse: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = {
                id: data.id,
                email: data.email,
                nom: data.nom,
                prenom: data.prenom,
                role: data.role
            };
            
            // Save to localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Connexion réussie !', 'success');
            showDashboard();
        } else {
            const error = await response.text();
            showNotification('Erreur de connexion: ' + error, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Erreur de connexion. Vérifiez que le serveur est démarré.', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Hide all sections and show login
    hideAllSections();
    loginSection.style.display = 'block';
    mainNav.style.display = 'none';
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    showNotification('Déconnexion réussie', 'info');
}

// Navigation Functions
function hideAllSections() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    employeesSection.style.display = 'none';
    schedulesSection.style.display = 'none';
    leavesSection.style.display = 'none';
}

function showDashboard() {
    hideAllSections();
    dashboardSection.style.display = 'block';
    mainNav.style.display = 'flex';
    
    // Show/hide admin-only navigation
    if (currentUser && currentUser.role === 'ADMIN') {
        employeesNav.style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'block';
    } else {
        employeesNav.style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'none';
    }
    
    loadDashboardData();
}

function showEmployees() {
    if (currentUser.role !== 'ADMIN') {
        showNotification('Accès non autorisé', 'error');
        return;
    }
    
    hideAllSections();
    employeesSection.style.display = 'block';
    loadEmployees();
}

function showSchedules() {
    hideAllSections();
    schedulesSection.style.display = 'block';
    loadSchedules();
}

function showLeaves() {
    hideAllSections();
    leavesSection.style.display = 'block';
    loadLeaves();
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
            logout();
            showNotification('Session expirée, veuillez vous reconnecter', 'warning');
            return null;
        }
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Load basic statistics
        if (currentUser.role === 'ADMIN') {
            const stats = await apiRequest('/dashboard/statistiques');
            document.getElementById('totalEmployees').textContent = stats.totalCollaborateurs || '0';
            
            // Load availability data
            const availability = await apiRequest('/dashboard/disponibilite');
            document.getElementById('presentToday').textContent = availability.collaborateursPresents || '0';
            document.getElementById('onLeave').textContent = availability.collaborateursEnConge || '0';
            
            // Load pending requests
            const pendingLeaves = await apiRequest('/conges/en-attente');
            document.getElementById('pendingRequests').textContent = pendingLeaves ? pendingLeaves.length : '0';
        } else {
            // For regular users, show limited dashboard
            document.getElementById('totalEmployees').textContent = '-';
            document.getElementById('presentToday').textContent = '-';
            document.getElementById('onLeave').textContent = '-';
            
            // Show personal pending requests
            const myLeaves = await apiRequest(`/conges/collaborateur/${currentUser.id}`);
            const pendingCount = myLeaves ? myLeaves.filter(leave => leave.statut === 'EN_ATTENTE').length : 0;
            document.getElementById('pendingRequests').textContent = pendingCount;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Erreur lors du chargement du tableau de bord', 'error');
    }
}

// Employee Functions
async function loadEmployees() {
    try {
        const employees = await apiRequest('/collaborateurs');
        displayEmployees(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
        showNotification('Erreur lors du chargement des collaborateurs', 'error');
    }
}

function displayEmployees(employees) {
    const tbody = document.querySelector('#employeesTable tbody');
    tbody.innerHTML = '';
    
    if (!employees || employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucun collaborateur trouvé</td></tr>';
        return;
    }
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.nom}</td>
            <td>${employee.prenom}</td>
            <td>${employee.email}</td>
            <td>${employee.poste}</td>
            <td><span class="role-${employee.role.toLowerCase()}">${employee.role}</span></td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editEmployee(${employee.id})">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleAddEmployee(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const employeeData = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        email: formData.get('email'),
        poste: formData.get('poste'),
        role: formData.get('role'),
        motDePasse: formData.get('motDePasse')
    };
    
    try {
        await apiRequest('/collaborateurs', 'POST', employeeData);
        showNotification('Collaborateur ajouté avec succès', 'success');
        closeModal('addEmployeeModal');
        loadEmployees();
        e.target.reset();
    } catch (error) {
        console.error('Error adding employee:', error);
        showNotification('Erreur lors de l\'ajout du collaborateur', 'error');
    }
}

async function deleteEmployee(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
        return;
    }
    
    try {
        await apiRequest(`/collaborateurs/${id}`, 'DELETE');
        showNotification('Collaborateur supprimé avec succès', 'success');
        loadEmployees();
    } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Erreur lors de la suppression du collaborateur', 'error');
    }
}

// Schedule Functions
async function loadSchedules() {
    try {
        let schedules;
        if (currentUser.role === 'ADMIN') {
            schedules = await apiRequest('/horaires');
        } else {
            schedules = await apiRequest(`/horaires/collaborateur/${currentUser.id}`);
        }
        displaySchedules(schedules);
        
        // Load employees for the dropdown
        if (currentUser.role === 'ADMIN') {
            const employees = await apiRequest('/collaborateurs');
            populateEmployeeDropdown('scheduleCollaborateur', employees);
        }
    } catch (error) {
        console.error('Error loading schedules:', error);
        showNotification('Erreur lors du chargement des horaires', 'error');
    }
}

function displaySchedules(schedules) {
    const tbody = document.querySelector('#schedulesTable tbody');
    tbody.innerHTML = '';
    
    if (!schedules || schedules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun horaire trouvé</td></tr>';
        return;
    }
    
    schedules.forEach(schedule => {
        const row = document.createElement('tr');
        const collaborateurName = schedule.collaborateur ? 
            `${schedule.collaborateur.prenom} ${schedule.collaborateur.nom}` : 
            'Non défini';
        
        row.innerHTML = `
            <td>${schedule.id}</td>
            <td>${collaborateurName}</td>
            <td>${schedule.date}</td>
            <td>${formatTime(schedule.heureDebut)}</td>
            <td>${formatTime(schedule.heureFin)}</td>
            <td class="action-buttons">
                ${currentUser.role === 'ADMIN' ? `
                    <button class="btn btn-warning" onclick="editSchedule(${schedule.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger" onclick="deleteSchedule(${schedule.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleAddSchedule(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    let collaborateurId;
    if (currentUser.role === 'ADMIN') {
        collaborateurId = formData.get('collaborateur');
    } else {
        collaborateurId = currentUser.id;
    }
    
    const scheduleData = {
        collaborateur: { id: collaborateurId },
        date: formData.get('date'),
        heureDebut: timeStringToObject(formData.get('heureDebut')),
        heureFin: timeStringToObject(formData.get('heureFin'))
    };
    
    try {
        await apiRequest('/horaires', 'POST', scheduleData);
        showNotification('Horaire ajouté avec succès', 'success');
        closeModal('addScheduleModal');
        loadSchedules();
        e.target.reset();
    } catch (error) {
        console.error('Error adding schedule:', error);
        showNotification('Erreur lors de l\'ajout de l\'horaire', 'error');
    }
}

async function deleteSchedule(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
        return;
    }
    
    try {
        await apiRequest(`/horaires/${id}`, 'DELETE');
        showNotification('Horaire supprimé avec succès', 'success');
        loadSchedules();
    } catch (error) {
        console.error('Error deleting schedule:', error);
        showNotification('Erreur lors de la suppression de l\'horaire', 'error');
    }
}

// Leave Functions
async function loadLeaves() {
    try {
        let leaves;
        if (currentUser.role === 'ADMIN') {
            leaves = await apiRequest('/conges');
        } else {
            leaves = await apiRequest(`/conges/collaborateur/${currentUser.id}`);
        }
        displayLeaves(leaves);
        
        // Load employees for the dropdown
        if (currentUser.role === 'ADMIN') {
            const employees = await apiRequest('/collaborateurs');
            populateEmployeeDropdown('leaveCollaborateur', employees);
        }
    } catch (error) {
        console.error('Error loading leaves:', error);
        showNotification('Erreur lors du chargement des congés', 'error');
    }
}

function displayLeaves(leaves) {
    const tbody = document.querySelector('#leavesTable tbody');
    tbody.innerHTML = '';
    
    if (!leaves || leaves.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucun congé trouvé</td></tr>';
        return;
    }
    
    leaves.forEach(leave => {
        const row = document.createElement('tr');
        const collaborateurName = leave.collaborateur ? 
            `${leave.collaborateur.prenom} ${leave.collaborateur.nom}` : 
            'Non défini';
        
        row.innerHTML = `
            <td>${leave.id}</td>
            <td>${collaborateurName}</td>
            <td>${leave.dateDebut}</td>
            <td>${leave.dateFin}</td>
            <td>${leave.type}</td>
            <td><span class="status-badge status-${leave.statut.toLowerCase().replace('_', '-')}">${leave.statut}</span></td>
            <td>${leave.motif || ''}</td>
            <td class="action-buttons">
                ${currentUser.role === 'ADMIN' && leave.statut === 'EN_ATTENTE' ? `
                    <button class="btn btn-success" onclick="approveLeave(${leave.id})">
                        <i class="fas fa-check"></i> Valider
                    </button>
                    <button class="btn btn-danger" onclick="rejectLeave(${leave.id})">
                        <i class="fas fa-times"></i> Rejeter
                    </button>
                ` : ''}
                ${leave.statut === 'EN_ATTENTE' ? `
                    <button class="btn btn-warning" onclick="editLeave(${leave.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger" onclick="deleteLeave(${leave.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleAddLeave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    let collaborateurId;
    if (currentUser.role === 'ADMIN') {
        collaborateurId = formData.get('collaborateur');
    } else {
        collaborateurId = currentUser.id;
    }
    
    const leaveData = {
        collaborateur: { id: collaborateurId },
        dateDebut: formData.get('dateDebut'),
        dateFin: formData.get('dateFin'),
        type: formData.get('type'),
        motif: formData.get('motif')
    };
    
    try {
        await apiRequest('/conges/soumettre', 'POST', leaveData);
        showNotification('Demande de congé soumise avec succès', 'success');
        closeModal('addLeaveModal');
        loadLeaves();
        e.target.reset();
    } catch (error) {
        console.error('Error adding leave:', error);
        showNotification('Erreur lors de la soumission de la demande', 'error');
    }
}

async function approveLeave(id) {
    const comment = prompt('Commentaire (optionnel):');
    
    try {
        await apiRequest(`/conges/${id}/valider`, 'POST', { commentaire: comment || '' });
        showNotification('Congé validé avec succès', 'success');
        loadLeaves();
    } catch (error) {
        console.error('Error approving leave:', error);
        showNotification('Erreur lors de la validation du congé', 'error');
    }
}

async function rejectLeave(id) {
    const comment = prompt('Raison du rejet (obligatoire):');
    
    if (!comment) {
        showNotification('Une raison de rejet est obligatoire', 'warning');
        return;
    }
    
    try {
        await apiRequest(`/conges/${id}/rejeter`, 'POST', { commentaire: comment });
        showNotification('Congé rejeté avec succès', 'success');
        loadLeaves();
    } catch (error) {
        console.error('Error rejecting leave:', error);
        showNotification('Erreur lors du rejet du congé', 'error');
    }
}

async function deleteLeave(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) {
        return;
    }
    
    try {
        await apiRequest(`/conges/${id}`, 'DELETE');
        showNotification('Demande de congé supprimée avec succès', 'success');
        loadLeaves();
    } catch (error) {
        console.error('Error deleting leave:', error);
        showNotification('Erreur lors de la suppression de la demande', 'error');
    }
}

// Modal Functions
function showAddEmployeeModal() {
    document.getElementById('addEmployeeModal').style.display = 'block';
}

function showAddScheduleModal() {
    document.getElementById('addScheduleModal').style.display = 'block';
    
    // Set current user if not admin
    if (currentUser.role !== 'ADMIN') {
        const select = document.getElementById('scheduleCollaborateur');
        select.innerHTML = `<option value="${currentUser.id}">${currentUser.prenom} ${currentUser.nom}</option>`;
        select.disabled = true;
    }
}

function showAddLeaveModal() {
    document.getElementById('addLeaveModal').style.display = 'block';
    
    // Set current user if not admin
    if (currentUser.role !== 'ADMIN') {
        const select = document.getElementById('leaveCollaborateur');
        select.innerHTML = `<option value="${currentUser.id}">${currentUser.prenom} ${currentUser.nom}</option>`;
        select.disabled = true;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Utility Functions
function populateEmployeeDropdown(selectId, employees) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Sélectionner un collaborateur</option>';
    
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.prenom} ${employee.nom}`;
        select.appendChild(option);
    });
}

function timeStringToObject(timeString) {
    const [hours, minutes] = timeString.split(':');
    return {
        hour: parseInt(hours),
        minute: parseInt(minutes),
        second: 0,
        nano: 0
    };
}

function formatTime(timeObject) {
    if (!timeObject) return '';
    const hours = String(timeObject.hour || 0).padStart(2, '0');
    const minutes = String(timeObject.minute || 0).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Placeholder functions for edit operations
function editEmployee(id) {
    showNotification('Fonction de modification en cours de développement', 'info');
}

function editSchedule(id) {
    showNotification('Fonction de modification en cours de développement', 'info');
}

function editLeave(id) {
    showNotification('Fonction de modification en cours de développement', 'info');
}