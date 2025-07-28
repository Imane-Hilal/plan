package com.gestionrh.service;

import com.gestionrh.entity.Conge;
import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.StatutConge;
import com.gestionrh.entity.TypeConge;
import com.gestionrh.repository.CongeRepository;
import com.gestionrh.repository.CollaborateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CongeService {
    
    @Autowired
    private CongeRepository congeRepository;
    
    @Autowired
    private CollaborateurRepository collaborateurRepository;
    
    public List<Conge> getAllConges() {
        return congeRepository.findAll();
    }
    
    public Optional<Conge> getCongeById(Long id) {
        return congeRepository.findById(id);
    }
    
    public List<Conge> getCongesByCollaborateur(Long collaborateurId) {
        return congeRepository.findByCollaborateurId(collaborateurId);
    }
    
    public List<Conge> getCongesByStatut(StatutConge statut) {
        return congeRepository.findByStatutOrderByDateDebut(statut);
    }
    
    public List<Conge> getCongesEnAttente() {
        return congeRepository.findByStatutOrderByDateDebut(StatutConge.EN_ATTENTE);
    }
    
    public Conge soumettreDemandeConge(Conge conge) {
        // Vérifier que le collaborateur existe
        Collaborateur collaborateur = collaborateurRepository.findById(conge.getCollaborateur().getId())
                .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé"));
        
        // Vérifier que la date de fin est après la date de début
        if (conge.getDateFin().isBefore(conge.getDateDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début");
        }
        
        // Vérifier que les dates ne sont pas dans le passé
        if (conge.getDateDebut().isBefore(LocalDate.now())) {
            throw new RuntimeException("Les dates de congé ne peuvent pas être dans le passé");
        }
        
        // Vérifier s'il n'y a pas de chevauchement avec d'autres congés validés
        List<Conge> congesExistants = congeRepository.findByCollaborateurIdAndDateOverlap(
            collaborateur.getId(), conge.getDateDebut(), conge.getDateFin());
        
        for (Conge congeExistant : congesExistants) {
            if (congeExistant.getStatut() == StatutConge.VALIDE) {
                throw new RuntimeException("Il existe déjà un congé validé pour cette période");
            }
        }
        
        conge.setCollaborateur(collaborateur);
        conge.setStatut(StatutConge.EN_ATTENTE);
        
        return congeRepository.save(conge);
    }
    
    public Conge validerConge(Long congeId, String commentaireAdmin) {
        Conge conge = congeRepository.findById(congeId)
                .orElseThrow(() -> new RuntimeException("Congé non trouvé avec l'id: " + congeId));
        
        if (conge.getStatut() != StatutConge.EN_ATTENTE) {
            throw new RuntimeException("Seuls les congés en attente peuvent être validés");
        }
        
        conge.setStatut(StatutConge.VALIDE);
        conge.setCommentaireAdmin(commentaireAdmin);
        
        return congeRepository.save(conge);
    }
    
    public Conge rejeterConge(Long congeId, String commentaireAdmin) {
        Conge conge = congeRepository.findById(congeId)
                .orElseThrow(() -> new RuntimeException("Congé non trouvé avec l'id: " + congeId));
        
        if (conge.getStatut() != StatutConge.EN_ATTENTE) {
            throw new RuntimeException("Seuls les congés en attente peuvent être rejetés");
        }
        
        conge.setStatut(StatutConge.REJETE);
        conge.setCommentaireAdmin(commentaireAdmin);
        
        return congeRepository.save(conge);
    }
    
    public Conge updateConge(Long id, Conge congeDetails) {
        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Congé non trouvé avec l'id: " + id));
        
        // Seuls les congés en attente peuvent être modifiés
        if (conge.getStatut() != StatutConge.EN_ATTENTE) {
            throw new RuntimeException("Seuls les congés en attente peuvent être modifiés");
        }
        
        // Vérifier que la date de fin est après la date de début
        if (congeDetails.getDateFin().isBefore(congeDetails.getDateDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début");
        }
        
        // Vérifier que les dates ne sont pas dans le passé
        if (congeDetails.getDateDebut().isBefore(LocalDate.now())) {
            throw new RuntimeException("Les dates de congé ne peuvent pas être dans le passé");
        }
        
        conge.setDateDebut(congeDetails.getDateDebut());
        conge.setDateFin(congeDetails.getDateFin());
        conge.setType(congeDetails.getType());
        conge.setMotif(congeDetails.getMotif());
        
        return congeRepository.save(conge);
    }
    
    public void deleteConge(Long id) {
        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Congé non trouvé avec l'id: " + id));
        
        // Seuls les congés en attente ou rejetés peuvent être supprimés
        if (conge.getStatut() == StatutConge.VALIDE) {
            throw new RuntimeException("Les congés validés ne peuvent pas être supprimés");
        }
        
        congeRepository.delete(conge);
    }
    
    public List<Conge> getHistoriqueCongesCollaborateur(Long collaborateurId) {
        return congeRepository.findByCollaborateurId(collaborateurId);
    }
}