const axios = require('axios');
const Product = require('../models/Product');

class OpenRouterService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseURL = 'https://openrouter.ai/api/v1';
    }

    buildCharacteristicsIndex(products) {
        const index = {};
        products.forEach(product => {
            if (product.characteristics) {
                try {
                    const chars = typeof product.characteristics === 'string' 
                        ? JSON.parse(product.characteristics) 
                        : product.characteristics;
                    
                    Object.entries(chars).forEach(([key, value]) => {
                        if (!index[key]) index[key] = new Set();
                        index[key].add(`${product.name}: ${value}`);
                    });
                } catch (e) {
                    console.warn('Erreur parsing caractéristiques pour', product.name);
                }
            }
        });

        return Object.entries(index)
            .map(([key, values]) => `**${key}**: ${Array.from(values).join(', ')}`)
            .join('\n');
    }

    buildSystemPrompt(bot, products) {
        const productsFormatted = products.map(p => ({
            name: p.name,
            description: p.description,
            price: `${p.price} FCFA`,
            characteristics: p.characteristics
        }));

        // Créer un index des caractéristiques pour faciliter la recherche
        const characteristicsIndex = this.buildCharacteristicsIndex(products);

        return `### RÔLE ET PERSONNALITÉ ###
${bot.personality_prompt}

Tu es un conseiller commercial expert et intelligent, capable d'analyser finement les besoins clients et de faire des recommandations précises basées sur des critères techniques et fonctionnels.

### RÈGLES OBLIGATOIRES ###
1. Détecte la langue du client et réponds dans la même langue
2. Tu ne peux parler QUE des produits listés ci-dessous
3. Si on te demande autre chose, ramène poliment vers les produits
4. Sois honnête : si tu ne sais pas, dis-le
5. N'invente jamais d'informations sur les produits

### TES PRODUITS ###
Voici tous les produits que tu peux vendre :

${JSON.stringify(productsFormatted, null, 2)}

### INDEX DES CARACTÉRISTIQUES ###
${characteristicsIndex}

### INTELLIGENCE COMMERCIALE ###
Tu dois analyser chaque demande client selon ces dimensions :

**ANALYSE DES BESOINS :**
- Usage prévu (professionnel, personnel, occasionnel, intensif)
- Budget mentionné ou implicite
- Contraintes techniques spécifiques
- Préférences esthétiques ou fonctionnelles
- Niveau d'expertise du client

**STRATÉGIE DE RECOMMANDATION :**
1. **Écoute active** : Pose des questions ciblées pour cerner les vrais besoins
2. **Matching intelligent** : Compare les caractéristiques demandées avec celles disponibles
3. **Priorisation** : Classe les critères par importance (obligatoires vs souhaités)
4. **Alternatives** : Propose des options si le produit idéal n'existe pas
5. **Justification** : Explique pourquoi tu recommandes tel produit

**TECHNIQUES DE VENTE CONSULTATIVE :**
- Identifie les pain points du client
- Traduis les caractéristiques en bénéfices concrets
- Utilise des comparaisons pour clarifier les différences
- Anticipe les objections potentielles
- Propose des bundles ou compléments logiques

### INSTRUCTIONS AVANCÉES ###
- Analyse les mots-clés techniques dans les demandes
- Fais des liens entre différentes caractéristiques
- Propose maximum 2-3 produits MAIS explique pourquoi chacun
- Utilise un scoring mental (adéquation/10) pour tes recommandations
- Pose des questions de qualification avant de recommander
- Adapte ton niveau de détail technique au profil client`;
    }

    async generateResponse(bot, conversationHistory, userMessage) {
        try {
            console.log('🤖 Génération de réponse pour bot:', bot.name);
            console.log('📝 Message utilisateur:', userMessage);
            
            const products = await Product.findByMerchant(bot.merchant_id);
            console.log('📦 Produits trouvés:', products.length);
            
            const systemPrompt = this.buildSystemPrompt(bot, products);
            console.log('🎯 System prompt généré (longueur):', systemPrompt.length);

            const messages = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: userMessage }
            ];

            console.log('💬 Nombre de messages envoyés à l\'API:', messages.length);
            console.log('🔑 API Key présente:', !!this.apiKey);

            const response = await axios.post(`${this.baseURL}/chat/completions`, {
                model: 'openai/gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Robi Marketplace'
                }
            });

            console.log('✅ Réponse API reçue');
            const botResponse = response.data.choices[0].message.content;
            console.log('🤖 Réponse bot:', botResponse.substring(0, 100) + '...');
            
            return botResponse;
        } catch (error) {
            console.error('❌ OpenRouter API Error:');
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
            console.error('Message:', error.message);
            
            if (error.response?.status === 401) {
                return "❌ Erreur d'authentification API. Vérifiez la clé OpenRouter.";
            } else if (error.response?.status === 429) {
                return "⏳ Trop de requêtes. Attendez un moment avant de réessayer.";
            } else if (error.response?.status === 402) {
                return "💳 Crédit insuffisant sur le compte OpenRouter.";
            }
            
            return "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?";
        }
    }
}

module.exports = new OpenRouterService();