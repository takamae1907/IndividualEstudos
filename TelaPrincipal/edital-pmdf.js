document.addEventListener('DOMContentLoaded', () => {
    // Seus dados do edital e cronograma permanecem os mesmos
    const edital = { /* ... seu objeto edital ... */ };
    const cronograma = [ /* ... seu array cronograma ... */ ];

    const cronogramaContainer = document.getElementById('cronograma-container');
    const progressPanel = document.getElementById('progress-panel');
    let progress = {};
    let currentUser = null;
    let progressDocRef;

    // A função principal agora é o observador de autenticação
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            // Define a referência do documento no Firestore para este usuário e edital
            progressDocRef = db.collection('studyProgress').doc(`${currentUser.uid}_PMDF`);
            loadProgressFromFirestore();
        }
        // O auth.js já cuida do redirecionamento se não houver usuário
    });

    function loadProgressFromFirestore() {
        progressDocRef.get().then(doc => {
            if (doc.exists) {
                progress = doc.data().progress || {};
            }
            // Só renderiza a página DEPOIS de carregar o progresso
            initializeAppUI();
        }).catch(error => {
            console.error("Erro ao carregar progresso: ", error);
            initializeAppUI(); // Renderiza mesmo se falhar
        });
    }

    function saveProgressToFirestore() {
        if (!currentUser) return;
        // Salva o objeto de progresso inteiro
        progressDocRef.set({ progress }).catch(error => {
            console.error("Erro ao salvar progresso: ", error);
        });
    }

    function initializeAppUI() {
        // Coloque aqui todas as suas funções de renderização
        renderCronograma();
        updateCharts();
        renderTodayStudies();
    }

    // O resto das suas funções (renderCronograma, updateCharts, renderTodayStudies)
    // permanecem as mesmas. A única mudança é no event listener:

    cronogramaContainer.addEventListener('click', (e) => {
        const checkbox = e.target.closest('input[type="checkbox"]');
        if (checkbox) {
            const id = checkbox.id;
            const topicItem = checkbox.closest('.topic-item');

            if (checkbox.checked) {
                progress[id] = true;
                topicItem.classList.add('completed');
            } else {
                delete progress[id];
                topicItem.classList.remove('completed');
            }
            saveProgressToFirestore(); // <-- AQUI! Salva no Firestore
            // Re-renderiza para atualizar os percentuais
            renderCronograma();
            updateCharts();
        }
    });

    // ... (suas outras funções de renderização)
});