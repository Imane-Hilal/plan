package com.gestionrh.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "conges")
public class Conge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La date de début est obligatoire")
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;
    
    @NotNull(message = "La date de fin est obligatoire")
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    
    @NotNull(message = "Le type de congé est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeConge type;
    
    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutConge statut = StatutConge.EN_ATTENTE;
    
    @Column(length = 500)
    private String motif;
    
    @Column(name = "commentaire_admin", length = 500)
    private String commentaireAdmin;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborateur_id", nullable = false)
    private Collaborateur collaborateur;
    
    // Constructeurs
    public Conge() {}
    
    public Conge(LocalDate dateDebut, LocalDate dateFin, TypeConge type, String motif, Collaborateur collaborateur) {
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.type = type;
        this.motif = motif;
        this.collaborateur = collaborateur;
        this.statut = StatutConge.EN_ATTENTE;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDate getDateDebut() {
        return dateDebut;
    }
    
    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }
    
    public LocalDate getDateFin() {
        return dateFin;
    }
    
    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
    
    public TypeConge getType() {
        return type;
    }
    
    public void setType(TypeConge type) {
        this.type = type;
    }
    
    public StatutConge getStatut() {
        return statut;
    }
    
    public void setStatut(StatutConge statut) {
        this.statut = statut;
    }
    
    public String getMotif() {
        return motif;
    }
    
    public void setMotif(String motif) {
        this.motif = motif;
    }
    
    public String getCommentaireAdmin() {
        return commentaireAdmin;
    }
    
    public void setCommentaireAdmin(String commentaireAdmin) {
        this.commentaireAdmin = commentaireAdmin;
    }
    
    public Collaborateur getCollaborateur() {
        return collaborateur;
    }
    
    public void setCollaborateur(Collaborateur collaborateur) {
        this.collaborateur = collaborateur;
    }
}