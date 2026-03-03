import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ESCOLAS_MAP = {
    escola_antonio_adriano_guerra: 'Escola Antônio Adriano Guerra',
    escola_aparecida: 'Escola Aparecida',
    escola_carlos_barbosa: 'Escola Carlos Barbosa',
    escola_dom_vital: 'Escola Dom Vital',
    escola_elisa_tramontina: 'Escola Elisa Tramontina',
    escola_jose_chies: 'Escola Prefeito José Chies',
    escola_papepi: 'Escola Padre Pedro Piccoli',
    escola_sao_roque: 'Escola São Roque',
    escola_santa_rosa: 'Escola Santa Rosa',
    escola_cardeal_arcoverde: 'Escola Cardeal Arcoverde',
    escola_bordini: 'Escola Salvador Bordini'
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const inscricaoId = params.get('id');

        if (!inscricaoId) {
            alert('Link inválido (sem ID). Verifique o link recebido.');
            return;
        }

        const docRef = doc(db, 'inscricoes', inscricaoId);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            alert('Inscrição não encontrada. Verifique o link.');
            return;
        }

        const dados = snap.data();
        preencherDocumento(dados);

    } catch (err) {
        console.error('Erro ao carregar documento final:', err);
        alert('Erro ao carregar o documento final.');
    }
});

function preencherDocumento(dados) {
    // FOTO
    const fotoEl = document.getElementById('fotoAlunoDocumento');
    if (fotoEl && dados.aluno?.foto) fotoEl.src = dados.aluno.foto;

    // ALUNO
    setText('alunoNome', dados.aluno?.nome);
    setText('alunoNascimento', formatarData(dados.aluno?.dataNascimento));

    const docTipo = (dados.aluno?.documento?.tipo || '').toUpperCase();
    const docNum = (dados.aluno?.documento?.numero || '');
    setText('alunoDocumento', docTipo && docNum ? `${docTipo} - ${docNum}` : `${docTipo}${docNum}`);

    setText('alunoEndereco', dados.aluno?.endereco?.rua);
    setText('alunoNumero', dados.aluno?.endereco?.numero);
    setText('alunoComplemento', dados.aluno?.endereco?.complemento);
    setText('alunoBairro', dados.aluno?.endereco?.bairro);

    const escolaId = (dados.aluno?.escola || '').trim();
    setText('alunoEscola', ESCOLAS_MAP[escolaId] || escolaId);

    // SAÚDE
    const possui = (dados.aluno?.saude?.possui || '').toLowerCase();
    const detalhes = (dados.aluno?.saude?.detalhes || '').trim();

    setText('alunoSaudePossui', possui === 'sim' ? 'Sim' : (possui === 'nao' ? 'Não' : ''));

    const linhaDetalhes = document.getElementById('linhaSaudeDetalhes');
    if (linhaDetalhes) {
        if (possui === 'sim' && detalhes) {
            linhaDetalhes.style.display = 'block';
            setText('alunoSaudeDetalhes', detalhes);
        } else {
            linhaDetalhes.style.display = 'none';
            setText('alunoSaudeDetalhes', '');
        }
    }

    // RESPONSÁVEIS
    setText('paiNome', dados.responsaveis?.pai?.nome);
    setText('paiTelefone', dados.responsaveis?.pai?.telefone);

    setText('maeNome', dados.responsaveis?.mae?.nome);
    setText('maeTelefone', dados.responsaveis?.mae?.telefone);

    setText('emergenciaNome', dados.responsaveis?.emergencia?.nome);
    setText('emergenciaTelefone', dados.responsaveis?.emergencia?.telefone);

    // NÚCLEO
    setText('nucleo', dados.nucleo);
    setText('turno', dados.turno);

    // AUTORIZAÇÕES
    const usoImagem = !!dados.autorizacoes?.usoImagem;
    const cienteRegras = !!dados.autorizacoes?.cienteRegras;

    const usoImagemEl = document.getElementById('usoImagem');
    if (usoImagemEl) {
        usoImagemEl.innerText = usoImagem
            ? '✔ Responsável autoriza o uso de imagem'
            : '✖ Responsável NÃO autoriza o uso de imagem';
    }

    const cienteRegrasEl = document.getElementById('cienteRegras');
    if (cienteRegrasEl) {
        cienteRegrasEl.innerText = cienteRegras
            ? '✔ Responsável declara estar ciente das regras'
            : '✖ Responsável NÃO declarou ciência das regras';
    }

    // ASSINATURAS
    const assResp = document.getElementById('assinaturaResponsavel');
    if (assResp && dados.assinaturaResponsavel?.imagem) {
        assResp.src = dados.assinaturaResponsavel.imagem;
    }

    const assEsc = document.getElementById('assinaturaEscola');
    if (assEsc && dados.confirmacaoEscola?.assinaturaEscola) {
        assEsc.src = dados.confirmacaoEscola.assinaturaEscola;
    }

    // CONTROLE
    setText('status', traduzirStatus(dados.status));
    setText('criadoEm', formatarDataHora(dados.criadoEm));

    const confirmado = dados.confirmacaoEscola?.confirmadoEm;
    setText('confirmadoEm', confirmado ? formatarDataHora(confirmado) : 'Ainda não confirmado pela escola');
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerText = value ?? '';
}

function toDateAny(value) {
    if (!value) return null;

    // Firestore Timestamp (v10) normalmente tem toDate()
    if (typeof value === 'object' && typeof value.toDate === 'function') {
        return value.toDate();
    }

    if (value instanceof Date) return value;

    // number (ms)
    if (typeof value === 'number') return new Date(value);

    // string (ISO)
    if (typeof value === 'string') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

function formatarData(value) {
    const d = toDateAny(value);
    return d ? d.toLocaleDateString('pt-BR') : '';
}

function formatarDataHora(value) {
    const d = toDateAny(value);
    return d ? d.toLocaleString('pt-BR') : '';
}

function traduzirStatus(status) {
    const mapa = {
        aguardando_escola: 'Aguardando confirmação da escola',
        confirmado_escola: 'Confirmado pela escola'
    };
    return mapa[status] || status || '';
}