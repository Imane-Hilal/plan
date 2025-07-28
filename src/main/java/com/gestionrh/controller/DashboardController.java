package com.gestionrh.controller;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.Conge;
import com.gestionrh.entity.Horaire;
import com.gestionrh.entity.StatutConge;
import com.gestionrh.service.CollaborateurService;
import com.gestionrh.service.CongeService;
import com.gestionrh.service.HoraireService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Tableau de bord", description = "API pour le suivi de la disponibilité des collaborateurs")
public class DashboardController {
    
    @Autowired
    private CollaborateurService collaborateurService;
    
    @Autowired
    private HoraireService horaireService;
    
    @Autowired
    private CongeService congeService;
    
    @GetMapping("/disponibilite")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Disponibilité globale", description = "Vue d'ensemble de la disponibilité de tous les collaborateurs (Admin uniquement)")
    public ResponseEntity<Map<String, Object>> getDisponibiliteGlobale(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        final LocalDate targetDate = (date != null) ? date : LocalDate.now();
        
        List<Collaborateur> tousCollaborateurs = collaborateurService.getAllCollaborateurs();
        List<Horaire> horairesDuJour = horaireService.getHorairesByDate(targetDate);
        List<Conge> congesValides = congeService.getCongesByStatut(StatutConge.VALIDE);
        
        // Filtrer les congés pour la date donnée
        List<Conge> congesDuJour = congesValides.stream()
            .filter(conge -> (targetDate.isEqual(conge.getDateDebut()) || targetDate.isAfter(conge.getDateDebut())) &&
                           (targetDate.isEqual(conge.getDateFin()) || targetDate.isBefore(conge.getDateFin())))
            .collect(Collectors.toList());
        
        Map<String, Object> resultat = new HashMap<>();
        resultat.put("date", targetDate);
        resultat.put("totalCollaborateurs", tousCollaborateurs.size());
        resultat.put("collaborateursPresents", horairesDuJour.size());
        resultat.put("collaborateursEnConge", congesDuJour.size());
        resultat.put("horairesDuJour", horairesDuJour);
        resultat.put("congesDuJour", congesDuJour);
        
        return ResponseEntity.ok(resultat);
    }
    
    @GetMapping("/statistiques")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Statistiques générales", description = "Statistiques générales de l'application (Admin uniquement)")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        List<Collaborateur> tousCollaborateurs = collaborateurService.getAllCollaborateurs();
        List<Conge> tousConges = congeService.getAllConges();
        List<Horaire> tousHoraires = horaireService.getAllHoraires();
        
        long congesEnAttente = tousConges.stream()
            .filter(conge -> conge.getStatut() == StatutConge.EN_ATTENTE)
            .count();
        
        long congesValides = tousConges.stream()
            .filter(conge -> conge.getStatut() == StatutConge.VALIDE)
            .count();
        
        long congesRejetes = tousConges.stream()
            .filter(conge -> conge.getStatut() == StatutConge.REJETE)
            .count();
        
        Map<String, Object> statistiques = new HashMap<>();
        statistiques.put("totalCollaborateurs", tousCollaborateurs.size());
        statistiques.put("totalConges", tousConges.size());
        statistiques.put("congesEnAttente", congesEnAttente);
        statistiques.put("congesValides", congesValides);
        statistiques.put("congesRejetes", congesRejetes);
        statistiques.put("totalHoraires", tousHoraires.size());
        
        return ResponseEntity.ok(statistiques);
    }
    
    @GetMapping("/planning-hebdomadaire")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Planning hebdomadaire", description = "Vue du planning de la semaine (Admin uniquement)")
    public ResponseEntity<Map<String, Object>> getPlanningHebdomadaire(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut) {
        
        LocalDate dateFin = dateDebut.plusDays(6); // Semaine de 7 jours
        
        List<Collaborateur> tousCollaborateurs = collaborateurService.getAllCollaborateurs();
        Map<String, Object> planning = new HashMap<>();
        
        for (Collaborateur collaborateur : tousCollaborateurs) {
            List<Horaire> horaires = horaireService.getHorairesByCollaborateurAndPeriod(
                collaborateur.getId(), dateDebut, dateFin);
            List<Conge> conges = congeService.getCongesByCollaborateur(collaborateur.getId())
                .stream()
                .filter(conge -> conge.getStatut() == StatutConge.VALIDE)
                .filter(conge -> !(dateFin.isBefore(conge.getDateDebut()) || dateDebut.isAfter(conge.getDateFin())))
                .collect(Collectors.toList());
            
            Map<String, Object> planningCollaborateur = new HashMap<>();
            planningCollaborateur.put("collaborateur", collaborateur);
            planningCollaborateur.put("horaires", horaires);
            planningCollaborateur.put("conges", conges);
            
            planning.put("collaborateur_" + collaborateur.getId(), planningCollaborateur);
        }
        
        Map<String, Object> resultat = new HashMap<>();
        resultat.put("dateDebut", dateDebut);
        resultat.put("dateFin", dateFin);
        resultat.put("planning", planning);
        
        return ResponseEntity.ok(resultat);
    }
    
    @GetMapping("/mes-informations")
    @Operation(summary = "Mes informations", description = "Tableau de bord personnel du collaborateur connecté")
    public ResponseEntity<Map<String, Object>> getMesInformations() {
        // Note: Cette méthode devrait récupérer l'ID du collaborateur connecté depuis le SecurityContext
        // Pour l'instant, nous retournons une structure d'exemple
        
        Map<String, Object> mesInfos = new HashMap<>();
        mesInfos.put("message", "Endpoint pour les informations personnelles du collaborateur connecté");
        mesInfos.put("note", "Implémentation complète nécessite la récupération de l'utilisateur depuis SecurityContext");
        
        return ResponseEntity.ok(mesInfos);
    }
}