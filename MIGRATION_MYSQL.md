# Migration vers MySQL

## Changements effectués

Le projet a été migré de PostgreSQL vers MySQL (compatible phpMyAdmin).

### Modifications principales :

1. **Package.json** : Remplacement de `pg` par `mysql2`
2. **Configuration** : Mise à jour de `config/database.js` pour utiliser mysql2
3. **Variables d'environnement** : Nouveau format dans `.env`
4. **Schéma SQL** : Conversion du schéma PostgreSQL vers MySQL
5. **Modèles** : Adaptation de tous les modèles pour la syntaxe MySQL

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer MySQL dans `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=robi_marketplace
```

3. Créer la base de données dans phpMyAdmin ou via MySQL :
```sql
CREATE DATABASE robi_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Initialiser les tables :
```bash
npm run init-db
```

5. Démarrer le serveur :
```bash
npm start
```

## Différences PostgreSQL vs MySQL

- **UUID** → **VARCHAR(36)** avec UUID()
- **TEXT** → **VARCHAR(255)** ou **TEXT**
- **JSONB** → **JSON**
- **TIMESTAMPTZ** → **TIMESTAMP**
- **BOOLEAN** → **BOOLEAN** (TINYINT(1))
- **$1, $2, $3** → **?, ?, ?** (paramètres)
- **RETURNING *** → Requête SELECT après INSERT
- **result.rows** → **[rows]** (destructuration)

## Notes importantes

- Les scripts de test (test-*.js, create-*.js) utilisent encore l'ancienne syntaxe PostgreSQL
- Ces scripts devront être mis à jour si vous souhaitez les utiliser
- Le serveur principal et les routes fonctionnent avec MySQL
