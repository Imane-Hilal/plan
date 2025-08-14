package com.gestionrh.controller;

import com.gestionrh.entity.Horaire;
import com.gestionrh.service.HoraireService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/horaires")
@Tag(name = "Horaires", description = "API pour la gestion des horaires de travail")
public class HoraireController {
    
    @Autowired
    private HoraireService horaireService;
    
    @GetMapping
    @Operation(summary = "Lister tous les horaires", description = "Récupérer la liste de tous les horaires")
    public ResponseEntity<List<Horaire>> getAllHoraires() {
        try {
            List<Horaire> horaires = horaireService.getAllHoraires();
            return ResponseEntity.ok(horaires);
        } catch (Exception e) {
            System.out.println("Erreur lors de la récupération des horaires: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un horaire", description = "Récupérer un horaire par son ID")
    public ResponseEntity<Horaire> getHoraireById(@PathVariable Long id) {
        return horaireService.getHoraireById(id)
            .map(horaire -> ResponseEntity.ok().body(horaire))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/collaborateur/{collaborateurId}")
    @Operation(summary = "Horaires d'un collaborateur", description = "Récupérer tous les horaires d'un collaborateur")
    public ResponseEntity<List<Horaire>> getHorairesByCollaborateur(@PathVariable Long collaborateurId) {
        List<Horaire> horaires = horaireService.getHorairesByCollaborateur(collaborateurId);
        return ResponseEntity.ok(horaires);
    }
    
    @GetMapping("/collaborateur/{collaborateurId}/planning")
    @Operation(summary = "Planning d'un collaborateur", description = "Récupérer le planning d'un collaborateur sur une période")
    public ResponseEntity<List<Horaire>> getPlanningCollaborateur(
            @PathVariable Long collaborateurId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        
        List<Horaire> planning = horaireService.getPlanningCollaborateur(collaborateurId, dateDebut, dateFin);
        return ResponseEntity.ok(planning);
    }
    
    @GetMapping("/date/{date}")
    @Operation(summary = "Horaires par date", description = "Récupérer tous les horaires pour une date donnée")
    public ResponseEntity<List<Horaire>> getHorairesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Horaire> horaires = horaireService.getHorairesByDate(date);
        return ResponseEntity.ok(horaires);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un horaire", description = "Créer un nouvel horaire (Admin uniquement)")
    public ResponseEntity<?> createHoraire(@Valid @RequestBody Horaire horaire) {
        try {
            Horaire nouvelHoraire = horaireService.createHoraire(horaire);
            return ResponseEntity.ok(nouvelHoraire);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifier un horaire", description = "Modifier un horaire existant (Admin uniquement)")
    public ResponseEntity<?> updateHoraire(@PathVariable Long id, @Valid @RequestBody Horaire horaireDetails) {
        try {
            Horaire horaireMisAJour = horaireService.updateHoraire(id, horaireDetails);
            return ResponseEntity.ok(horaireMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un horaire", description = "Supprimer un horaire (Admin uniquement)")
    public ResponseEntity<?> deleteHoraire(@PathVariable Long id) {
        try {
            horaireService.deleteHoraire(id);
            return ResponseEntity.ok().body("Horaire supprimé avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}