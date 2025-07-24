# GestionRH - Frontend Multi-Pages

## 🎯 Interface Web Complete pour GestionRH

Cette interface web complète utilise HTML, CSS et JavaScript vanilla pour interagir avec l'API Spring Boot GestionRH. L'application est organisée en plusieurs pages distinctes pour une meilleure expérience utilisateur.

## 📂 Structure du Frontend

```
frontend/
├── index.html          # Page de redirection vers login
├── login.html          # Page de connexion
├── dashboard.html      # Tableau de bord principal  
├── employees.html      # Gestion des collaborateurs (Admin)
├── schedules.html      # Gestion des horaires
├── leaves.html         # Gestion des congés
├── styles.css          # Styles CSS globaux
├── common.js           # Utilitaires communs
├── auth.js            # Gestion de l'authentification
├── dashboard.js       # Logique du tableau de bord
├── employees.js       # Logique des collaborateurs
├── schedules.js       # Logique des horaires
├── leaves.js          # Logique des congés
└── README.md          # Cette documentation
```

## 🚀 Comment utiliser

### 1. **Démarrer le Backend**
Assurez-vous que votre application Spring Boot est en cours d'exécution sur `http://localhost:8080`

### 2. **Ouvrir le Frontend**
Ouvrez le fichier `login.html` dans votre navigateur web ou accédez à `index.html` qui redirigera automatiquement.

### 3. **Se connecter**
Utilisez l'un des comptes de test :

**👑 Administrateur :**
- Email: `admin@gestionrh.com`
- Mot de passe: `password123`
- **Bouton de connexion rapide disponible**

**👤 Collaborateur :**
- Email: `jean.dupont@gestionrh.com`
- Mot de passe: `password123`
- **Bouton de connexion rapide disponible**

## 📱 Pages et Fonctionnalités

### **🔐 Page de Connexion (login.html)**
- Interface de connexion moderne et animée
- Validation des champs en temps réel
- Boutons de connexion rapide pour les tests
- Redirection automatique après connexion
- Gestion des erreurs d'authentification

### **📊 Tableau de Bord (dashboard.html)**
- **Bienvenue personnalisée** avec nom et rôle de l'utilisateur
- **Statistiques en temps réel** : collaborateurs, présents, en congé, demandes
- **Actions rapides** : liens vers les principales fonctions
- **Vue admin** : disponibilité globale et planning hebdomadaire
- **Activité récente** (à implémenter)

### **👥 Gestion des Collaborateurs (employees.html) - Admin uniquement**
- **Liste complète** de tous les collaborateurs avec avatars
- **Recherche et filtres** par nom, rôle, etc.
- **Statistiques** : total, admins, collaborateurs
- **Ajout de nouveaux collaborateurs** avec formulaire complet
- **Modification et suppression** des comptes existants
- **Gestion des rôles** et permissions

### **📅 Gestion des Horaires (schedules.html)**
- **Vue liste** et **vue calendrier** des horaires
- **Filtres par date** et collaborateur
- **Statistiques** : horaires totaux, aujourd'hui, cette semaine
- **Ajout d'horaires** avec calcul automatique de durée
- **Planification hebdomadaire** avec vue graphique
- **Modification/suppression** (selon permissions)

### **🏖️ Gestion des Congés (leaves.html)**
- **Historique complet** des demandes de congés
- **Filtres avancés** : statut, type, collaborateur
- **Statistiques détaillées** : total, en attente, validées, rejetées
- **Soumission de nouvelles demandes** avec calcul de durée
- **Validation/rejet** pour les admins avec commentaires
- **Vue calendrier** des congés (à implémenter)

## 🎨 Design et Expérience Utilisateur

### **Interface Moderne**
- **Design responsive** adapté mobile et desktop
- **Animations fluides** et transitions
- **Gradient coloré** et thème cohérent
- **Icons FontAwesome** pour l'esthétique
- **Notifications toast** pour le feedback

### **Navigation Intuitive**
- **Menu de navigation** adaptatif selon le rôle
- **Breadcrumbs** et indicateurs de page active
- **Actions contextuelles** visibles selon les permissions
- **Modals** pour les formulaires complexes

### **Ergonomie Avancée**
- **Chargement progressif** des données
- **États de chargement** visuels
- **Validation en temps réel** des formulaires
- **Messages d'erreur** explicites
- **Confirmations** pour les actions critiques

## 🔧 Fonctionnalités Techniques

### **Authentification Robuste**
- **JWT tokens** avec gestion automatique
- **Sessions persistantes** via localStorage
- **Redirection automatique** si non connecté
- **Déconnexion sécurisée** avec nettoyage

### **Communication API**
- **Wrapper API centralisé** avec gestion d'erreurs
- **Headers d'autorisation** automatiques
- **Gestion des timeouts** et reconnexions
- **Cache intelligent** des données utilisateur

### **Gestion d'État**
- **State management** basique avec localStorage
- **Synchronisation** des données entre pages
- **Mise à jour** en temps réel des compteurs
- **Persistence** des filtres et préférences

### **Utilitaires Avancés**
- **Formatage des dates** français
- **Calculs de durées** automatiques
- **Validation de formulaires** complète
- **Export CSV** des données
- **Recherche et filtrage** en temps réel

## 🌐 Navigation entre Pages

### **Flux Utilisateur Typique**
1. **index.html** → Redirection automatique
2. **login.html** → Authentification
3. **dashboard.html** → Page d'accueil après connexion
4. **Navigation** vers les pages spécialisées selon besoins
5. **Déconnexion** → Retour à login.html

### **Contrôles d'Accès**
- **Redirection automatique** si non authentifié
- **Masquage des éléments** selon le rôle
- **Pages admin** inaccessibles aux collaborateurs
- **Messages d'erreur** pour tentatives non autorisées

## 📱 Compatibilité et Performance

### **Navigateurs Supportés**
- ✅ **Chrome/Chromium** (recommandé)
- ✅ **Firefox** 
- ✅ **Safari**
- ✅ **Edge**
- ✅ **Mobile browsers** (iOS/Android)

### **Performance**
- **Chargement rapide** sans build process
- **Code optimisé** et minimaliste
- **Images optimisées** et icons vectoriels
- **Cache browser** efficace

## 🚀 Démarrage Rapide

### **Méthode 1 : Ouverture directe**
1. Ouvrir `login.html` dans le navigateur
2. Cliquer sur "Connexion rapide" Admin ou Utilisateur
3. Explorer les différentes pages

### **Méthode 2 : Serveur local**
```bash
# Si vous avez Python installé
cd frontend
python -m http.server 8000

# Puis ouvrir http://localhost:8000
```

### **Méthode 3 : Live Server (VS Code)**
1. Installer l'extension "Live Server"
2. Clic droit sur `login.html` → "Open with Live Server"

## 🎯 Fonctionnalités Avancées à Venir

- **Notifications push** pour nouvelles demandes
- **Mode sombre** et personnalisation
- **Rapports PDF** automatisés
- **Chat intégré** pour communication
- **Calendrier interactif** complet
- **Dashboard personnalisable** par utilisateur

## 📝 Notes Importantes

- **CORS configuré** côté backend pour autoriser les requêtes
- **Pas de serveur web requis** - fonctionne en file://
- **Données en temps réel** à chaque navigation
- **Responsive design** pour tous les écrans
- **Accessibilité** avec support clavier et lecteurs d'écran

---

## 🎉 **Votre Système GestionRH est Maintenant Complet !**

**Navigation :** login.html → dashboard.html → [employees.html | schedules.html | leaves.html]

**Profitez de votre solution HR complète avec interface moderne ! 🚀**