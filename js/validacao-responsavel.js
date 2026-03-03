
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formInscricao');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        let valido = true;

        // =========================
        // DOCUMENTO (CPF / RG)
        // =========================
        const tipoDocumento = document.getElementById('tipoDocumentoAluno');
        const documentoAluno = document.getElementById('documentoAluno');
        const erroDocumento = document.getElementById('erroCpfAluno');

        if (!tipoDocumento || !documentoAluno || !erroDocumento) {
            console.warn('Campos de documento não encontrados para validação.');
        } else {
            if (tipoDocumento.value === '' || documentoAluno.value.trim() === '') {
                erroDocumento.textContent = 'Informe o tipo e o número do documento';
                erroDocumento.style.display = 'block';
                valido = false;
            } else {
                erroDocumento.textContent = '';
                erroDocumento.style.display = 'none';
            }
        }

        // =========================
        // SAÚDE (Sim/Não obrigatório)
        // Se SIM -> detalhes obrigatório
        // =========================
        const radioSaude = document.querySelector('input[name="saudePossui"]:checked');
        const saudeDetalhes = document.getElementById('saudeDetalhes');
        const erroSaude = document.getElementById('erroSaudeDetalhes');

        if (!radioSaude) {
            // aqui o required do radio já deve bloquear, mas garantimos:
            valido = false;
        }

        if (radioSaude?.value === 'sim') {
            const texto = (saudeDetalhes?.value || '').trim();
            if (texto.length === 0) {
                if (erroSaude) {
                    erroSaude.textContent = 'Descreva o problema de saúde.';
                    erroSaude.style.display = 'block';
                }
                saudeDetalhes?.focus();
                valido = false;
            } else if (erroSaude) {
                erroSaude.textContent = '';
                erroSaude.style.display = 'none';
            }
        } else {
            // se NÃO, limpa erro (caso exista)
            if (erroSaude) {
                erroSaude.textContent = '';
                erroSaude.style.display = 'none';
            }
        }

        // =========================
        // BLOQUEIA O ENVIO se inválido
        // (impede o envio-responsavel.js de rodar)
        // =========================
        if (!valido) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true); // <-- captura: garante que roda antes do handler do envio
});