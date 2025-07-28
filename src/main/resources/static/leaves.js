// leaves.js - Gestion des congés
let currentLeaves = [];
let currentCollaborateurs = [];

// Types de congés
const LEAVE_TYPES = {
    'PAYE': 'Congé payé',
    'MALADIE': 'Congé maladie',
    'FORMATION': 'Formation',
    'SANS_SOLDE': 'Sans solde',
    'MATERNITE': 'Congé maternité',
    'PATERNITE': 'Congé paternité'
};

// Statuts de congés
const LEAVE_STATUS = {
    'EN_ATTENTE': 'En attente',
    'VALIDE': 'Validé',
    'REJETE': 'Rejeté'
};

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndInit();
});

function checkAuthAndInit() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    initializePage();
}

function initializePage() {
    updateUserInfo();
    loadCollaborateurs();
    loadLeaves();
    setupEventListeners();
    populateLeaveTypes();
}

function setupEventListeners() {
    // Formulaire d'ajout de congé
    const addForm = document.getElementById('addLeaveForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddLeave);
    }
    
    // Formulaire de modification de congé
    const editForm = document.getElementById('editLeaveForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditLeave);
    }
    
    // Filtres
    const collaborateurFilter = document.getElementById('collaborateurFilter');
    if (collaborateurFilter) {
        collaborateurFilter.addEventListener('change', filterLeaves);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterLeaves);
    }
    
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterLeaves);
    }
}

function populateLeaveTypes() {
    const selects = ['leaveType', 'editLeaveType', 'typeFilter'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            if (selectId === 'typeFilter') {
                select.innerHTML = '<option value="">Tous les types</option>';
            } else {
                select.innerHTML = '<option value="">Sélectionner un type</option>';
            }
            
            Object.entries(LEAVE_TYPES).forEach(([key, value]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value;
                select.appendChild(option);
            });
        }
    });
    
    // Populate status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.innerHTML = '<option value="">Tous les statuts</option>';
        Object.entries(LEAVE_STATUS).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            statusFilter.appendChild(option);
        });
    }
}

async function loadCollaborateurs() {
    try {
        const token = localStorage.getItem('token');
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
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'ADMIN';
    
    const selects = ['leaveCollaborateur', 'editCollaborateurId', 'collaborateurFilter'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            if (selectId === 'collaborateurFilter') {
                select.innerHTML = '<option value="">Tous les collaborateurs</option>';
            } else {
                select.innerHTML = '<option value="">Sélectionner un collaborateur</option>';
            }
            
            currentCollaborateurs.forEach(collaborateur => {
                const option = document.createElement('option');
                option.value = collaborateur.id;
                option.textContent = `${collaborateur.prenom} ${collaborateur.nom}`;
                
                // Si ce n'est pas un admin, ne montrer que son propre profil
                if (!isAdmin && collaborateur.id !== userInfo.id) {
                    option.style.display = 'none';
                }
                
                select.appendChild(option);
            });
            
            // Si ce n'est pas un admin, présélectionner son propre ID
            if (!isAdmin && userInfo && (selectId === 'leaveCollaborateur' || selectId === 'editCollaborateurId')) {
                select.value = userInfo.id;
                select.disabled = true;
            }
        }
    });
}

async function loadLeaves() {
    try {
        const token = localStorage.getItem('token');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const isAdmin = userInfo && userInfo.role === 'ADMIN';
        
        let url = `${API_BASE_URL}/conges`;
        if (!isAdmin) {
            url = `${API_BASE_URL}/conges/collaborateur/${userInfo.id}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentLeaves = await response.json();
            displayLeaves(currentLeaves);
            updateStatistics();
        } else {
            showNotification('Erreur lors du chargement des congés', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function displayLeaves(leaves) {
    const tbody = document.getElementById('leavesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (leaves.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucun congé trouvé</td></tr>';
        return;
    }
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'ADMIN';
    
    leaves.forEach(leave => {
        const row = document.createElement('tr');
        const duration = calculateLeaveDuration(leave.dateDebut, leave.dateFin);
        
        let actionsHtml = '';
        if (isAdmin) {
            actionsHtml = `
                <button class="btn btn-sm btn-primary" onclick="editLeave(${leave.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteLeave(${leave.id})">Supprimer</button>
            `;
            if (leave.statut === 'EN_ATTENTE') {
                actionsHtml += `
                    <button class="btn btn-sm btn-success" onclick="approveLeave(${leave.id})">Valider</button>
                    <button class="btn btn-sm btn-warning" onclick="rejectLeave(${leave.id})">Rejeter</button>
                `;
            }
        } else if (leave.statut === 'EN_ATTENTE') {
            actionsHtml = `
                <button class="btn btn-sm btn-primary" onclick="editLeave(${leave.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteLeave(${leave.id})">Supprimer</button>
            `;
        }
        
        row.innerHTML = `
            <td>${leave.collaborateur ? `${leave.collaborateur.prenom} ${leave.collaborateur.nom}` : 'N/A'}</td>
            <td>${LEAVE_TYPES[leave.type] || leave.type}</td>
            <td>${formatDate(leave.dateDebut)}</td>
            <td>${formatDate(leave.dateFin)}</td>
            <td>${duration} jour${duration > 1 ? 's' : ''}</td>
            <td><span class="status-badge status-${leave.statut.toLowerCase().replace('_', '-')}">${LEAVE_STATUS[leave.statut] || leave.statut}</span></td>
            <td>${leave.motif || '-'}</td>
            <td>${actionsHtml}</td>
        `;
        tbody.appendChild(row);
    });
}

function calculateLeaveDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début
    return diffDays;
}

function updateStatistics() {
    // Total des congés
    document.getElementById('totalLeaves').textContent = currentLeaves.length;
    
    // Congés en attente
    const pendingLeaves = currentLeaves.filter(l => l.statut === 'EN_ATTENTE');
    document.getElementById('pendingLeaves').textContent = pendingLeaves.length;
    
    // Congés approuvés
    const approvedLeaves = currentLeaves.filter(l => l.statut === 'VALIDE');
    document.getElementById('approvedLeaves').textContent = approvedLeaves.length;
    
    // Congés rejetés
    const rejectedLeaves = currentLeaves.filter(l => l.statut === 'REJETE');
    document.getElementById('rejectedLeaves').textContent = rejectedLeaves.length;
}

async function handleAddLeave(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const leaveData = {
        collaborateur: { id: parseInt(formData.get('collaborateur')) },
        type: formData.get('type'),
        dateDebut: formData.get('dateDebut'),
        dateFin: formData.get('dateFin'),
        motif: formData.get('motif')
    };
    
    // Validation des dates
    if (new Date(leaveData.dateDebut) > new Date(leaveData.dateFin)) {
        showNotification('La date de fin doit être postérieure à la date de début', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/conges/soumettre`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveData)
        });
        
        if (response.ok) {
            showNotification('Demande de congé soumise avec succès', 'success');
            closeModal('addLeaveModal');
            loadLeaves();
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

async function handleEditLeave(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const leaveId = document.getElementById('editLeaveId').value;
    const leaveData = {
        collaborateur: { id: parseInt(formData.get('collaborateurId')) },
        type: formData.get('type'),
        dateDebut: formData.get('dateDebut'),
        dateFin: formData.get('dateFin'),
        motif: formData.get('motif')
    };
    
    // Validation des dates
    if (new Date(leaveData.dateDebut) > new Date(leaveData.dateFin)) {
        showNotification('La date de fin doit être postérieure à la date de début', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/conges/${leaveId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveData)
        });
        
        if (response.ok) {
            showNotification('Congé modifié avec succès', 'success');
            closeModal('editLeaveModal');
            loadLeaves();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function editLeave(id) {
    const leave = currentLeaves.find(l => l.id === id);
    if (!leave) return;
    
    document.getElementById('editLeaveId').value = leave.id;
    document.getElementById('editCollaborateurId').value = leave.collaborateur.id;
    document.getElementById('editLeaveType').value = leave.type;
    document.getElementById('editLeaveStartDate').value = leave.dateDebut;
    document.getElementById('editLeaveEndDate').value = leave.dateFin;
    document.getElementById('editLeaveReason').value = leave.motif || '';
    
    openModal('editLeaveModal');
}

async function deleteLeave(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/conges/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification('Congé supprimé avec succès', 'success');
            loadLeaves();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

async function approveLeave(id) {
    const commentaire = prompt('Commentaire (optionnel):');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/conges/${id}/valider`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentaire: commentaire || '' })
        });
        
        if (response.ok) {
            showNotification('Congé validé avec succès', 'success');
            loadLeaves();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

async function rejectLeave(id) {
    const commentaire = prompt('Raison du rejet:');
    if (!commentaire) {
        showNotification('La raison du rejet est obligatoire', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/conges/${id}/rejeter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentaire })
        });
        
        if (response.ok) {
            showNotification('Congé rejeté', 'success');
            loadLeaves();
        } else {
            const errorText = await response.text();
            showNotification(`Erreur: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function filterLeaves() {
    const collaborateurFilter = document.getElementById('collaborateurFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    let filteredLeaves = [...currentLeaves];
    
    if (collaborateurFilter) {
        filteredLeaves = filteredLeaves.filter(l => 
            l.collaborateur && l.collaborateur.id == collaborateurFilter
        );
    }
    
    if (statusFilter) {
        filteredLeaves = filteredLeaves.filter(l => l.statut === statusFilter);
    }
    
    if (typeFilter) {
        filteredLeaves = filteredLeaves.filter(l => l.type === typeFilter);
    }
    
    displayLeaves(filteredLeaves);
}

function showPendingLeaves() {
    const pendingLeaves = currentLeaves.filter(l => l.statut === 'EN_ATTENTE');
    displayLeaves(pendingLeaves);
}

function showAllLeaves() {
    displayLeaves(currentLeaves);
}

function exportLeaves() {
    if (currentLeaves.length === 0) {
        showNotification('Aucun congé à exporter', 'warning');
        return;
    }
    
    const csv = convertLeavesToCSV(currentLeaves);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conges.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function convertLeavesToCSV(leaves) {
    const headers = ['Collaborateur', 'Type', 'Date début', 'Date fin', 'Durée', 'Statut', 'Motif'];
    const rows = leaves.map(leave => [
        leave.collaborateur ? `${leave.collaborateur.prenom} ${leave.collaborateur.nom}` : 'N/A',
        LEAVE_TYPES[leave.type] || leave.type,
        formatDate(leave.dateDebut),
        formatDate(leave.dateFin),
        calculateLeaveDuration(leave.dateDebut, leave.dateFin),
        LEAVE_STATUS[leave.statut] || leave.statut,
        leave.motif || ''
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