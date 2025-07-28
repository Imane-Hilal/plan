package com.gestionrh.repository;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaborateurRepository extends JpaRepository<Collaborateur, Long> {
    
    Optional<Collaborateur> findByEmail(String email);
    
    List<Collaborateur> findByRole(Role role);
    
    List<Collaborateur> findByPoste(String poste);
    
    boolean existsByEmail(String email);
}