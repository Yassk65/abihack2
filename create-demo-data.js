const pool = require('./config/database');
const bcrypt = require('bcrypt');

async function createDemoData() {
    console.log('🎭 Création de données de démonstration complètes...');
    
    try {
        // Nettoyer d'abord les données existantes
        console.log('🧹 Nettoyage des données existantes...');
        await pool.query('SET session_replication_role = replica;');
        await pool.query('DELETE FROM conversations');
        await pool.query('DELETE FROM bots');
        await pool.query('DELETE FROM products');
        await pool.query('DELETE FROM merchants');
        await pool.query('DELETE FROM users');
        await pool.query('SET session_replication_role = DEFAULT;');
        console.log('✅ Données nettoyées');

        // Créer le mot de passe hashé
        const passwordHash = await bcrypt.hash('password123', 10);

        // ===== MARCHAND COSMÉTIQUE =====
        console.log('\n💄 Création du marchand cosmétique...');
        
        const cosmeticUserResult = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['cosmetique@beaute-abidjan.com', passwordHash, 'marchand']);
        
        const cosmeticUserId = cosmeticUserResult.rows[0].id;
        
        await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `, [cosmeticUserId, 'Beauté Abidjan', 'Votre boutique de référence pour tous vos produits de beauté et cosmétiques à Abidjan.']);

        // Produits cosmétiques avec descriptions détaillées
        const cosmeticProducts = [
            ['Crème Hydratante Éclat', 'Crème hydratante enrichie en vitamine E et acide hyaluronique. Hydrate intensément pendant 24h, réduit les signes de fatigue et donne un éclat naturel. Convient à tous types de peaux.', 15000],
            ['Sérum Anti-Âge Premium', 'Sérum concentré en rétinol et peptides. Réduit visiblement les rides et ridules, raffermit la peau et améliore l\'élasticité. Résultats visibles dès 2 semaines.', 35000],
            ['Nettoyant Doux Purifiant', 'Gel nettoyant sans savon, enrichi en extraits de thé vert. Élimine impuretés et maquillage sans dessécher. Idéal pour peaux mixtes à grasses.', 8500],
            ['Fond de Teint Longue Tenue', 'Fond de teint fluide couvrance modulable. Tient 12h sans retouches, fini naturel mat. 8 teintes adaptées aux peaux africaines.', 22000],
            ['Palette Ombres à Paupières Sunset', 'Palette de 12 ombres à paupières aux tons chauds. Textures variées : mates, satinées, pailletées. Pigmentation intense.', 18000],
            ['Rouge à Lèvres Mat Velours', 'Rouge à lèvres mat longue tenue. Formule enrichie en huiles nourrissantes, ne dessèche pas les lèvres. 6 teintes tendance.', 12000],
            ['Lait Corporel Nourrissant Karité', 'Lait corporel enrichi en beurre de karité pur. Nourrit intensément les peaux sèches, parfum fleur d\'oranger. 400ml.', 13500],
            ['Gommage Corps Sucre Coco', 'Gommage exfoliant au sucre et huile de coco. Élimine les cellules mortes, parfum tropical. Usage 2 fois par semaine.', 16000],
            ['Shampoing Réparateur Argan', 'Shampoing sans sulfates à l\'huile d\'argan. Répare les cheveux abîmés, convient aux cheveux colorés et défrisés. 500ml.', 11000],
            ['Masque Capillaire Intense Coco', 'Masque nourrissant intense à l\'huile de coco et beurre de karité. Pour cheveux très secs. Pose 15-20 min. 250ml.', 19000]
        ];

        console.log('📦 Ajout des produits cosmétiques...');
        for (const [name, description, price] of cosmeticProducts) {
            await pool.query(`
                INSERT INTO products (merchant_id, name, description, price, created_at) 
                VALUES ($1, $2, $3, $4, NOW())
            `, [cosmeticUserId, name, description, price]);
        }
        console.log(`✅ ${cosmeticProducts.length} produits cosmétiques ajoutés`);

        // Créer le bot cosmétique
        await pool.query(`
            INSERT INTO bots (merchant_id, name, personality_prompt, is_published) 
            VALUES ($1, $2, $3, $4)
        `, [
            cosmeticUserId, 
            'Bella - Conseillère Beauté',
            `Je suis Bella, votre conseillère beauté chez Beauté Abidjan ! 💄✨

Je connais parfaitement tous nos produits cosmétiques et je peux vous aider à choisir selon votre type de peau, vos besoins et votre budget en CFA.

OFFRES SPÉCIALES :
🌟 Routine Visage Complète (Nettoyant + Crème + Sérum) : 52,250 CFA au lieu de 61,500 CFA (-15%)
💅 Kit Maquillage Parfait (Fond de teint + Palette + Rouge à lèvres) : 46,800 CFA au lieu de 52,000 CFA (-10%)  
🧴 Soin Corps Complet (Lait + Gommage) : 23,600 CFA au lieu de 29,500 CFA (-20%)
💇 Soin Cheveux Réparateur (Shampoing + Masque) : 25,500 CFA au lieu de 30,000 CFA (-15%)

Dites-moi vos besoins beauté et je vous conseillerai !`,
            true
        ]);

        // ===== MARCHAND TECH =====
        console.log('\n💻 Création du marchand tech...');
        
        const techUserResult = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['tech@digital-abidjan.com', passwordHash, 'marchand']);
        
        const techUserId = techUserResult.rows[0].id;
        
        await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `, [techUserId, 'Digital Abidjan', 'Spécialiste en composants informatiques et high-tech à Abidjan.']);

        // Produits tech avec spécifications détaillées
        const techProducts = [
            ['Processeur Intel Core i7-13700K', 'Processeur 13ème génération, 16 cœurs, 24 threads. Fréquence boost 5.4GHz. Socket LGA1700. Parfait pour gaming et création.', 285000],
            ['Processeur AMD Ryzen 7 7700X', 'Processeur Zen 4, 8 cœurs, 16 threads. Fréquence boost 5.4GHz. Socket AM5. Architecture 5nm, performances gaming exceptionnelles.', 265000],
            ['Carte Graphique RTX 4070 SUPER', 'NVIDIA RTX 4070 SUPER 12GB GDDR6X. Ray Tracing, DLSS 3. Boost 2475MHz. Parfaite pour 1440p gaming et création 3D.', 485000],
            ['Carte Graphique RX 7800 XT', 'AMD RX 7800 XT 16GB GDDR6. Architecture RDNA 3, FSR 3. Excellent rapport performance/prix pour 1440p gaming.', 425000],
            ['RAM DDR5 32GB (2x16GB) 5600MHz', 'Kit mémoire DDR5 32GB, fréquence 5600MHz. Dissipateurs RGB. Compatible Intel 12gen+ et AMD Ryzen 7000.', 145000],
            ['RAM DDR4 16GB (2x8GB) 3200MHz', 'Kit mémoire DDR4 16GB, fréquence 3200MHz. Profil XMP 2.0. Excellent rapport qualité/prix pour builds gaming.', 65000],
            ['SSD NVMe 1TB PCIe 4.0', 'SSD NVMe M.2 1TB, PCIe 4.0. Vitesse 7000MB/s lecture, 6500MB/s écriture. Parfait pour OS et jeux exigeants.', 85000],
            ['SSD SATA 500GB', 'SSD SATA III 500GB. Vitesse 560MB/s lecture. Fiabilité éprouvée, idéal pour upgrade ou stockage secondaire.', 42000],
            ['Carte Mère B650 AM5 ATX', 'Carte mère AMD B650, socket AM5. Support DDR5, PCIe 5.0, WiFi 6E. 4 slots RAM, RGB intégré, overclocking.', 125000],
            ['Carte Mère Z790 LGA1700 ATX', 'Carte mère Intel Z790, socket LGA1700. Support DDR5/DDR4, PCIe 5.0, WiFi 6E. Overclocking avancé, RGB.', 165000],
            ['Alimentation 750W 80+ Gold', 'Alimentation modulaire 750W, certification 80+ Gold. Efficacité 90%, ventilateur silencieux. Garantie 7 ans.', 95000]
        ];

        console.log('📦 Ajout des produits tech...');
        for (const [name, description, price] of techProducts) {
            await pool.query(`
                INSERT INTO products (merchant_id, name, description, price, created_at) 
                VALUES ($1, $2, $3, $4, NOW())
            `, [techUserId, name, description, price]);
        }
        console.log(`✅ ${techProducts.length} produits tech ajoutés`);

        // Créer le bot tech
        await pool.query(`
            INSERT INTO bots (merchant_id, name, personality_prompt, is_published) 
            VALUES ($1, $2, $3, $4)
        `, [
            techUserId, 
            'Alex - Expert Tech',
            `Salut ! Je suis Alex, expert tech chez Digital Abidjan ! 💻⚡

Je connais parfaitement tous nos composants et je peux monter votre PC sur mesure selon votre budget et usage !

PACKS GAMING RECOMMANDÉS :

🎮 PACK GAMING ENTRY (1080p) - 15% de réduction :
Ryzen 7 7700X + B650 AM5 + RAM DDR5 32GB + RX 7800 XT + SSD 1TB + Alim 750W
Prix normal : 1,110,000 CFA → PACK : 943,500 CFA

🚀 PACK GAMING PRO (1440p) - 12% de réduction :
Intel i7-13700K + Z790 LGA1700 + RAM DDR5 32GB + RTX 4070 SUPER + SSD 1TB + Alim 750W  
Prix normal : 1,200,000 CFA → PACK : 1,056,000 CFA

💾 PACK UPGRADE STOCKAGE - 20% de réduction :
SSD NVMe 1TB + SSD SATA 500GB
Prix normal : 127,000 CFA → PACK : 101,600 CFA

🧠 PACK MÉMOIRE PERFORMANCE - 10% de réduction :
RAM DDR5 32GB + RAM DDR4 16GB (pour dual setup)
Prix normal : 210,000 CFA → PACK : 189,000 CFA

Dites-moi votre usage et budget, je vous monte la config parfaite !`,
            true
        ]);

        // Créer un utilisateur client de test
        console.log('\n👤 Création d\'un client de test...');
        await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW())
        `, ['client@test-demo.com', passwordHash, 'client']);

        console.log('\n🎉 DONNÉES DE DÉMONSTRATION CRÉÉES !');
        console.log('\n📋 Comptes créés :');
        console.log('💄 Marchand Cosmétique : cosmetique@beaute-abidjan.com (password123)');
        console.log('💻 Marchand Tech : tech@digital-abidjan.com (password123)');
        console.log('👤 Client : client@test-demo.com (password123)');
        
        console.log('\n🤖 Bots intelligents créés :');
        console.log('💄 Bella - Conseillère Beauté (10 produits + 4 offres combinées)');
        console.log('💻 Alex - Expert Tech (11 composants + 4 packs gaming)');
        
        console.log('\n🧪 Prêt pour tester l\'intelligence des bots !');

    } catch (error) {
        console.error('❌ Erreur:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Fonction pour confirmer l'action
function confirmAction() {
    return new Promise((resolve) => {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('🎭 Créer les données de démonstration ? (oui/non): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o');
        });
    });
}

// Exécuter le script
async function main() {
    console.log('🎭 Script de création de données de démonstration');
    console.log('===============================================');
    
    const confirmed = await confirmAction();
    
    if (confirmed) {
        await createDemoData();
    } else {
        console.log('❌ Opération annulée');
        process.exit(0);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { createDemoData };