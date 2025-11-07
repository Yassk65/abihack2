const http = require('http');

const tests = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/auth/login', name: 'Page de connexion' },
    { path: '/auth/register', name: 'Page d\'inscription' },
    { path: '/style.css', name: 'Fichier CSS' },
    { path: '/htmx.min.js', name: 'Fichier HTMX' }
];

async function testEndpoint(path, name) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ ${name}: OK (${res.statusCode})`);
                resolve(true);
            } else {
                console.log(`❌ ${name}: ERREUR (${res.statusCode})`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.log(`❌ ${name}: ERREUR (${error.message})`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log(`⏱️  ${name}: TIMEOUT`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Test du serveur Robi Marketplace\n');
    console.log('⚠️  Assurez-vous que le serveur est démarré (npm start)\n');

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await testEndpoint(test.path, test.name);
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués`);
    
    if (failed === 0) {
        console.log('\n🎉 Tous les tests sont passés !');
        console.log('✅ Le serveur fonctionne correctement');
        console.log('🌐 Ouvrez http://localhost:3000 dans votre navigateur');
    } else {
        console.log('\n⚠️  Certains tests ont échoué');
        console.log('💡 Vérifiez que le serveur est bien démarré avec: npm start');
    }
}

runTests();
