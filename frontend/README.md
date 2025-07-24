# GestionRH - Frontend

## 🎯 Interface Web Simple pour GestionRH

Cette interface web simple utilise HTML, CSS et JavaScript vanilla pour interagir avec l'API Spring Boot GestionRH.

## 🚀 Comment utiliser

### 1. **Démarrer le Backend**
Assurez-vous que votre application Spring Boot est en cours d'exécution sur `http://localhost:8080`

### 2. **Ouvrir le Frontend**
Ouvrez le fichier `index.html` dans votre navigateur web.

### 3. **Se connecter**
Utilisez l'un des comptes de test :

**Administrateur :**
- Email: `admin@gestionrh.com`
- Mot de passe: `password123`

**Utilisateur :**
- Email: `jean.dupont@gestionrh.com`
- Mot de passe: `password123`

## 📱 Fonctionnalités

### **🔐 Authentification**
- Connexion avec email/mot de passe
- Gestion automatique des tokens JWT
- Déconnexion sécurisée

### **📊 Tableau de bord**
- Vue d'ensemble des statistiques
- Affichage différent selon le rôle (Admin vs Utilisateur)
- Compteurs en temps réel

### **👥 Gestion des Collaborateurs** (Admin uniquement)
- Liste de tous les collaborateurs
- Ajouter de nouveaux collaborateurs
- Supprimer des collaborateurs
- Affichage des rôles et informations

### **📅 Gestion des Horaires**
- Affichage des horaires personnels (Utilisateur)
- Gestion complète des horaires (Admin)
- Ajout de nouveaux horaires
- Suppression d'horaires (Admin)

### **🏖️ Gestion des Congés**
- Demande de congés
- Historique personnel des congés (Utilisateur)
- Validation/Rejet des demandes (Admin)
- Vue complète de tous les congés (Admin)
- Statuts colorés (En attente, Validé, Rejeté)

## 🎨 Interface

### **Design Moderne**
- Interface responsive (mobile-friendly)
- Couleurs et icônes cohérentes
- Animations et transitions fluides
- Notifications toast pour le feedback

### **Navigation Intuitive**
- Menu de navigation adaptatif selon le rôle
- Sections clairement séparées
- Modals pour les formulaires
- Actions contextuelles

## 🔧 Fonctionnalités Techniques

### **Gestion d'État**
- Stockage local des tokens d'authentification
- Persistence de la session utilisateur
- Gestion automatique de l'expiration des sessions

### **Appels API**
- Communication avec l'API REST Spring Boot
- Gestion des erreurs HTTP
- Headers d'autorisation automatiques
- Feedback utilisateur en temps réel

### **Sécurité**
- Redirection automatique si non authentifié
- Contrôle d'accès basé sur les rôles
- Tokens JWT sécurisés
- Validation côté client

## 📂 Structure des Fichiers

```
frontend/
├── index.html      # Page principale
├── styles.css      # Styles CSS
├── script.js       # Logique JavaScript
└── README.md       # Documentation
```

## 🌐 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🚀 Démarrage Rapide

1. **Ouvrir le fichier** : Double-cliquez sur `index.html`
2. **Se connecter** : Utilisez `admin@gestionrh.com` / `password123`
3. **Explorer** : Naviguez dans les différentes sections
4. **Tester** : Ajoutez des horaires, demandez des congés, etc.

## 📝 Notes

- **Pas de serveur web requis** : Fonctionne directement dans le navigateur
- **CORS** : L'API Spring Boot doit autoriser les requêtes cross-origin
- **Temps réel** : Les données sont mises à jour à chaque navigation
- **Responsive** : Interface adaptée aux téléphones et tablettes

---

**Profitez de votre système de gestion RH ! 🎉**