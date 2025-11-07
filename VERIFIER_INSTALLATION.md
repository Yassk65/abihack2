# ✅ Vérifier l'installation

## Checklist complète - 2 minutes

### Étape 1 : MySQL (30 secondes)

```bash
npm run test-connection
```

**Attendu :**
```
✅ Connexion réussie!
✅ Base de données active: robi_marketplace
✅ Tables trouvées:
   1. users
   2. merchants
   3. products
   4. bots
   5. conversations
```

❌ **Si échec :** Voir [GUIDE_XAMPP.md](GUIDE_XAMPP.md)

---

### Étape 2 : Serveur (30 secondes)

**Terminal 1 :**
```bash
npm start
```

**Attendu :**
```
🚀 Server running on http://localhost:3000
📊 Database: MySQL
🎨 Frontend: HTMX + CSS
```

❌ **Si échec :** Voir [DEPANNAGE.md](DEPANNAGE.md#3-le-serveur-ne-démarre-pas)

---

### Étape 3 : Tests automatiques (30 secondes)

**Terminal 2 (nouveau terminal) :**
```bash
npm run test-server
```

**Attendu :**
```
✅ Page d'accueil: OK (200)
✅ Page de connexion: OK (200)
✅ Page d'inscription: OK (200)
✅ Fichier CSS: OK (200)
✅ Fichier HTMX: OK (200)

📊 Résultats: 5 réussis, 0 échoués
🎉 Tous les tests sont passés !
```

❌ **Si échec :** Voir [DEPANNAGE.md](DEPANNAGE.md)

---

### Étape 4 : Navigateur (30 secondes)

1. **Ouvrir :** http://localhost:3000

2. **Vérifier visuellement :**
   - [ ] Page colorée (gradients violets/roses)
   - [ ] Emojis visibles (🤖, 💬, 🛍️)
   - [ ] Boutons avec effets au survol
   - [ ] Texte lisible et bien formaté

3. **Ouvrir la console (F12) :**
   - [ ] Aucune erreur rouge
   - [ ] Pas de 404 pour style.css

4. **Tester un lien du footer :**
   - Cliquer sur "Documentation"
   - [ ] Affiche "Page en construction" (pas 404)

❌ **Si problème :** Voir [DEPANNAGE.md](DEPANNAGE.md#1-le-css-ne-saffiche-pas)

---

## Tests fonctionnels (optionnel - 5 minutes)

### Test 1 : Inscription marchand

1. Cliquer sur **"Commencer"** ou **"S'inscrire"**
2. Remplir :
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Rôle : **Marchand**
3. Soumettre

**Attendu :**
- ✅ Redirection vers `/merchant/dashboard`
- ✅ Message de bienvenue
- ✅ Sections "Mes Produits" et "Mon Assistant IA"

### Test 2 : Ajouter un produit

1. Dans "Mes Produits", remplir :
   - Nom : `T-shirt`
   - Description : `T-shirt en coton`
   - Prix : `25`
   - Caractéristiques : `{"couleur": "rouge"}`
2. Cliquer **"Ajouter"**

**Attendu :**
- ✅ Produit apparaît dans la liste
- ✅ Bouton "Supprimer" visible

### Test 3 : Créer un bot

1. Dans "Mon Assistant IA", remplir :
   - Nom : `Assistant Mode`
   - Personnalité : `Tu es un expert en mode`
   - Cocher "Publier immédiatement"
2. Cliquer **"Créer mon assistant IA"**

**Attendu :**
- ✅ Message de succès
- ✅ Bot créé et publié
- ✅ Formulaire de mise à jour visible

### Test 4 : Compte client

1. Se déconnecter
2. S'inscrire avec :
   - Email : `client@example.com`
   - Mot de passe : `test123`
   - Rôle : **Client**

**Attendu :**
- ✅ Redirection vers `/client/dashboard`
- ✅ Lien vers "Marketplace"

### Test 5 : Marketplace

1. Cliquer sur **"Explorer le Marketplace"**

**Attendu :**
- ✅ Bot "Assistant Mode" visible
- ✅ Nom de la boutique affiché
- ✅ Bouton "Discuter" présent

### Test 6 : Chat

1. Cliquer sur **"Discuter avec Assistant Mode"**
2. Envoyer : `Bonjour`

**Attendu :**
- ✅ Message envoyé visible
- ✅ Réponse du bot reçue
- ✅ Conversation fluide

---

## Résultats

### ✅ Installation réussie si :

- [x] MySQL connecté
- [x] Serveur démarré
- [x] Tests automatiques passés
- [x] Page d'accueil stylée
- [x] Pas d'erreurs 404
- [x] Console propre

### ⚠️ Problèmes à résoudre si :

- [ ] Erreur de connexion MySQL → [GUIDE_XAMPP.md](GUIDE_XAMPP.md)
- [ ] Serveur ne démarre pas → [DEPANNAGE.md](DEPANNAGE.md#3-le-serveur-ne-démarre-pas)
- [ ] CSS manquant → [DEPANNAGE.md](DEPANNAGE.md#1-le-css-ne-saffiche-pas)
- [ ] Erreurs 404 → [DEPANNAGE.md](DEPANNAGE.md#2-erreur-404-sur-les-pages)

---

## Commandes de vérification rapide

```bash
# Tout en une fois
npm run test-connection && npm run test-server

# Vérifier les données
npm run check-data

# Lister les tables
npm run list-tables
```

---

## Prochaines étapes

Une fois tout vérifié :

1. ✅ Lire [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)
2. ✅ Créer votre premier compte marchand
3. ✅ Ajouter vos produits
4. ✅ Configurer votre bot
5. ✅ Tester avec un compte client

---

## Aide

**Tout fonctionne ?** 🎉
→ Commencez à utiliser Robi Marketplace !

**Problèmes ?** 🔧
→ Consultez [DEPANNAGE.md](DEPANNAGE.md)

**Questions ?** 💬
→ Vérifiez [README.md](README.md) et les autres guides

---

**Temps total : ~2 minutes pour la vérification de base**
**Temps total avec tests fonctionnels : ~7 minutes**
