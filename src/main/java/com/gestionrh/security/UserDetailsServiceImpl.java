package com.gestionrh.security;

import com.gestionrh.entity.Collaborateur;
import com.gestionrh.repository.CollaborateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    CollaborateurRepository collaborateurRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Collaborateur collaborateur = collaborateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Collaborateur non trouvé avec l'email: " + email));
        
        return UserDetailsImpl.build(collaborateur);
    }
}