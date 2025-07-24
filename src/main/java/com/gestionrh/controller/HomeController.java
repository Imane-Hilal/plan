package com.gestionrh.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Contrôleur pour la page d'accueil
 */
@Controller
public class HomeController {
    
    /**
     * Page d'accueil - redirige vers la page de connexion
     */
    @GetMapping("/")
    public RedirectView home() {
        return new RedirectView("/login.html");
    }
}