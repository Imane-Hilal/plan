package com.gestionrh.service;

import com.gestionrh.entity.Horaire;
import com.gestionrh.entity.Collaborateur;
import com.gestionrh.repository.HoraireRepository;
import com.gestionrh.repository.CollaborateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HoraireService {
    
    @Autowired
    private HoraireRepository horaireRepository;
    
    @Autowired
    private CollaborateurRepository collaborateurRepository;
    
    public List<Horaire> getAllHoraires() {
        return horaireRepository.findAll();
    }
    
    public Optional<Horaire> getHoraireById(Long id) {
        return horaireRepository.findById(id);
    }
    
    public List<Horaire> getHorairesByCollaborateur(Long collaborateurId) {
        return horaireRepository.findByCollaborateurId(collaborateurId);
    }
    
    public List<Horaire> getHorairesByDate(LocalDate date) {
        return horaireRepository.findByDate(date);
    }
    
    public List<Horaire> getHorairesByCollaborateurAndPeriod(Long collaborateurId, LocalDate dateDebut, LocalDate dateFin) {
        return horaireRepository.findByCollaborateurIdAndDateBetween(collaborateurId, dateDebut, dateFin);
    }
    
    public List<Horaire> getPlanningCollaborateur(Long collaborateurId, LocalDate dateDebut, LocalDate dateFin) {
        return horaireRepository.findByCollaborateurIdAndDateBetween(collaborateurId, dateDebut, dateFin);
    }
    
    public Horaire createHoraire(Horaire horaire) {
        // Vérifier que le collaborateur existe
        Collaborateur collaborateur = collaborateurRepository.findById(horaire.getCollaborateur().getId())
                .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé"));
        
        // Vérifier que l'heure de fin est après l'heure de début
        if (horaire.getHeureFin().isBefore(horaire.getHeureDebut()) || 
            horaire.getHeureFin().equals(horaire.getHeureDebut())) {
            throw new RuntimeException("L'heure de fin doit être après l'heure de début");
        }
        
        horaire.setCollaborateur(collaborateur);
        return horaireRepository.save(horaire);
    }
    
    public Horaire updateHoraire(Long id, Horaire horaireDetails) {
        Horaire horaire = horaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horaire non trouvé avec l'id: " + id));
        
        // Vérifier que l'heure de fin est après l'heure de début
        if (horaireDetails.getHeureFin().isBefore(horaireDetails.getHeureDebut()) || 
            horaireDetails.getHeureFin().equals(horaireDetails.getHeureDebut())) {
            throw new RuntimeException("L'heure de fin doit être après l'heure de début");
        }
        
        horaire.setDate(horaireDetails.getDate());
        horaire.setHeureDebut(horaireDetails.getHeureDebut());
        horaire.setHeureFin(horaireDetails.getHeureFin());
        
        // Mettre à jour le collaborateur si fourni
        if (horaireDetails.getCollaborateur() != null && horaireDetails.getCollaborateur().getId() != null) {
            Collaborateur collaborateur = collaborateurRepository.findById(horaireDetails.getCollaborateur().getId())
                    .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé"));
            horaire.setCollaborateur(collaborateur);
        }
        
        return horaireRepository.save(horaire);
    }
    
    public void deleteHoraire(Long id) {
        Horaire horaire = horaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horaire non trouvé avec l'id: " + id));
        
        horaireRepository.delete(horaire);
    }
}