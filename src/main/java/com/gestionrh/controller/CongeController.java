package com.gestionrh.controller;

import com.gestionrh.entity.Conge;
import com.gestionrh.entity.StatutConge;
import com.gestionrh.service.CongeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/conges")
@Tag(name = "Congés", description = "API pour la gestion des congés")
public class CongeController {
    
    @Autowired
    private CongeService congeService;
    
    @GetMapping
    @Operation(summary = "Lister tous les congés", description = "Récupérer la liste de tous les congés")
    public ResponseEntity<List<Conge>> getAllConges() {
        List<Conge> conges = congeService.getAllConges();
        return ResponseEntity.ok(conges);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @congeService.getCongeById(#id).orElse(null)?.collaborateur?.id == authentication.principal.id")
    @Operation(summary = "Récupérer un congé", description = "Récupérer un congé par son ID")
    public ResponseEntity<Conge> getCongeById(@PathVariable Long id) {
        return congeService.getCongeById(id)
            .map(conge -> ResponseEntity.ok().body(conge))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/collaborateur/{collaborateurId}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #collaborateurId")
    @Operation(summary = "Historique des congés d'un collaborateur", description = "Récupérer l'historique des congés d'un collaborateur")
    public ResponseEntity<List<Conge>> getHistoriqueCongesCollaborateur(@PathVariable Long collaborateurId) {
        List<Conge> conges = congeService.getHistoriqueCongesCollaborateur(collaborateurId);
        return ResponseEntity.ok(conges);
    }
    
    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Congés en attente", description = "Récupérer tous les congés en attente de validation (Admin uniquement)")
    public ResponseEntity<List<Conge>> getCongesEnAttente() {
        List<Conge> conges = congeService.getCongesEnAttente();
        return ResponseEntity.ok(conges);
    }
    
    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Congés par statut", description = "Récupérer les congés par statut (Admin uniquement)")
    public ResponseEntity<List<Conge>> getCongesByStatut(@PathVariable StatutConge statut) {
        List<Conge> conges = congeService.getCongesByStatut(statut);
        return ResponseEntity.ok(conges);
    }
    
    @PostMapping("/soumettre")
    @Operation(summary = "Soumettre une demande de congé", description = "Soumettre une nouvelle demande de congé")
    public ResponseEntity<?> soumettreDemandeConge(@Valid @RequestBody Conge conge) {
        try {
            Conge nouvelleDemandeConge = congeService.soumettreDemandeConge(conge);
            return ResponseEntity.ok(nouvelleDemandeConge);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Valider un congé", description = "Valider une demande de congé (Admin uniquement)")
    public ResponseEntity<?> validerConge(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String commentaire = request.get("commentaire");
            Conge congeValide = congeService.validerConge(id, commentaire);
            return ResponseEntity.ok(congeValide);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/rejeter")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rejeter un congé", description = "Rejeter une demande de congé (Admin uniquement)")
    public ResponseEntity<?> rejeterConge(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String commentaire = request.get("commentaire");
            Conge congeRejete = congeService.rejeterConge(id, commentaire);
            return ResponseEntity.ok(congeRejete);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("@congeService.getCongeById(#id).orElse(null)?.collaborateur?.id == authentication.principal.id")
    @Operation(summary = "Modifier un congé", description = "Modifier une demande de congé en attente")
    public ResponseEntity<?> updateConge(@PathVariable Long id, @Valid @RequestBody Conge congeDetails) {
        try {
            Conge congeMisAJour = congeService.updateConge(id, congeDetails);
            return ResponseEntity.ok(congeMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @congeService.getCongeById(#id).orElse(null)?.collaborateur?.id == authentication.principal.id")
    @Operation(summary = "Supprimer un congé", description = "Supprimer une demande de congé")
    public ResponseEntity<?> deleteConge(@PathVariable Long id) {
        try {
            congeService.deleteConge(id);
            return ResponseEntity.ok().body("Congé supprimé avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}