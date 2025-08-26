document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let decks = [];
    let activeDeck = null;
    let currentCardIndex = 0;
    let unsubscribe; // Para parar de ouvir as atualizações quando sair da página

    // Referências do DOM (mantenha as suas)
    const deckGrid = document.getElementById('deck-grid');
    // ...

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            listenToDecks();
        }
    });

    // Ouve as atualizações dos baralhos em tempo real
    function listenToDecks() {
        if (unsubscribe) unsubscribe(); // Para o listener anterior se houver

        const decksRef = db.collection('flashcardDecks').where('ownerId', '==', currentUser.uid);
        unsubscribe = decksRef.onSnapshot(snapshot => {
            decks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderDecks();
        }, error => {
            console.error("Erro ao carregar baralhos:", error);
        });
    }

    function renderDecks() {
        // Sua função renderDecks original aqui, sem alterações na lógica
    }

    // Salvar novo baralho no Firestore
    addDeckForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTitle = document.getElementById('new-deck-title').value.trim();
        if (newTitle) {
            db.collection('flashcardDecks').add({
                ownerId: currentUser.uid,
                title: newTitle,
                cards: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                // O listener onSnapshot vai atualizar a tela automaticamente
                closeModal(addDeckModal);
                addDeckForm.reset();
            }).catch(error => console.error("Erro ao adicionar baralho:", error));
        }
    });

    // Adicionar um card ao baralho ativo
    addFlashcardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeDeck) return;
        
        const question = document.getElementById('new-card-question').value.trim();
        const answer = document.getElementById('new-card-answer').value.trim();

        // Usa a função do Firebase para adicionar um elemento a um array
        const deckRef = db.collection('flashcardDecks').doc(activeDeck.id);
        deckRef.update({
            cards: firebase.firestore.FieldValue.arrayUnion({ question, answer })
        }).then(() => {
            closeModal(addFlashcardModal);
            addFlashcardForm.reset();
        }).catch(error => console.error("Erro ao adicionar card:", error));
    });

    // Deletar um baralho
    function deleteDeck(deckId) {
        if (confirm("Tem certeza que deseja apagar este baralho?")) {
            db.collection('flashcardDecks').doc(deckId).delete()
                .catch(error => console.error("Erro ao apagar baralho:", error));
        }
    }

    // Suas outras funções (showFlashcardView, displayCurrentCard, etc.)
    // permanecerão muito parecidas.
});