package com.gestionrh.controller;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.Role;
import com.gestionrh.service.CollaborateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/collaborateurs")
@Tag(name = "Collaborateurs", description = "API pour la gestion des collaborateurs")
public class CollaborateurController {
    
    @Autowired
    private CollaborateurService collaborateurService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister tous les collaborateurs", description = "Récupérer la liste de tous les collaborateurs (Admin uniquement)")
    public ResponseEntity<List<Collaborateur>> getAllCollaborateurs() {
        List<Collaborateur> collaborateurs = collaborateurService.getAllCollaborateurs();
        return ResponseEntity.ok(collaborateurs);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @Operation(summary = "Récupérer un collaborateur", description = "Récupérer un collaborateur par son ID")
    public ResponseEntity<Collaborateur> getCollaborateurById(@PathVariable Long id) {
        return collaborateurService.getCollaborateurById(id)
            .map(collaborateur -> ResponseEntity.ok().body(collaborateur))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister collaborateurs par rôle", description = "Récupérer les collaborateurs par rôle (Admin uniquement)")
    public ResponseEntity<List<Collaborateur>> getCollaborateursByRole(@PathVariable Role role) {
        List<Collaborateur> collaborateurs = collaborateurService.getCollaborateursByRole(role);
        return ResponseEntity.ok(collaborateurs);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un collaborateur", description = "Créer un nouveau collaborateur (Admin uniquement)")
    public ResponseEntity<?> createCollaborateur(@Valid @RequestBody Collaborateur collaborateur) {
        try {
            Collaborateur nouveauCollaborateur = collaborateurService.createCollaborateur(collaborateur);
            return ResponseEntity.ok(nouveauCollaborateur);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @Operation(summary = "Modifier un collaborateur", description = "Modifier les informations d'un collaborateur")
    public ResponseEntity<?> updateCollaborateur(@PathVariable Long id, 
                                                @Valid @RequestBody Collaborateur collaborateurDetails) {
        try {
            Collaborateur collaborateurMisAJour = collaborateurService.updateCollaborateur(id, collaborateurDetails);
            return ResponseEntity.ok(collaborateurMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un collaborateur", description = "Supprimer un collaborateur (Admin uniquement)")
    public ResponseEntity<?> deleteCollaborateur(@PathVariable Long id) {
        try {
            collaborateurService.deleteCollaborateur(id);
            return ResponseEntity.ok().body("Collaborateur supprimé avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}