package com.gestionrh.service;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.entity.Role;
import com.gestionrh.repository.CollaborateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollaborateurServiceTest {

    @Mock
    private CollaborateurRepository collaborateurRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CollaborateurService collaborateurService;

    private Collaborateur collaborateur;

    @BeforeEach
    void setUp() {
        collaborateur = new Collaborateur();
        collaborateur.setId(1L);
        collaborateur.setNom("Dupont");
        collaborateur.setPrenom("Jean");
        collaborateur.setEmail("jean.dupont@test.com");
        collaborateur.setPoste("Développeur");
        collaborateur.setRole(Role.COLLABORATEUR);
        collaborateur.setMotDePasse("password123");
    }

    @Test
    void testGetAllCollaborateurs() {
        // Given
        List<Collaborateur> collaborateurs = Arrays.asList(collaborateur);
        when(collaborateurRepository.findAll()).thenReturn(collaborateurs);

        // When
        List<Collaborateur> result = collaborateurService.getAllCollaborateurs();

        // Then
        assertEquals(1, result.size());
        assertEquals("Dupont", result.get(0).getNom());
        verify(collaborateurRepository).findAll();
    }

    @Test
    void testGetCollaborateurById() {
        // Given
        when(collaborateurRepository.findById(1L)).thenReturn(Optional.of(collaborateur));

        // When
        Optional<Collaborateur> result = collaborateurService.getCollaborateurById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Dupont", result.get().getNom());
        verify(collaborateurRepository).findById(1L);
    }

    @Test
    void testCreateCollaborateur() {
        // Given
        when(collaborateurRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(collaborateurRepository.save(any(Collaborateur.class))).thenReturn(collaborateur);

        // When
        Collaborateur result = collaborateurService.createCollaborateur(collaborateur);

        // Then
        assertNotNull(result);
        verify(collaborateurRepository).existsByEmail(collaborateur.getEmail());
        verify(passwordEncoder).encode("password123");
        verify(collaborateurRepository).save(collaborateur);
    }

    @Test
    void testCreateCollaborateurWithExistingEmail() {
        // Given
        when(collaborateurRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            collaborateurService.createCollaborateur(collaborateur);
        });

        verify(collaborateurRepository).existsByEmail(collaborateur.getEmail());
        verify(collaborateurRepository, never()).save(any());
    }

    @Test
    void testExistsByEmail() {
        // Given
        when(collaborateurRepository.existsByEmail("test@email.com")).thenReturn(true);

        // When
        boolean result = collaborateurService.existsByEmail("test@email.com");

        // Then
        assertTrue(result);
        verify(collaborateurRepository).existsByEmail("test@email.com");
    }
}