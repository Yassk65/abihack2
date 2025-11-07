# 🤖 Robi Marketplace

Une marketplace e-commerce où les marchands configurent des bots IA qui chatent avec les clients pour vendre leurs produits.

## ⚡ Démarrage rapide (5 minutes)

**Nouveau sur le projet ?** Suivez le guide : **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)**

## 🚀 Fonctionnalités

### Pour les Marchands
- ✅ Inscription/Connexion
- ✅ Dashboard de gestion
- ✅ Ajout/suppression de produits
- ✅ Configuration d'un bot IA personnalisé
- ✅ Publication/dépublication du bot

### Pour les Clients
- ✅ Inscription/Connexion
- ✅ Marketplace des bots disponibles
- ✅ Chat en temps réel avec les bots IA
- ✅ Historique des conversations

## 🛠️ Stack Technique

- **Frontend**: HTMX + CSS
- **Backend**: Node.js + Express.js
- **Base de données**: MySQL (compatible phpMyAdmin)
- **IA**: OpenRouter API
- **Session**: Express-session

## 📋 Prérequis

1. **Node.js** (v14 ou plus récent)
2. **MySQL** (v5.7 ou plus récent) ou **XAMPP** (inclut MySQL + phpMyAdmin)
3. **Compte OpenRouter** pour l'API IA

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd robi-marketplace
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de MySQL

#### Option A : Avec XAMPP (Recommandé pour Windows)
1. Télécharger et installer [XAMPP](https://www.apachefriends.org/)
2. Démarrer MySQL depuis le panneau de contrôle XAMPP
3. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
4. Créer une nouvelle base de données : `robi_marketplace`

#### Option B : MySQL standalone
```sql
CREATE DATABASE robi_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configuration des variables d'environnement

Modifier le fichier `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=robi_marketplace
SESSION_SECRET=votre-clé-secrète-très-sécurisée
OPENROUTER_API_KEY=votre-clé-openrouter
PORT=3000
```

**Note :** Si vous utilisez XAMPP, laissez `DB_PASSWORD` vide.

### 5. Tester la connexion MySQL
```bash
npm run test-connection
```

### 6. Initialiser la base de données
```bash
npm run init-db
```

### 7. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📚 Documentation complète

- **[Guide d'installation MySQL](INSTALLATION_MYSQL.md)** - Installation détaillée pas à pas
- **[Guide de migration](MIGRATION_MYSQL.md)** - Détails techniques de la migration PostgreSQL → MySQL

## 🌐 Utilisation

1. **Accéder à l'application** : http://localhost:3000

2. **S'inscrire comme marchand** :
   - Créer un compte avec le rôle "Marchand"
   - Ajouter des produits dans le dashboard
   - Configurer votre bot IA avec une personnalité
   - Publier le bot

3. **S'inscrire comme client** :
   - Créer un compte avec le rôle "Client"
   - Parcourir les bots disponibles
   - Chatter avec les assistants IA

## 🤖 Configuration du Bot IA

### Exemple d'instructions de personnalité :
```
Tu es un assistant commercial sympathique et professionnel pour une boutique de vêtements. 
Tu es passionné par la mode et tu aides les clients à trouver les vêtements parfaits selon leurs goûts et leur budget. 
Pose des questions sur leurs préférences (style, couleur, occasion) pour mieux les conseiller.
Reste toujours poli et enthousiaste !
```

### Le bot aura automatiquement accès à :
- Tous les produits du marchand
- Les prix et descriptions
- Les caractéristiques (couleur, taille, etc.)

## 📁 Structure du Projet

```
robi-marketplace/
├── config/
│   └── database.js          # Configuration MySQL
├── database/
│   └── schema.sql           # Schéma de la base de données
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Product.js           # Modèle produit
│   ├── Bot.js               # Modèle bot
│   └── Conversation.js      # Modèle conversation
├── routes/
│   ├── auth.js              # Authentification
│   ├── merchant.js          # Dashboard marchand
│   ├── marketplace.js       # Liste des bots
│   └── chat.js              # Interface de chat
├── services/
│   └── openrouter.js        # Service IA
├── views/                   # Templates HTML
├── public/                  # Fichiers statiques
├── server.js                # Point d'entrée
└── init-db.js              # Script d'initialisation DB
```

## 🔑 API OpenRouter

1. Créer un compte sur [OpenRouter](https://openrouter.ai/)
2. Obtenir une clé API
3. L'ajouter dans le fichier `.env`

Le projet utilise le modèle `openai/gpt-3.5-turbo` par défaut.

## 🚀 Déploiement

### Variables d'environnement de production :
```env
NODE_ENV=production
DB_HOST=votre-host-mysql
DB_USER=votre-utilisateur
DB_PASSWORD=votre-mot-de-passe
DB_NAME=robi_marketplace
SESSION_SECRET=clé-très-sécurisée-en-production
OPENROUTER_API_KEY=votre-clé-api
PORT=3000
```

### Commandes de déploiement :
```bash
npm install --production
npm run init-db
npm start
```

## 🐛 Dépannage

**Problèmes courants ?** Consultez le guide complet : **[DEPANNAGE.md](DEPANNAGE.md)**

### Problèmes fréquents

**CSS ne s'affiche pas ?**
- Vider le cache : `Ctrl + F5`
- Vérifier : http://localhost:3000/style.css
- Voir [DEPANNAGE.md](DEPANNAGE.md#1-le-css-ne-saffiche-pas)

**Erreur 404 ?**
- Certaines pages sont en construction
- Voir [DEPANNAGE.md](DEPANNAGE.md#2-erreur-404-sur-les-pages)

**Erreur de connexion MySQL ?**
- Vérifier que MySQL est démarré (XAMPP)
- Tester avec : `npm run test-connection`
- Voir [DEPANNAGE.md](DEPANNAGE.md#4-erreur-de-connexion-à-la-base-de-données)

**Serveur ne démarre pas ?**
- Port occupé ? Changer dans `.env`
- Voir [DEPANNAGE.md](DEPANNAGE.md#3-le-serveur-ne-démarre-pas)

## 📝 TODO / Améliorations Futures

- [ ] Système de paiement intégré
- [ ] Notifications en temps réel
- [ ] Analytics pour les marchands
- [ ] Support multi-langues
- [ ] API REST complète
- [ ] Tests automatisés
- [ ] Docker containerization

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changes (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.