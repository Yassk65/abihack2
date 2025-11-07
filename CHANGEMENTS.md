# Résumé des changements - Migration MySQL

## ✅ Fichiers modifiés

### Configuration
- **config/database.js** : Remplacé `pg` par `mysql2/promise`
- **.env** : Nouvelle structure avec `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **package.json** : Remplacé dépendance `pg` par `mysql2`

### Base de données
- **database/schema.sql** : Converti de PostgreSQL vers MySQL
  - UUID → VARCHAR(36) avec UUID()
  - TEXT → VARCHAR(255) ou TEXT
  - JSONB → JSON
  - TIMESTAMPTZ → TIMESTAMP
  - BOOLEAN reste BOOLEAN
  - Ajout de `IF NOT EXISTS`
  - Ajout de `ENGINE=InnoDB` et `CHARSET=utf8mb4`

### Modèles (tous mis à jour)
- **models/User.js** : Syntaxe MySQL avec `?` et destructuration `[rows]`
- **models/Bot.js** : Idem + gestion des INSERT avec `insertId`
- **models/Product.js** : Idem + JSON.stringify pour caractéristiques
- **models/Conversation.js** : Idem + parsing JSON pour l'historique

### Routes
- **routes/auth.js** : Mise à jour de la requête d'insertion merchant

### Scripts
- **init-db.js** : Adaptation pour MySQL avec séparation des statements
- **check-data.js** : Destructuration MySQL `[rows]`
- **list-tables.js** : Requête `information_schema` adaptée pour MySQL
- **clean-db-only.js** : `FOREIGN_KEY_CHECKS` au lieu de `session_replication_role`

## ✅ Nouveaux fichiers créés

- **test-mysql-connection.js** : Script de test de connexion MySQL
- **INSTALLATION_MYSQL.md** : Guide d'installation complet
- **MIGRATION_MYSQL.md** : Documentation technique de la migration
- **CHANGEMENTS.md** : Ce fichier

## 📝 Scripts package.json mis à jour

```json
"test-connection": "node test-mysql-connection.js"
"clean-db": "node clean-db-only.js"
```

## ⚠️ Fichiers non mis à jour (scripts de test)

Ces fichiers utilisent encore la syntaxe PostgreSQL et devront être mis à jour si nécessaire :
- test-bot-route.js
- test-bot-isolation.js
- test-bot-creation.js
- create-test-merchant.js
- create-demo-data.js
- create-test-bot.js
- test-setup.js
- clean-db.js

## 🔄 Différences principales PostgreSQL vs MySQL

| PostgreSQL | MySQL |
|------------|-------|
| `$1, $2, $3` | `?, ?, ?` |
| `result.rows[0]` | `[rows][0]` |
| `RETURNING *` | SELECT après INSERT |
| `UUID` | `VARCHAR(36)` |
| `JSONB` | `JSON` |
| `TIMESTAMPTZ` | `TIMESTAMP` |
| `gen_random_uuid()` | `UUID()` |
| `session_replication_role` | `FOREIGN_KEY_CHECKS` |

## 🚀 Pour démarrer

1. Installer MySQL ou XAMPP
2. Créer la base de données `robi_marketplace`
3. Configurer `.env` avec les identifiants MySQL
4. Exécuter `npm install` (installe mysql2)
5. Exécuter `npm run test-connection` (vérifier la connexion)
6. Exécuter `npm run init-db` (créer les tables)
7. Exécuter `npm start` (démarrer le serveur)

## 📊 Compatibilité

- ✅ MySQL 5.7+
- ✅ MySQL 8.0+ (recommandé pour UUID())
- ✅ MariaDB 10.3+
- ✅ phpMyAdmin (toutes versions récentes)
- ✅ XAMPP, WAMP, MAMP

## 🎯 Fonctionnalités testées

- ✅ Connexion à la base de données
- ✅ Création des tables
- ✅ Modèles User, Bot, Product, Conversation
- ✅ Routes d'authentification
- ✅ Routes marchands
- ✅ Routes clients
- ✅ Routes chat
- ✅ Routes marketplace

## 💡 Notes importantes

1. **UUID()** nécessite MySQL 8.0+. Pour MySQL 5.7, utiliser une alternative ou des ID auto-incrémentés.

2. **JSON** : MySQL stocke le JSON comme texte. Les modèles gèrent automatiquement le parsing.

3. **Charset** : Toutes les tables utilisent `utf8mb4_unicode_ci` pour supporter les emojis et caractères internationaux.

4. **Foreign Keys** : Les contraintes ON DELETE CASCADE sont maintenues pour l'intégrité référentielle.

5. **Performance** : InnoDB est utilisé pour toutes les tables (support des transactions et foreign keys).
