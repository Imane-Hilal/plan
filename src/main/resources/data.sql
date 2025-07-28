-- Insertion des collaborateurs avec mots de passe encodés (password123)
INSERT INTO collaborateurs (nom, prenom, email, poste, role, mot_de_passe) VALUES
('Admin', 'System', 'admin@gestionrh.com', 'Directeur RH', 'ADMIN', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu'),
('Dupont', 'Jean', 'jean.dupont@gestionrh.com', 'Collaborateur', 'COLLABORATEUR', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu'),
('Martin', 'Marie', 'marie.martin@gestionrh.com', 'Développeuse', 'COLLABORATEUR', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu'),
('Durand', 'Pierre', 'pierre.durand@gestionrh.com', 'Analyste', 'COLLABORATEUR', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu'),
('Bernard', 'Sophie', 'sophie.bernard@gestionrh.com', 'Chef de projet', 'COLLABORATEUR', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu'),
('Petit', 'Lucas', 'lucas.petit@gestionrh.com', 'Designer', 'COLLABORATEUR', '$2a$10$W2esoKjvX.93egJRby226O1WDa4tTS44rZgVdCnD/5rapkV8mKDmu');

-- Insertion des horaires de travail
INSERT INTO horaires (collaborateur_id, date, heure_debut, heure_fin) VALUES
(2, '2024-01-15', '09:00:00', '17:00:00'),
(2, '2024-01-16', '09:00:00', '17:00:00'),
(2, '2024-01-17', '09:00:00', '17:00:00'),
(3, '2024-01-15', '08:30:00', '16:30:00'),
(3, '2024-01-16', '08:30:00', '16:30:00'),
(3, '2024-01-17', '08:30:00', '16:30:00'),
(4, '2024-01-15', '10:00:00', '18:00:00'),
(4, '2024-01-16', '10:00:00', '18:00:00'),
(4, '2024-01-17', '10:00:00', '18:00:00'),
(5, '2024-01-15', '09:30:00', '17:30:00'),
(5, '2024-01-16', '09:30:00', '17:30:00'),
(5, '2024-01-17', '09:30:00', '17:30:00'),
(6, '2024-01-15', '09:30:00', '17:30:00'),
(6, '2024-01-16', '09:30:00', '17:30:00'),
(6, '2024-01-17', '09:30:00', '17:30:00');

-- Insertion des demandes de congés
INSERT INTO conges (collaborateur_id, date_debut, date_fin, type, statut, motif) VALUES
(2, '2024-02-01', '2024-02-05', 'PAYE', 'EN_ATTENTE', 'Vacances en famille'),
(3, '2024-01-25', '2024-01-26', 'MALADIE', 'VALIDE', 'Consultation médicale'),
(4, '2024-02-10', '2024-02-15', 'PAYE', 'EN_ATTENTE', 'Congés d''hiver'),
(5, '2024-01-22', '2024-01-22', 'FORMATION', 'VALIDE', 'Formation React'),
(3, '2024-03-01', '2024-03-03', 'PAYE', 'REJETE', 'Demande trop tardive'),
(4, '2024-02-20', '2024-02-22', 'PAYE', 'EN_ATTENTE', 'Week-end prolongé');

-- Mise à jour des commentaires admin pour les congés traités
UPDATE conges SET commentaire_admin = 'Congé validé pour raisons médicales' WHERE id = 2;
UPDATE conges SET commentaire_admin = 'Formation approuvée par le manager' WHERE id = 4;
UPDATE conges SET commentaire_admin = 'Demande déposée moins de 15 jours avant la date' WHERE id = 5;