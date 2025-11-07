# 📝 Commandes disponibles

## 🚀 Démarrage

```bash
# Démarrer le serveur en mode production
npm start

# Démarrer en mode développement (rechargement automatique)
npm run dev
```

## 🗄️ Base de données

```bash
# Tester la connexion MySQL
npm run test-connection

# Initialiser/créer les tables
npm run init-db

# Lister toutes les tables
npm run list-tables

# Vérifier les données existantes
npm run check-data

# Nettoyer toutes les données (garde les tables)
npm run clean-db
```

## 🔧 Installation

```bash
# Installer toutes les dépendances
npm install

# Installer en mode production uniquement
npm install --production
```

## 📊 Détails des commandes

### `npm start`
Lance le serveur Node.js en mode production.
- Port par défaut : 3000
- Accessible sur : http://localhost:3000

### `npm run dev`
Lance le serveur avec nodemon pour le rechargement automatique.
- Idéal pour le développement
- Redémarre automatiquement à chaque modification de fichier

### `npm run test-connection`
Teste la connexion à MySQL et affiche :
- ✅ État de la connexion
- ✅ Nom de la base de données active
- ✅ Liste des tables
- ✅ Version de MySQL

**Utiliser cette commande en premier** pour vérifier que tout est bien configuré.

### `npm run init-db`
Crée toutes les tables dans la base de données :
- users
- merchants
- products
- bots
- conversations

⚠️ **Attention** : Si les tables existent déjà, elles ne seront pas recréées (grâce à `IF NOT EXISTS`).

### `npm run list-tables`
Affiche la liste de toutes les tables dans la base de données.

Utile pour vérifier que l'initialisation a fonctionné.

### `npm run check-data`
Affiche un résumé des données dans chaque table :
- Nombre d'utilisateurs
- Nombre de marchands
- Nombre de produits
- Nombre de bots
- Nombre de conversations

Utile pour déboguer ou vérifier l'état de la base.

### `npm run clean-db`
Supprime **toutes les données** de toutes les tables.

⚠️ **ATTENTION** : Cette action est irréversible !
- Demande une confirmation avant d'exécuter
- Garde les tables (structure intacte)
- Supprime uniquement les données

## 🎯 Workflow typique

### Premier démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Vérifier la connexion MySQL
npm run test-connection

# 3. Créer les tables
npm run init-db

# 4. Vérifier que les tables sont créées
npm run list-tables

# 5. Démarrer le serveur
npm start
```

### Développement quotidien

```bash
# Démarrer en mode dev
npm run dev

# Dans un autre terminal, vérifier les données si besoin
npm run check-data
```

### Réinitialisation complète

```bash
# 1. Nettoyer toutes les données
npm run clean-db

# 2. Redémarrer le serveur
npm start

# 3. Créer de nouveaux comptes via l'interface web
```

## 🐛 Dépannage

### Erreur de connexion

```bash
# Vérifier la connexion
npm run test-connection

# Si échec, vérifier :
# - MySQL est démarré (XAMPP Control Panel)
# - Fichier .env est correct
# - Base de données existe
```

### Tables manquantes

```bash
# Lister les tables
npm run list-tables

# Si vide, initialiser
npm run init-db
```

### Données corrompues

```bash
# Nettoyer et recommencer
npm run clean-db
npm start
```

## 📦 Scripts package.json

Voici tous les scripts définis dans `package.json` :

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node init-db.js",
    "clean-db": "node clean-db-only.js",
    "list-tables": "node list-tables.js",
    "test-connection": "node test-mysql-connection.js",
    "check-data": "node check-data.js"
  }
}
```

## 💡 Astuces

### Changer le port

Modifier dans `.env` :
```env
PORT=3001
```

Puis redémarrer :
```bash
npm start
```

### Logs détaillés

Le serveur affiche des logs dans la console :
- 📨 Requêtes reçues
- ✅ Opérations réussies
- ❌ Erreurs

Garder un œil sur la console pendant le développement.

### Arrêter le serveur

- **Windows** : `Ctrl + C`
- **Mac/Linux** : `Cmd + C` ou `Ctrl + C`

### Exécuter plusieurs commandes

```bash
# Nettoyer et redémarrer
npm run clean-db && npm start

# Initialiser et vérifier
npm run init-db && npm run list-tables
```

## 🔗 Commandes MySQL directes

Si vous préférez utiliser MySQL en ligne de commande :

```bash
# Se connecter à MySQL (XAMPP)
cd C:\xampp\mysql\bin
mysql -u root -p robi_marketplace

# Lister les tables
SHOW TABLES;

# Voir la structure d'une table
DESCRIBE users;

# Compter les enregistrements
SELECT COUNT(*) FROM users;

# Voir tous les utilisateurs
SELECT * FROM users;

# Supprimer toutes les données
DELETE FROM conversations;
DELETE FROM bots;
DELETE FROM products;
DELETE FROM merchants;
DELETE FROM users;

# Quitter MySQL
EXIT;
```

## 📚 Aide supplémentaire

- **Guide XAMPP** : Voir `GUIDE_XAMPP.md`
- **Installation complète** : Voir `INSTALLATION_MYSQL.md`
- **Détails techniques** : Voir `MIGRATION_MYSQL.md`
- **README principal** : Voir `README.md`
