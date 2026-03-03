document.addEventListener('DOMContentLoaded', () => {
    const radioSim = document.getElementById('saudeSim');
    const radioNao = document.getElementById('saudeNao');
    const box = document.getElementById('saudeDetalhesBox');
    const detalhes = document.getElementById('saudeDetalhes');
    const erro = document.getElementById('erroSaudeDetalhes');

    if (!radioSim || !radioNao || !box || !detalhes) return;

    function atualizarUI() {
        const possui = radioSim.checked ? 'sim' : (radioNao.checked ? 'nao' : '');

        if (possui === 'sim') {
            box.style.display = 'block';
            detalhes.required = true;
        } else {
            box.style.display = 'none';
            detalhes.required = false;
            detalhes.value = '';
            if (erro) {
                erro.textContent = '';
                erro.style.display = 'none';
            }
        }
    }

    // valida na hora (opcional, mas ajuda)
    function validarSeSim() {
        if (radioSim.checked && detalhes.value.trim().length === 0) {
            if (erro) {
                erro.textContent = 'Descreva o problema de saúde.';
                erro.style.display = 'block';
            }
            detalhes.focus();
            return false;
        }
        if (erro) {
            erro.textContent = '';
            erro.style.display = 'none';
        }
        return true;
    }

    radioSim.addEventListener('change', atualizarUI);
    radioNao.addEventListener('change', atualizarUI);

    // Se o usuário tentar enviar e marcou SIM sem preencher, bloqueia com mensagem
    const form = document.getElementById('formInscricao');
    form?.addEventListener('submit', (e) => {
        // o required já bloqueia, mas aqui garante a mensagem
        if (!validarSeSim()) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    atualizarUI();
});