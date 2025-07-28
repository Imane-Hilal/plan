package com.gestionrh.repository;

import com.gestionrh.entity.Conge;
import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.StatutConge;
import com.gestionrh.entity.TypeConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CongeRepository extends JpaRepository<Conge, Long> {
    
    List<Conge> findByCollaborateur(Collaborateur collaborateur);
    
    List<Conge> findByCollaborateurId(Long collaborateurId);
    
    List<Conge> findByStatut(StatutConge statut);
    
    List<Conge> findByType(TypeConge type);
    
    List<Conge> findByCollaborateurAndStatut(Collaborateur collaborateur, StatutConge statut);
    
    @Query("SELECT c FROM Conge c WHERE c.statut = :statut ORDER BY c.dateDebut ASC")
    List<Conge> findByStatutOrderByDateDebut(@Param("statut") StatutConge statut);
    
    @Query("SELECT c FROM Conge c WHERE c.collaborateur.id = :collaborateurId AND " +
           "((c.dateDebut BETWEEN :dateDebut AND :dateFin) OR " +
           "(c.dateFin BETWEEN :dateDebut AND :dateFin) OR " +
           "(c.dateDebut <= :dateDebut AND c.dateFin >= :dateFin))")
    List<Conge> findByCollaborateurIdAndDateOverlap(@Param("collaborateurId") Long collaborateurId,
                                                   @Param("dateDebut") LocalDate dateDebut,
                                                   @Param("dateFin") LocalDate dateFin);
}