document.addEventListener("DOMContentLoaded", () => {
    const tipoDocumento = document.getElementById("tipoDocumentoAluno");
    const documentoAluno = document.getElementById("documentoAluno");

    const telefonePai = document.getElementById("telefonePai");
    const telefoneMae = document.getElementById("telefoneMae");
    const telefoneEmergencia = document.getElementById("telefoneEmergencia");

    const numeroCasa = document.getElementById("numero");

    function somenteNumeros(valor) {
        return String(valor || "").replace(/\D/g, "");
    }

    function mascaraCPF(valor) {
        valor = somenteNumeros(valor).slice(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    }

    function mascaraTelefone(valor) {
        valor = somenteNumeros(valor).slice(0, 11);

        if (valor.length <= 10) {
            return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    // ===== DOCUMENTO (CPF / RG)
    if (documentoAluno && tipoDocumento) {
        documentoAluno.addEventListener("input", () => {
            if (tipoDocumento.value === "cpf") {
                documentoAluno.value = mascaraCPF(documentoAluno.value);
            } else {
                documentoAluno.value = somenteNumeros(documentoAluno.value);
            }
        });

        tipoDocumento.addEventListener("change", () => {
            documentoAluno.value = "";
        });
    }

    // ===== TELEFONES
    if (telefonePai) {
        telefonePai.addEventListener("input", () => {
            telefonePai.value = mascaraTelefone(telefonePai.value);
        });
    }

    if (telefoneMae) {
        telefoneMae.addEventListener("input", () => {
            telefoneMae.value = mascaraTelefone(telefoneMae.value);
        });
    }

    if (telefoneEmergencia) {
        telefoneEmergencia.addEventListener("input", () => {
            telefoneEmergencia.value = mascaraTelefone(telefoneEmergencia.value);
        });
    }

    // ===== NÚMERO DA CASA
    if (numeroCasa) {
        numeroCasa.addEventListener("input", () => {
            numeroCasa.value = somenteNumeros(numeroCasa.value);
        });
    }
});