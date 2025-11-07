# 🔧 Guide de dépannage

## Problèmes courants et solutions

### 1. Le CSS ne s'affiche pas

#### Symptômes
- La page s'affiche mais sans styles
- Tout est en noir et blanc
- Pas de couleurs ni de mise en forme

#### Solutions

**A. Vérifier que le serveur est démarré**
```bash
npm start
```

**B. Vérifier que le fichier CSS existe**
```bash
# Windows
dir public\style.css

# Linux/Mac
ls -la public/style.css
```

**C. Tester l'accès au CSS directement**
Ouvrir dans le navigateur : http://localhost:3000/style.css

Si vous voyez le code CSS, le fichier est accessible.

**D. Vider le cache du navigateur**
- Chrome/Edge : `Ctrl + Shift + Delete`
- Firefox : `Ctrl + Shift + Delete`
- Ou faire `Ctrl + F5` pour recharger sans cache

**E. Vérifier la console du navigateur**
1. Ouvrir les outils de développement (`F12`)
2. Onglet "Console"
3. Chercher des erreurs 404 pour `/style.css`

### 2. Erreur 404 sur les pages

#### Symptômes
- Cliquer sur un lien affiche "Cannot GET /page"
- Erreur 404 Not Found

#### Solutions

**A. Pages non implémentées**
Certaines pages du footer ne sont pas encore implémentées :
- `/demo`, `/api`, `/docs`, `/blog`, etc.

Ces pages affichent maintenant un message "Page en construction".

**B. Vérifier les routes disponibles**
Routes fonctionnelles :
- `/` - Page d'accueil
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/merchant/dashboard` - Dashboard marchand (après connexion)
- `/marketplace` - Marketplace (après connexion client)

**C. Redémarrer le serveur**
```bash
# Arrêter avec Ctrl+C
# Puis redémarrer
npm start
```

### 3. Le serveur ne démarre pas

#### Symptômes
- Erreur au lancement de `npm start`
- Port déjà utilisé
- Erreur de module

#### Solutions

**A. Port déjà utilisé**
```
Error: listen EADDRINUSE: address already in use :::3000
```

Solution :
1. Changer le port dans `.env` :
```env
PORT=3001
```

2. Ou arrêter le processus qui utilise le port 3000 :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**B. Module manquant**
```
Error: Cannot find module 'express'
```

Solution :
```bash
npm install
```

**C. Erreur MySQL**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

Solution :
1. Vérifier que MySQL est démarré (XAMPP Control Panel)
2. Vérifier `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=robi_marketplace
```

### 4. Erreur de connexion à la base de données

#### Symptômes
- Erreur lors de l'inscription/connexion
- "Error: connect ECONNREFUSED"
- "Access denied for user"

#### Solutions

**A. MySQL n'est pas démarré**
1. Ouvrir XAMPP Control Panel
2. Cliquer sur "Start" à côté de MySQL
3. Attendre que le statut soit vert

**B. Base de données n'existe pas**
```bash
npm run test-connection
```

Si erreur "Unknown database", créer la base :
1. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
2. Créer la base `robi_marketplace`
3. Ou via MySQL :
```sql
CREATE DATABASE robi_marketplace;
```

**C. Mauvais identifiants**
Vérifier `.env` :
```env
DB_USER=root
DB_PASSWORD=
```

Avec XAMPP, le mot de passe est vide par défaut.

**D. Tables manquantes**
```bash
npm run init-db
```

### 5. Erreur lors de l'inscription

#### Symptômes
- Formulaire d'inscription ne fonctionne pas
- Erreur 500
- Rien ne se passe

#### Solutions

**A. Vérifier la console du serveur**
Regarder les logs dans le terminal où `npm start` est lancé.

**B. Vérifier que les tables existent**
```bash
npm run list-tables
```

Devrait afficher :
- users
- merchants
- products
- bots
- conversations

**C. Réinitialiser la base**
```bash
npm run clean-db
npm run init-db
```

### 6. Le bot ne répond pas

#### Symptômes
- Messages envoyés mais pas de réponse
- Erreur dans le chat
- Timeout

#### Solutions

**A. Vérifier la clé API OpenRouter**
Dans `.env` :
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

**B. Vérifier la connexion internet**
L'API OpenRouter nécessite une connexion internet.

**C. Vérifier les logs du serveur**
Regarder les erreurs dans le terminal.

### 7. Session perdue / Déconnexion automatique

#### Symptômes
- Déconnecté après quelques minutes
- Doit se reconnecter souvent

#### Solutions

**A. Vérifier SESSION_SECRET dans `.env`**
```env
SESSION_SECRET=votre_secret_unique_ici
```

**B. Cookies bloqués**
Vérifier que les cookies sont autorisés dans le navigateur.

### 8. Styles cassés après modification

#### Symptômes
- Après modification du CSS, rien ne change
- Anciens styles toujours visibles

#### Solutions

**A. Vider le cache**
```
Ctrl + F5
```

**B. Mode navigation privée**
Tester dans une fenêtre de navigation privée.

**C. Redémarrer le serveur**
```bash
# Ctrl+C puis
npm start
```

## Tests de diagnostic

### Test complet du système

```bash
# 1. Tester MySQL
npm run test-connection

# 2. Vérifier les tables
npm run list-tables

# 3. Vérifier les données
npm run check-data

# 4. Tester le serveur (dans un autre terminal)
npm run test-server
```

### Vérification manuelle

1. **MySQL fonctionne ?**
   - XAMPP Control Panel → MySQL est vert

2. **Base de données existe ?**
   - phpMyAdmin → `robi_marketplace` visible

3. **Tables créées ?**
   - phpMyAdmin → 5 tables visibles

4. **Serveur démarre ?**
   - `npm start` → "Server running on port 3000"

5. **Page d'accueil accessible ?**
   - http://localhost:3000 → Page s'affiche

6. **CSS chargé ?**
   - http://localhost:3000/style.css → Code CSS visible

7. **Inscription fonctionne ?**
   - Créer un compte → Redirection vers dashboard

## Réinitialisation complète

Si rien ne fonctionne, réinitialisation totale :

```bash
# 1. Arrêter le serveur (Ctrl+C)

# 2. Nettoyer la base de données
npm run clean-db

# 3. Réinstaller les dépendances
rm -rf node_modules
npm install

# 4. Réinitialiser la base
npm run init-db

# 5. Redémarrer
npm start
```

## Obtenir de l'aide

### Informations à fournir

Quand vous demandez de l'aide, fournissez :

1. **Version de Node.js**
```bash
node --version
```

2. **Version de MySQL**
```bash
npm run test-connection
```

3. **Logs du serveur**
Copier les dernières lignes du terminal

4. **Erreurs du navigateur**
Console (F12) → Copier les erreurs

5. **Fichier .env** (sans les mots de passe)
```env
DB_HOST=localhost
DB_USER=root
DB_NAME=robi_marketplace
PORT=3000
```

### Checklist avant de demander de l'aide

- [ ] MySQL est démarré
- [ ] Base de données existe
- [ ] Tables créées (`npm run init-db`)
- [ ] `npm install` exécuté
- [ ] `.env` configuré
- [ ] Serveur démarre sans erreur
- [ ] Cache navigateur vidé
- [ ] Testé en navigation privée

## Logs utiles

### Activer les logs détaillés

Modifier `server.js` pour ajouter :

```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

Cela affichera toutes les requêtes dans le terminal.

## Problèmes connus

### Windows Defender / Antivirus

Parfois Windows Defender bloque Node.js ou MySQL.

Solution : Ajouter une exception pour :
- `C:\xampp\mysql\bin\mysqld.exe`
- `node.exe`

### Pare-feu

Si le serveur ne répond pas :
1. Vérifier le pare-feu Windows
2. Autoriser Node.js sur le port 3000

### Encodage des caractères

Si les accents ne s'affichent pas :
1. Vérifier que les fichiers sont en UTF-8
2. Vérifier la base de données : `utf8mb4_unicode_ci`

## Ressources

- **Documentation MySQL** : https://dev.mysql.com/doc/
- **Documentation Express** : https://expressjs.com/
- **XAMPP Forum** : https://community.apachefriends.org/

---

**Besoin d'aide ?** Vérifiez d'abord cette liste, puis consultez les autres guides :
- `DEMARRAGE_RAPIDE.md`
- `INSTALLATION_MYSQL.md`
- `GUIDE_XAMPP.md`
