package com.gestionrh.repository;

import com.gestionrh.entity.Horaire;
import com.gestionrh.entity.Collaborateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HoraireRepository extends JpaRepository<Horaire, Long> {
    
    List<Horaire> findByCollaborateur(Collaborateur collaborateur);
    
    List<Horaire> findByCollaborateurId(Long collaborateurId);
    
    List<Horaire> findByDate(LocalDate date);
    
    List<Horaire> findByCollaborateurAndDateBetween(Collaborateur collaborateur, LocalDate dateDebut, LocalDate dateFin);
    
    @Query("SELECT h FROM Horaire h WHERE h.collaborateur.id = :collaborateurId AND h.date BETWEEN :dateDebut AND :dateFin")
    List<Horaire> findByCollaborateurIdAndDateBetween(@Param("collaborateurId") Long collaborateurId, 
                                                     @Param("dateDebut") LocalDate dateDebut, 
                                                     @Param("dateFin") LocalDate dateFin);
}