package com.gestionrh.controller;

import com.gestionrh.dto.JwtResponse;
import com.gestionrh.dto.LoginRequest;
import com.gestionrh.entity.Collaborateur;
import com.gestionrh.security.JwtUtils;
import com.gestionrh.security.UserDetailsImpl;
import com.gestionrh.service.CollaborateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification", description = "API pour l'authentification des collaborateurs")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    CollaborateurService collaborateurService;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    @Operation(summary = "Connexion", description = "Authentifier un collaborateur et retourner un token JWT")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager
            .authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), 
                loginRequest.getMotDePasse()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Collaborateur collaborateur = collaborateurService.getCollaborateurByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé"));
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                                               userDetails.getId(),
                                               userDetails.getUsername(),
                                               collaborateur.getNom(),
                                               collaborateur.getPrenom(),
                                               collaborateur.getRole()));
    }
    
    @PostMapping("/signup")
    @Operation(summary = "Inscription", description = "Créer un nouveau compte collaborateur (Admin uniquement)")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Collaborateur collaborateur) {
        if (collaborateurService.existsByEmail(collaborateur.getEmail())) {
            return ResponseEntity.badRequest()
                .body("Erreur: Email déjà utilisé!");
        }
        
        try {
            Collaborateur nouveauCollaborateur = collaborateurService.createCollaborateur(collaborateur);
            return ResponseEntity.ok("Collaborateur créé avec succès!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}