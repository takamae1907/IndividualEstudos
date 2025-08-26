// Função de logout que pode ser chamada de qualquer página
function logout() {
    auth.signOut().then(() => {
        window.location.href = '../index.html';
    }).catch(error => {
        console.error("Erro ao fazer logout:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    body.style.visibility = 'hidden'; // Esconde o conteúdo até a verificação

    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado, busca os dados dele no Firestore
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    const firstName = userData.fullname.split(' ')[0];

                    // Atualiza o nome em todas as sidebars
                    document.querySelectorAll('.sidebar-user h2').forEach(el => {
                        el.textContent = firstName;
                    });

                    // Atualiza a mensagem de boas-vindas (se existir na página)
                    const welcomeEl = document.getElementById('welcome-message');
                    if (welcomeEl) {
                        welcomeEl.innerHTML = `Olá, ${firstName}. <span class="subtitle">Bem-vindo(a)!</span>`;
                    }
                    body.style.visibility = 'visible'; // Mostra o conteúdo
                } else {
                    // Se não encontrar os dados, desloga para segurança
                    logout();
                }
            });
        } else {
            // Usuário não está logado, redireciona para o login
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '../index.html';
        }
    });

    // Adiciona o botão de Sair dinamicamente a todas as sidebars
    const sidebarNav = document.querySelector('.sidebar-nav ul');
    if (sidebarNav && !document.getElementById('logout-btn')) {
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<a href="#" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i><span>Sair</span></a>`;
        sidebarNav.appendChild(logoutLi);

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});