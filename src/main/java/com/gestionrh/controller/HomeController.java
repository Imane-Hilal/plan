package com.gestionrh.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login.html";
    }
    
    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }
    
    @GetMapping("/dashboard") 
    public String dashboard() {
        return "redirect:/dashboard.html";
    }
    
    @GetMapping("/employees")
    public String employees() {
        return "redirect:/employees.html";
    }
    
    @GetMapping("/schedules")
    public String schedules() {
        return "redirect:/schedules.html";
    }
    
    @GetMapping("/leaves")
    public String leaves() {
        return "redirect:/leaves.html";
    }
}