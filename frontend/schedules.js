// schedules.js - Gestion des horaires
let currentSchedules = [];
let currentCollaborateurs = [];

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndInit();
});

function checkAuthAndInit() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    initializePage();
}

function initializePage() {
    updateUIForUserRole();
    loadCollaborateurs();
    loadSchedules();
    setupEventListeners();
}

function setupEventListeners() {
    // Formulaire d'ajout d'horaire
    const addForm = document.getElementById('addScheduleForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddSchedule);
    }
    
    // Formulaire de modification d'horaire
    const editForm = document.getElementById('editScheduleForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSchedule);
    }
    
    // Filtre par collaborateur
    const collaborateurFilter = document.getElementById('collaborateurFilter');
    if (collaborateurFilter) {
        collaborateurFilter.addEventListener('change', filterSchedules);
    }
    
    // Filtre par date
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', filterSchedules);
    }
}

async function loadCollaborateurs() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/collaborateurs`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentCollaborateurs = await response.json();
            populateCollaborateurSelects();
        } else {
            showNotification('Erreur lors du chargement des collaborateurs', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function populateCollaborateurSelects() {
    const selects = ['scheduleCollaborateur', 'editCollaborateurId', 'collaborateurFilter'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Garder l'option par défaut pour le filtre
            if (selectId === 'collaborateurFilter') {
                select.innerHTML = '<option value="">Tous les collaborateurs</option>';
            } else {
                select.innerHTML = '<option value="">Sélectionner un collaborateur</option>';
            }
            
            currentCollaborateurs.forEach(collaborateur => {
                const option = document.createElement('option');
                option.value = collaborateur.id;
                option.textContent = `${collaborateur.prenom} ${collaborateur.nom}`;
                select.appendChild(option);
            });
        }
    });
}

async function loadSchedules() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/horaires`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentSchedules = await response.json();
            displaySchedules(currentSchedules);
            updateStatistics();
        } else {
            showNotification('Erreur lors du chargement des horaires', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function displaySchedules(schedules) {
    const tbody = document.getElementById('schedulesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (schedules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun horaire trouvé</td></tr>';
        return;
    }
    
    schedules.forEach(schedule => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${schedule.collaborateur ? `${schedule.collaborateur.prenom} ${schedule.collaborateur.nom}` : 'N/A'}</td>
            <td>${formatDate(schedule.date)}</td>
            <td>${schedule.heureDebut}</td>
            <td>${schedule.heureFin}</td>
            <td>${calculateDuration(schedule.heureDebut, schedule.heureFin)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editSchedule(${schedule.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSchedule(${schedule.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function calculateDuration(start, end) {
    const startTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);
    const diffMs = endTime - startTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h${diffMinutes.toString().padStart(2, '0')}`;
}

function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    const currentWeek = getCurrentWeekDates();
    
    // Total des horaires
    document.getElementById('totalSchedules').textContent = currentSchedules.length;
    
    // Horaires d'aujourd'hui
    const todaySchedules = currentSchedules.filter(s => s.date === today);
    document.getElementById('todaySchedules').textContent = todaySchedules.length;
    
    // Horaires de cette semaine
    const weekSchedules = currentSchedules.filter(s => 
        s.date >= currentWeek.start && s.date <= currentWeek.end
    );
    document.getElementById('weekSchedules').textContent = weekSchedules.length;
}

function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
    
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
        start: monday.toISOString().split('T')[0],
        end: sunday.toISOString().split('T')[0]
    };
}

async function handleAddSchedule(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const scheduleData = {
        collaborateur: { id: parseInt(formData.get('collaborateur')) },
        date: formData.get('date'),
        heureDebut: formData.get('heureDebut'),
        heureFin: formData.get('heureFin')
    };
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/horaires`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        });
        
        if (response.ok) {
            showNotification('Horaire ajouté avec succès', 'success');
            closeModal('addScheduleModal');
            loadSchedules();
            event.target.reset();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

async function handleEditSchedule(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const scheduleId = document.getElementById('editScheduleId').value;
    const scheduleData = {
        collaborateur: { id: parseInt(formData.get('collaborateurId')) },
        date: formData.get('date'),
        heureDebut: formData.get('heureDebut'),
        heureFin: formData.get('heureFin')
    };
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/horaires/${scheduleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        });
        
        if (response.ok) {
            showNotification('Horaire modifié avec succès', 'success');
            closeModal('editScheduleModal');
            loadSchedules();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function editSchedule(id) {
    const schedule = currentSchedules.find(s => s.id === id);
    if (!schedule) return;
    
    document.getElementById('editScheduleId').value = schedule.id;
    document.getElementById('editCollaborateurId').value = schedule.collaborateur.id;
    document.getElementById('editScheduleDate').value = schedule.date;
    document.getElementById('editScheduleStart').value = schedule.heureDebut;
    document.getElementById('editScheduleEnd').value = schedule.heureFin;
    
    openModal('editScheduleModal');
}

async function deleteSchedule(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/horaires/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification('Horaire supprimé avec succès', 'success');
            loadSchedules();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function filterSchedules() {
    const collaborateurFilter = document.getElementById('collaborateurFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredSchedules = [...currentSchedules];
    
    if (collaborateurFilter) {
        filteredSchedules = filteredSchedules.filter(s => 
            s.collaborateur && s.collaborateur.id == collaborateurFilter
        );
    }
    
    if (dateFilter) {
        filteredSchedules = filteredSchedules.filter(s => s.date === dateFilter);
    }
    
    displaySchedules(filteredSchedules);
}

function exportSchedules() {
    if (currentSchedules.length === 0) {
        showNotification('Aucun horaire à exporter', 'warning');
        return;
    }
    
    const csv = convertToCSV(currentSchedules);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'horaires.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function convertToCSV(schedules) {
    const headers = ['Collaborateur', 'Date', 'Heure début', 'Heure fin', 'Durée'];
    const rows = schedules.map(schedule => [
        schedule.collaborateur ? `${schedule.collaborateur.prenom} ${schedule.collaborateur.nom}` : 'N/A',
        formatDate(schedule.date),
        schedule.heureDebut,
        schedule.heureFin,
        calculateDuration(schedule.heureDebut, schedule.heureFin)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Fonctions utilitaires
function formatDate(dateString) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('fr-FR');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Gestion des clics sur la modal
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}