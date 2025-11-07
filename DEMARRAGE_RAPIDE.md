# 🚀 Démarrage Rapide - 5 minutes

## Étape 1 : Installer XAMPP (2 min)

1. Télécharger XAMPP : https://www.apachefriends.org/
2. Installer (garder les options par défaut)
3. Ouvrir **XAMPP Control Panel**
4. Cliquer sur **Start** à côté de **MySQL** ✅

## Étape 2 : Créer la base de données (1 min)

1. Ouvrir dans le navigateur : http://localhost/phpmyadmin
2. Cliquer sur **"Nouvelle base de données"**
3. Nom : `robi_marketplace`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer sur **"Créer"** ✅

## Étape 3 : Configurer le projet (1 min)

1. Ouvrir le fichier `.env` à la racine du projet

2. Vérifier/modifier ces lignes :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=robi_marketplace
SESSION_SECRET=mon_secret_123
OPENROUTER_API_KEY=votre_cle_api
PORT=3000
```

**Important** : Laisser `DB_PASSWORD=` vide (pas de mot de passe avec XAMPP)

## Étape 4 : Installer et initialiser (1 min)

Ouvrir un terminal dans le dossier du projet et exécuter :

```bash
# Installer les dépendances
npm install

# Tester la connexion
npm run test-connection

# Créer les tables
npm run init-db
```

Vous devriez voir :
```
✅ Connexion réussie!
✅ Base de données MySQL initialisée avec succès !
```

## Étape 5 : Démarrer ! (10 secondes)

```bash
npm start
```

Ouvrir dans le navigateur : **http://localhost:3000**

## 🎉 C'est prêt !

### Créer un compte marchand

1. Aller sur http://localhost:3000
2. Cliquer sur **"S'inscrire"**
3. Choisir le rôle **"Marchand"**
4. Remplir le formulaire
5. Vous êtes redirigé vers le dashboard marchand

### Ajouter des produits

1. Dans le dashboard, section **"Mes Produits"**
2. Remplir le formulaire :
   - Nom : "T-shirt Rouge"
   - Description : "T-shirt en coton, taille M"
   - Prix : 25
   - Caractéristiques : `{"couleur": "rouge", "taille": "M"}`
3. Cliquer sur **"Ajouter"**

### Créer votre bot IA

1. Section **"Mon Assistant IA"**
2. Remplir :
   - Nom : "Assistant Mode"
   - Personnalité : "Tu es un expert en mode, enthousiaste et serviable. Tu aides les clients à choisir les meilleurs vêtements."
3. Cocher **"Publier immédiatement"**
4. Cliquer sur **"Créer mon assistant IA"**

### Tester avec un compte client

1. Se déconnecter
2. Créer un nouveau compte avec le rôle **"Client"**
3. Aller sur le **Marketplace**
4. Cliquer sur **"Discuter"** avec votre bot
5. Poser des questions sur vos produits !

## ❓ Problèmes ?

### MySQL ne démarre pas dans XAMPP
- Vérifier qu'aucun autre MySQL n'est en cours d'exécution
- Redémarrer XAMPP en tant qu'administrateur

### Erreur "Cannot find module 'mysql2'"
```bash
npm install
```

### Erreur "Unknown database"
- Vérifier que la base `robi_marketplace` existe dans phpMyAdmin
- Ou la créer avec :
```sql
CREATE DATABASE robi_marketplace;
```

### Port 3000 déjà utilisé
Modifier dans `.env` :
```env
PORT=3001
```

## 📚 Documentation complète

- **Guide XAMPP détaillé** : `GUIDE_XAMPP.md`
- **Toutes les commandes** : `COMMANDES.md`
- **Installation complète** : `INSTALLATION_MYSQL.md`
- **README principal** : `README.md`

## 🎯 Prochaines étapes

1. ✅ Ajouter plus de produits
2. ✅ Personnaliser votre bot
3. ✅ Tester différentes conversations
4. ✅ Explorer phpMyAdmin pour voir les données
5. ✅ Inviter des amis à tester !

---

**Temps total : ~5 minutes** ⏱️

Bon développement ! 🚀
