# Guide d'installation - MySQL (phpMyAdmin)

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL Server (v5.7 ou supérieur)
- phpMyAdmin (optionnel, pour gérer la base de données visuellement)

## Installation pas à pas

### 1. Installer MySQL

#### Windows
- Télécharger XAMPP : https://www.apachefriends.org/
- Installer XAMPP (inclut MySQL et phpMyAdmin)
- Démarrer MySQL depuis le panneau de contrôle XAMPP

#### Linux
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

#### macOS
```bash
brew install mysql
brew services start mysql
```

### 2. Créer la base de données

#### Option A : Via phpMyAdmin
1. Ouvrir phpMyAdmin dans votre navigateur : http://localhost/phpmyadmin
2. Cliquer sur "Nouvelle base de données"
3. Nom : `robi_marketplace`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer sur "Créer"

#### Option B : Via ligne de commande MySQL
```bash
mysql -u root -p
```

Puis dans MySQL :
```sql
CREATE DATABASE robi_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configurer le projet

1. Cloner ou télécharger le projet

2. Installer les dépendances Node.js :
```bash
npm install
```

3. Configurer les variables d'environnement dans `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=robi_marketplace
SESSION_SECRET=votre_secret_session
OPENROUTER_API_KEY=votre_cle_api
PORT=3000
```

**Note :** Si vous utilisez XAMPP, le mot de passe par défaut est vide :
```env
DB_PASSWORD=
```

### 4. Initialiser la base de données

Créer les tables :
```bash
npm run init-db
```

Vous devriez voir :
```
✅ Base de données MySQL initialisée avec succès !
```

### 5. Vérifier l'installation

Lister les tables créées :
```bash
npm run list-tables
```

Vous devriez voir :
```
1. users
2. merchants
3. products
4. bots
5. conversations
```

### 6. Démarrer le serveur

```bash
npm start
```

Ou en mode développement avec rechargement automatique :
```bash
npm run dev
```

Le serveur démarre sur : http://localhost:3000

## Commandes utiles

```bash
# Démarrer le serveur
npm start

# Mode développement
npm run dev

# Initialiser/réinitialiser les tables
npm run init-db

# Lister les tables
npm run list-tables

# Vérifier les données
npm run check-data

# Nettoyer toutes les données (garde les tables)
npm run clean-db
```

## Dépannage

### Erreur de connexion MySQL

**Problème :** `ER_ACCESS_DENIED_ERROR`

**Solution :**
1. Vérifier que MySQL est démarré
2. Vérifier les identifiants dans `.env`
3. Tester la connexion :
```bash
mysql -u root -p
```

### Base de données introuvable

**Problème :** `ER_BAD_DB_ERROR: Unknown database 'robi_marketplace'`

**Solution :**
Créer la base de données manuellement :
```sql
CREATE DATABASE robi_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Port déjà utilisé

**Problème :** `EADDRINUSE: address already in use :::3000`

**Solution :**
Changer le port dans `.env` :
```env
PORT=3001
```

### Erreur UUID()

**Problème :** MySQL < 8.0 ne supporte pas UUID()

**Solution :**
Mettre à jour MySQL vers la version 8.0+ ou modifier le schéma pour utiliser des ID auto-incrémentés.

## Structure de la base de données

### Tables créées

1. **users** - Utilisateurs (marchands et clients)
2. **merchants** - Profils des marchands
3. **products** - Catalogue de produits
4. **bots** - Assistants IA des marchands
5. **conversations** - Historique des conversations

### Visualiser dans phpMyAdmin

1. Ouvrir http://localhost/phpmyadmin
2. Sélectionner `robi_marketplace` dans le menu de gauche
3. Explorer les tables et leurs données

## Prochaines étapes

1. Créer un compte marchand : http://localhost:3000/auth/register
2. Ajouter des produits
3. Créer votre bot IA
4. Tester avec un compte client

## Support

Pour toute question ou problème, vérifier :
- Les logs du serveur Node.js
- Les logs MySQL (dans XAMPP ou `/var/log/mysql/`)
- La configuration dans `.env`
