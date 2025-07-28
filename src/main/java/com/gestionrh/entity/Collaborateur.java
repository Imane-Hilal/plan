package com.gestionrh.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "collaborateurs")
public class Collaborateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Column(nullable = false)
    private String prenom;
    
    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Le poste est obligatoire")
    @Column(nullable = false)
    private String poste;
    
    @NotNull(message = "Le rôle est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @JsonIgnore
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Column(nullable = false)
    private String motDePasse;
    
    @JsonIgnore
    @OneToMany(mappedBy = "collaborateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Horaire> horaires = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "collaborateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Conge> conges = new ArrayList<>();
    
    // Constructeurs
    public Collaborateur() {}
    
    public Collaborateur(String nom, String prenom, String email, String poste, Role role, String motDePasse) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.poste = poste;
        this.role = role;
        this.motDePasse = motDePasse;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getPrenom() {
        return prenom;
    }
    
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPoste() {
        return poste;
    }
    
    public void setPoste(String poste) {
        this.poste = poste;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public String getMotDePasse() {
        return motDePasse;
    }
    
    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    public List<Horaire> getHoraires() {
        return horaires;
    }
    
    public void setHoraires(List<Horaire> horaires) {
        this.horaires = horaires;
    }
    
    public List<Conge> getConges() {
        return conges;
    }
    
    public void setConges(List<Conge> conges) {
        this.conges = conges;
    }
}