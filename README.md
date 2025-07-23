# GestionRH - Application de Gestion des Ressources Humaines

## Description

GestionRH est une application Spring Boot complète pour la gestion des ressources humaines. Elle permet de gérer les collaborateurs, leurs horaires de travail, leurs demandes de congés et offre un tableau de bord pour le suivi de la disponibilité.

## Fonctionnalités

### 🧑‍💼 Gestion des Collaborateurs
- CRUD complet des collaborateurs
- Authentification JWT avec rôles (ADMIN/COLLABORATEUR)
- Sécurité basée sur les rôles

### ⏰ Gestion des Horaires
- CRUD des horaires de travail
- Consultation du planning par collaborateur
- Vue globale des horaires par date

### 🏖️ Gestion des Congés
- Soumission de demandes de congé
- Validation/Rejet par les administrateurs
- Historique des congés
- Types de congés : PAYE, MALADIE, FORMATION, etc.

### 📊 Tableau de Bord
- Suivi de la disponibilité globale
- Statistiques générales
- Planning hebdomadaire
- Vue d'ensemble temps réel

## Technologies Utilisées

- **Backend**: Spring Boot 3.2.1
- **Sécurité**: Spring Security avec JWT
- **Base de données**: H2 Database (en mémoire)
- **ORM**: Spring Data JPA
- **Documentation API**: Swagger/OpenAPI 3
- **Tests**: JUnit 5, Mockito
- **Build**: Maven

## Architecture

```
src/
├── main/java/com/gestionrh/
│   ├── entity/          # Entités JPA
│   ├── repository/      # Repositories Spring Data
│   ├── service/         # Services métier
│   ├── controller/      # Contrôleurs REST
│   ├── security/        # Configuration sécurité JWT
│   ├── config/          # Configurations Spring
│   └── dto/             # DTOs pour les requêtes/réponses
├── main/resources/
│   ├── application.properties  # Configuration application
│   └── data.sql              # Données initiales
└── test/                    # Tests unitaires
```

## Installation et Démarrage

### Prérequis
- Java 17+
- Maven 3.6+

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-projet>
cd gestion-rh
```

2. **Compiler et lancer l'application**
```bash
mvn clean install
mvn spring-boot:run
```

3. **Accéder à l'application**
- API : http://localhost:8080
- Swagger UI : http://localhost:8080/swagger-ui.html
- Console H2 : http://localhost:8080/h2-console

### Configuration H2

Pour accéder à la console H2 :
- URL JDBC : `jdbc:h2:mem:testdb`
- Utilisateur : `sa`
- Mot de passe : `password`

## API Endpoints

### Authentification
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signup` - Inscription (Admin uniquement)

### Collaborateurs
- `GET /api/collaborateurs` - Liste tous les collaborateurs (Admin)
- `GET /api/collaborateurs/{id}` - Détails d'un collaborateur
- `POST /api/collaborateurs` - Créer un collaborateur (Admin)
- `PUT /api/collaborateurs/{id}` - Modifier un collaborateur
- `DELETE /api/collaborateurs/{id}` - Supprimer un collaborateur (Admin)

### Horaires
- `GET /api/horaires` - Liste tous les horaires (Admin)
- `GET /api/horaires/collaborateur/{id}` - Horaires d'un collaborateur
- `GET /api/horaires/collaborateur/{id}/planning?dateDebut=...&dateFin=...` - Planning sur période
- `POST /api/horaires` - Créer un horaire (Admin)
- `PUT /api/horaires/{id}` - Modifier un horaire (Admin)
- `DELETE /api/horaires/{id}` - Supprimer un horaire (Admin)

### Congés
- `GET /api/conges` - Liste tous les congés (Admin)
- `GET /api/conges/collaborateur/{id}` - Historique des congés
- `GET /api/conges/en-attente` - Congés en attente (Admin)
- `POST /api/conges/soumettre` - Soumettre une demande
- `POST /api/conges/{id}/valider` - Valider un congé (Admin)
- `POST /api/conges/{id}/rejeter` - Rejeter un congé (Admin)
- `PUT /api/conges/{id}` - Modifier un congé en attente
- `DELETE /api/conges/{id}` - Supprimer un congé

### Tableau de Bord
- `GET /api/dashboard/disponibilite?date=...` - Disponibilité globale (Admin)
- `GET /api/dashboard/statistiques` - Statistiques générales (Admin)
- `GET /api/dashboard/planning-hebdomadaire?dateDebut=...` - Planning semaine (Admin)

## Authentification

L'application utilise JWT pour l'authentification. Pour accéder aux endpoints protégés :

1. **Se connecter** via `POST /api/auth/signin`
```json
{
  "email": "admin@gestionrh.com",
  "motDePasse": "password123"
}
```

2. **Utiliser le token** retourné dans le header Authorization :
```
Authorization: Bearer <votre-token-jwt>
```

## Comptes de Test

L'application est pré-configurée avec les comptes suivants :

### Administrateur
- Email: `admin@gestionrh.com`
- Mot de passe: `password123`
- Rôle: ADMIN

### Collaborateurs
- Email: `marie.martin@gestionrh.com` | Mot de passe: `password123`
- Email: `pierre.durand@gestionrh.com` | Mot de passe: `password123`
- Email: `sophie.bernard@gestionrh.com` | Mot de passe: `password123`
- Email: `lucas.petit@gestionrh.com` | Mot de passe: `password123`

## Modèle de Données

### Collaborateur
- id, nom, prénom, email, poste, rôle, motDePasse
- Relations : horaires[], congés[]

### Horaire
- id, date, heureDebut, heureFin
- Relation : collaborateur

### Congé
- id, dateDebut, dateFin, type, statut, motif, commentaireAdmin
- Relation : collaborateur

### Énumérations
- **Role**: ADMIN, COLLABORATEUR
- **TypeConge**: PAYE, MALADIE, FORMATION, MATERNITE, PATERNITE, SANS_SOLDE
- **StatutConge**: EN_ATTENTE, VALIDE, REJETE

## Tests

Pour exécuter les tests :
```bash
mvn test
```

Les tests incluent :
- Tests unitaires des services
- Tests de contexte Spring Boot
- Mocks avec Mockito

## Sécurité

- **Authentification JWT** : Tokens sécurisés avec expiration
- **Autorisation basée sur les rôles** : ADMIN vs COLLABORATEUR
- **Protection CSRF** : Désactivée pour l'API REST
- **Encodage des mots de passe** : BCrypt
- **CORS** : Configuré pour le développement

## Configuration

### Variables d'environnement principales
- `app.jwt.secret` : Clé secrète JWT (défaut: mySecretKey)
- `app.jwt.expiration` : Durée d'expiration en ms (défaut: 24h)

### Profils Spring
- **Développement** : H2 en mémoire, logs debug
- **Production** : À configurer selon l'environnement

## Améliorations Possibles

- 🔒 Intégration avec Active Directory
- 📧 Notifications par email pour les congés
- 📱 Interface web responsive
- 🔄 Migration vers base de données persistante
- 📊 Rapports et analytics avancés
- 🌍 Internationalisation (i18n)
- ☁️ Déploiement cloud (Docker, Kubernetes)

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ en Spring Boot**