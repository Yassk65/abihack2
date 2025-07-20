# 🤖 Robi Marketplace

Une marketplace e-commerce où les marchands configurent des bots IA qui chatent avec les clients pour vendre leurs produits.

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
- **Base de données**: PostgreSQL
- **IA**: OpenRouter API
- **Session**: Express-session

## 📋 Prérequis

1. **Node.js** (v16 ou plus récent)
2. **PostgreSQL** (v12 ou plus récent)
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

### 3. Configuration de la base de données

Créer une base de données PostgreSQL :
```sql
CREATE DATABASE robi_marketplace;
```

### 4. Configuration des variables d'environnement

Modifier le fichier `.env` :
```env
DATABASE_URL=postgresql://username:password@localhost:5432/robi_marketplace
SESSION_SECRET=votre-clé-secrète-très-sécurisée
OPENROUTER_API_KEY=votre-clé-openrouter
PORT=3000
```

### 5. Initialiser la base de données
```bash
npm run init-db
```

### 6. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

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
│   └── database.js          # Configuration PostgreSQL
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
DATABASE_URL=postgresql://user:pass@host:port/db
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

### Erreur de connexion à la base de données
- Vérifier que PostgreSQL est démarré
- Vérifier les paramètres de connexion dans `.env`
- S'assurer que la base de données existe

### Erreur OpenRouter
- Vérifier la clé API dans `.env`
- Vérifier le solde du compte OpenRouter

### Port déjà utilisé
- Changer le PORT dans `.env`
- Ou arrêter le processus utilisant le port 3000

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