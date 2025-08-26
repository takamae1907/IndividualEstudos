// Cole aqui a configuração do seu projeto Firebase quando for criá-lo.
// Por enquanto, deixe como está para o código funcionar.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase e exporta os serviços que vamos usar
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase já inicializado.");
}

const auth = firebase.auth();
const db = firebase.firestore();