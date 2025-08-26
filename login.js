document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Se o usuário já estiver logado, redireciona para a tela principal
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.href = 'TelaPrincipal/TelaPrincipal.html';
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Tenta fazer login com o Firebase
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Sucesso! O observador onAuthStateChanged vai redirecionar.
            })
            .catch((error) => {
                alert('Falha no login: ' + error.message);
            });
    });
});