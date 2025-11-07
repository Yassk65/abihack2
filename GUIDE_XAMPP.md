# Guide XAMPP pour Robi Marketplace

## 🎯 Pourquoi XAMPP ?

XAMPP est la solution la plus simple pour installer MySQL et phpMyAdmin sur Windows. Il inclut :
- ✅ MySQL Server
- ✅ phpMyAdmin (interface web pour gérer MySQL)
- ✅ Apache (non nécessaire pour ce projet)
- ✅ Configuration automatique

## 📥 Installation de XAMPP

### 1. Télécharger XAMPP

Aller sur : https://www.apachefriends.org/

Télécharger la version pour votre système :
- Windows : xampp-windows-x64-installer.exe
- macOS : xampp-osx-installer.dmg
- Linux : xampp-linux-x64-installer.run

### 2. Installer XAMPP

1. Lancer l'installateur
2. Sélectionner les composants (MySQL et phpMyAdmin minimum)
3. Choisir le dossier d'installation (par défaut : `C:\xampp`)
4. Terminer l'installation

### 3. Démarrer MySQL

1. Ouvrir le **XAMPP Control Panel**
2. Cliquer sur **Start** à côté de **MySQL**
3. Le statut doit passer à vert avec "Running"

![XAMPP Control Panel](https://i.imgur.com/example.png)

## 🗄️ Créer la base de données

### Option 1 : Via phpMyAdmin (Recommandé)

1. Ouvrir phpMyAdmin dans votre navigateur :
   ```
   http://localhost/phpmyadmin
   ```

2. Cliquer sur **"Nouvelle base de données"** (ou "New" en anglais)

3. Remplir les informations :
   - **Nom** : `robi_marketplace`
   - **Interclassement** : `utf8mb4_unicode_ci`

4. Cliquer sur **"Créer"**

### Option 2 : Via ligne de commande

1. Ouvrir le terminal/invite de commandes

2. Naviguer vers le dossier MySQL de XAMPP :
   ```bash
   cd C:\xampp\mysql\bin
   ```

3. Se connecter à MySQL :
   ```bash
   mysql -u root -p
   ```
   (Appuyer sur Entrée si aucun mot de passe n'est défini)

4. Créer la base de données :
   ```sql
   CREATE DATABASE robi_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

## ⚙️ Configuration du projet

### 1. Fichier .env

Créer ou modifier le fichier `.env` à la racine du projet :

```env
# Configuration MySQL (XAMPP par défaut)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=robi_marketplace

# Autres configurations
SESSION_SECRET=votre_secret_session_ici
OPENROUTER_API_KEY=votre_cle_api_ici
PORT=3000
```

**Important** : Avec XAMPP, le mot de passe par défaut est **vide** (pas de mot de passe).

### 2. Tester la connexion

```bash
npm run test-connection
```

Vous devriez voir :
```
✅ Connexion réussie!
✅ Base de données active: robi_marketplace
✅ Version: 10.x.x-MariaDB
```

### 3. Initialiser les tables

```bash
npm run init-db
```

Vous devriez voir :
```
✅ Base de données MySQL initialisée avec succès !
```

## 🔍 Vérifier dans phpMyAdmin

1. Ouvrir phpMyAdmin : http://localhost/phpmyadmin

2. Cliquer sur `robi_marketplace` dans le menu de gauche

3. Vous devriez voir 5 tables :
   - users
   - merchants
   - products
   - bots
   - conversations

4. Cliquer sur une table pour voir sa structure

## 🚀 Démarrer le projet

```bash
npm start
```

Ouvrir dans le navigateur : http://localhost:3000

## 🐛 Dépannage XAMPP

### MySQL ne démarre pas

**Problème** : Le bouton Start ne fonctionne pas ou MySQL s'arrête immédiatement.

**Solutions** :

1. **Port 3306 déjà utilisé**
   - Ouvrir le XAMPP Control Panel
   - Cliquer sur "Config" à côté de MySQL
   - Sélectionner "my.ini"
   - Changer le port (ligne `port=3306` → `port=3307`)
   - Redémarrer MySQL
   - Mettre à jour `.env` : `DB_HOST=localhost:3307`

2. **Service MySQL Windows en conflit**
   - Ouvrir les Services Windows (services.msc)
   - Arrêter le service "MySQL" ou "MySQL80"
   - Redémarrer XAMPP MySQL

3. **Fichiers corrompus**
   - Arrêter MySQL dans XAMPP
   - Sauvegarder `C:\xampp\mysql\data`
   - Supprimer les fichiers `ib_logfile*` dans ce dossier
   - Redémarrer MySQL

### phpMyAdmin ne s'ouvre pas

**Problème** : http://localhost/phpmyadmin ne fonctionne pas

**Solutions** :

1. **Apache n'est pas démarré**
   - Démarrer Apache dans le XAMPP Control Panel
   - Réessayer d'accéder à phpMyAdmin

2. **Port 80 occupé**
   - Changer le port d'Apache (Config → httpd.conf)
   - Chercher `Listen 80` et changer en `Listen 8080`
   - Accéder à : http://localhost:8080/phpmyadmin

### Erreur "Access denied for user 'root'@'localhost'"

**Problème** : Le projet ne peut pas se connecter à MySQL

**Solutions** :

1. **Vérifier le mot de passe**
   - Par défaut, XAMPP n'a pas de mot de passe
   - Dans `.env`, laisser `DB_PASSWORD=` vide

2. **Définir un mot de passe**
   - Ouvrir phpMyAdmin
   - Aller dans "Comptes utilisateurs"
   - Modifier l'utilisateur "root"
   - Définir un mot de passe
   - Mettre à jour `.env` avec ce mot de passe

### Base de données introuvable

**Problème** : `ER_BAD_DB_ERROR: Unknown database 'robi_marketplace'`

**Solution** :
- Créer la base de données dans phpMyAdmin (voir section ci-dessus)
- Ou exécuter :
  ```sql
  CREATE DATABASE robi_marketplace;
  ```

## 📊 Utiliser phpMyAdmin

### Visualiser les données

1. Sélectionner `robi_marketplace`
2. Cliquer sur une table (ex: `users`)
3. Onglet "Afficher" pour voir les données

### Exécuter des requêtes SQL

1. Sélectionner `robi_marketplace`
2. Onglet "SQL"
3. Écrire votre requête :
   ```sql
   SELECT * FROM users;
   ```
4. Cliquer sur "Exécuter"

### Exporter la base de données

1. Sélectionner `robi_marketplace`
2. Onglet "Exporter"
3. Méthode : "Rapide"
4. Format : "SQL"
5. Cliquer sur "Exécuter"

### Importer une base de données

1. Sélectionner `robi_marketplace`
2. Onglet "Importer"
3. Choisir le fichier .sql
4. Cliquer sur "Exécuter"

## 🔒 Sécurité (Production)

⚠️ **XAMPP n'est PAS recommandé pour la production !**

Pour la production :
1. Utiliser un serveur MySQL dédié
2. Définir un mot de passe fort pour root
3. Créer un utilisateur MySQL spécifique pour l'application
4. Limiter les privilèges de cet utilisateur
5. Activer le pare-feu MySQL

## 💡 Astuces

### Démarrage automatique

Pour démarrer MySQL automatiquement avec Windows :
1. XAMPP Control Panel
2. Cliquer sur "Config" (en haut à droite)
3. Cocher "MySQL" dans "Autostart of modules"

### Sauvegardes automatiques

Créer un script batch pour sauvegarder la base :
```batch
@echo off
cd C:\xampp\mysql\bin
mysqldump -u root robi_marketplace > C:\backups\robi_%date:~-4,4%%date:~-7,2%%date:~-10,2%.sql
```

### Accès réseau

Pour accéder à MySQL depuis un autre ordinateur :
1. Modifier `C:\xampp\mysql\bin\my.ini`
2. Commenter la ligne : `# bind-address=127.0.0.1`
3. Redémarrer MySQL
4. Configurer le pare-feu Windows

## 📚 Ressources

- Documentation XAMPP : https://www.apachefriends.org/docs/
- Documentation MySQL : https://dev.mysql.com/doc/
- Forum XAMPP : https://community.apachefriends.org/

## ✅ Checklist de démarrage

- [ ] XAMPP installé
- [ ] MySQL démarré (vert dans Control Panel)
- [ ] Base de données `robi_marketplace` créée
- [ ] Fichier `.env` configuré
- [ ] `npm install` exécuté
- [ ] `npm run test-connection` réussi
- [ ] `npm run init-db` réussi
- [ ] Tables visibles dans phpMyAdmin
- [ ] `npm start` fonctionne
- [ ] Application accessible sur http://localhost:3000

## 🎉 Prêt !

Votre environnement XAMPP est configuré et prêt pour Robi Marketplace !
