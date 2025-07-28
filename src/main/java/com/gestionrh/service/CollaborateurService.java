package com.gestionrh.service;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.Role;
import com.gestionrh.repository.CollaborateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CollaborateurService {
    
    @Autowired
    private CollaborateurRepository collaborateurRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<Collaborateur> getAllCollaborateurs() {
        return collaborateurRepository.findAll();
    }
    
    public Optional<Collaborateur> getCollaborateurById(Long id) {
        return collaborateurRepository.findById(id);
    }
    
    public Optional<Collaborateur> getCollaborateurByEmail(String email) {
        return collaborateurRepository.findByEmail(email);
    }
    
    public List<Collaborateur> getCollaborateursByRole(Role role) {
        return collaborateurRepository.findByRole(role);
    }
    
    public Collaborateur createCollaborateur(Collaborateur collaborateur) {
        if (collaborateurRepository.existsByEmail(collaborateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé!");
        }
        
        // Encoder le mot de passe
        collaborateur.setMotDePasse(passwordEncoder.encode(collaborateur.getMotDePasse()));
        
        return collaborateurRepository.save(collaborateur);
    }
    
    public Collaborateur updateCollaborateur(Long id, Collaborateur collaborateurDetails) {
        Collaborateur collaborateur = collaborateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé avec l'id: " + id));
        
        collaborateur.setNom(collaborateurDetails.getNom());
        collaborateur.setPrenom(collaborateurDetails.getPrenom());
        
        // Vérifier si l'email a changé et s'il n'est pas déjà utilisé
        if (!collaborateur.getEmail().equals(collaborateurDetails.getEmail())) {
            if (collaborateurRepository.existsByEmail(collaborateurDetails.getEmail())) {
                throw new RuntimeException("Email déjà utilisé!");
            }
            collaborateur.setEmail(collaborateurDetails.getEmail());
        }
        
        collaborateur.setPoste(collaborateurDetails.getPoste());
        collaborateur.setRole(collaborateurDetails.getRole());
        
        // Encoder le nouveau mot de passe s'il est fourni
        if (collaborateurDetails.getMotDePasse() != null && !collaborateurDetails.getMotDePasse().isEmpty()) {
            collaborateur.setMotDePasse(passwordEncoder.encode(collaborateurDetails.getMotDePasse()));
        }
        
        return collaborateurRepository.save(collaborateur);
    }
    
    public void deleteCollaborateur(Long id) {
        Collaborateur collaborateur = collaborateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborateur non trouvé avec l'id: " + id));
        
        collaborateurRepository.delete(collaborateur);
    }
    
    public boolean existsByEmail(String email) {
        return collaborateurRepository.existsByEmail(email);
    }
}