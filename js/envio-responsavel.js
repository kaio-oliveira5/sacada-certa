import { db } from './firebase.js';
import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formInscricao');
    const canvasAss = document.getElementById('assinaturaCanvas');
    const inputFoto = document.getElementById('fotoAluno');
    const botaoEnviar = form?.querySelector('button[type="submit"]');

    if (!form || !canvasAss || !botaoEnviar) {
        console.error('Formulário, canvas ou botão não encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🔴 Valida assinatura
        if (canvasVazio(canvasAss)) {
            alert('A assinatura do responsável é obrigatória.');
            return;
        }

        // 🩺 SAÚDE – Sim / Não
        const saudeRadio = document.querySelector('input[name="saudePossui"]:checked');
        const saudePossui = saudeRadio?.value || '';

        if (!saudePossui) {
            alert('Informe se o aluno possui algum problema de saúde.');
            return;
        }

        const saudeDetalhesEl = document.getElementById('saudeDetalhes');
        const saudeDetalhes = (saudeDetalhesEl?.value || '').trim();

        if (saudePossui === 'sim' && saudeDetalhes.length === 0) {
            alert('Descreva o problema de saúde do aluno.');
            saudeDetalhesEl?.focus();
            return;
        }

        // trava botão
        botaoEnviar.disabled = true;
        botaoEnviar.innerText = 'Enviando...';

        try {
            // 📸 Foto (com compressão)
            let fotoBase64 = '';

            if (inputFoto && inputFoto.files && inputFoto.files.length > 0) {
                const file = inputFoto.files[0];

                // ✅ bloqueia HEIC/HEIF (principal causa no iPhone)
                const fileName = (file.name || '').toLowerCase();
                const fileType = (file.type || '').toLowerCase();
                const isHeic =
                    fileType.includes('heic') || fileType.includes('heif') ||
                    fileName.endsWith('.heic') || fileName.endsWith('.heif');

                if (isHeic) {
                    throw new Error(
                        'Formato HEIC/HEIF detectado.\n' +
                        'No iPhone, altere: Ajustes > Câmera > Formatos > Mais compatível (JPEG)\n' +
                        'ou escolha uma foto da galeria que seja JPG/PNG.'
                    );
                }

                // ✅ comprime de forma mais estável no mobile
                fotoBase64 = await compressImageFileToDataURL(file, {
                    maxSide: 1280,        // bom equilíbrio
                    quality: 0.78,        // qualidade inicial
                    maxBytes: 700_000     // limite seguro pro Firestore (base64 aumenta)
                });
            }

            await salvarInscricao({
                fotoBase64,
                saudePossui,
                saudeDetalhes
            });

            window.location.href = 'responsavel-sucesso.html';

        } catch (err) {
            // Mostra o erro real (ajuda MUITO no celular)
            const msg = (err?.message ? String(err.message) : String(err));
            alert('Erro ao enviar a inscrição.\n\n' + msg);

            botaoEnviar.disabled = false;
            botaoEnviar.innerText = 'Enviar para a Escola';
        }
    });

    async function salvarInscricao({ fotoBase64 = '', saudePossui = '', saudeDetalhes = '' }) {
        // 📦 Dados da inscrição
        const dadosInscricao = {
            aluno: {
                nome: document.getElementById('nomeAluno').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                documento: {
                    tipo: document.getElementById('tipoDocumentoAluno').value,
                    numero: document.getElementById('documentoAluno').value
                },
                endereco: {
                    rua: document.getElementById('endereco').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value
                },
                escola: document.getElementById('escolaAluno').value,
                foto: fotoBase64,
                saude: {
                    possui: saudePossui,
                    detalhes: saudePossui === 'sim' ? saudeDetalhes : ''
                }
            },

            responsaveis: {
                pai: {
                    nome: document.getElementById('nomePai').value,
                    telefone: document.getElementById('telefonePai').value
                },
                mae: {
                    nome: document.getElementById('nomeMae').value,
                    telefone: document.getElementById('telefoneMae').value
                },
                emergencia: {
                    nome: document.getElementById('contatoEmergencia').value,
                    telefone: document.getElementById('telefoneEmergencia').value
                }
            },

            nucleo: document.getElementById('nucleo').value,
            turno: document.getElementById('turnoTreino').value,

            autorizacoes: {
                usoImagem: document.getElementById('usoImagem').checked,
                cienteRegras: document.getElementById('cienteRegras').checked
            },

            assinaturaResponsavel: {
                nome: document.getElementById('nomeResponsavel').value,
                data: document.getElementById('dataAssinatura').value,
                imagem: canvasAssinaturaToPng(canvasAss) // mais seguro
            },

            status: 'aguardando_escola',
            criadoEm: new Date().toISOString()
        };

        // 🔥 Salva inscrição no Firestore
        const docRef = await addDoc(collection(db, 'inscricoes'), dadosInscricao);

        // 🏫 Busca dados da escola (coleção: "escola")
        const escolaId = dadosInscricao.aluno.escola;
        const escolaRef = doc(db, 'escola', escolaId);
        const escolaSnap = await getDoc(escolaRef);

        if (!escolaSnap.exists()) {
            throw new Error('Escola não encontrada: ' + escolaId);
        }

        const dadosEscola = escolaSnap.data() || {};
        const emailEscola = (dadosEscola.email || '').trim();

        const nomeEscola =
            (dadosEscola.nome && String(dadosEscola.nome).trim()) ||
            'Equipe da escola';

        if (!emailEscola) {
            throw new Error('E-mail da escola não cadastrado: ' + escolaId);
        }

        // 🔗 Link para a escola (produção)
        const SITE_BASE = window.location.origin;
        const linkEscola = `${SITE_BASE}/escola.html?id=${docRef.id}`;

        const assunto = 'Projeto Sacada Certa – Confirmação Escolar';

        const mensagemHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222">
        <h2 style="margin:0 0 12px 0">Projeto Sacada Certa</h2>

        <p style="margin:0 0 10px 0">Olá, <strong>${nomeEscola}</strong>.</p>

        <p style="margin:0 0 10px 0">
            Você está recebendo este e-mail porque um(a) responsável realizou uma nova inscrição no
            Projeto Sacada Certa e informou esta unidade escolar.
        </p>

        <p style="margin:0 0 10px 0">
          <strong>Aluno(a):</strong> ${dadosInscricao.aluno.nome}<br>
          <strong>Responsável:</strong> ${dadosInscricao.assinaturaResponsavel.nome}
        </p>

        <p style="margin:0 0 10px 0">
          Para confirmar que o(a) aluno(a) está matriculado(a) nesta unidade e realizar a assinatura
          da confirmação escolar, acesse o link abaixo:
        </p>

        <p style="margin:0 0 14px 0">
          <a href="${linkEscola}" target="_blank" style="font-weight:bold">
            Acessar formulário de confirmação da escola
          </a>
        </p>

        <hr style="border:none; border-top:1px solid #e6e6e6; margin:16px 0">

        <p style="margin:0; font-size:13px; color:#555">
          Em caso de dúvidas, entre em contato com a <strong>Secretaria de Esportes, Lazer e Juventude</strong>.<br>
          <strong>Contato:</strong> (54) 3433-2952
        </p>

        <p style="margin:10px 0 0 0; font-size:12px; color:#777">
          Município de Carlos Barbosa
        </p>
      </div>
    `;

        // 🚀 Envia e-mail via Apps Script
        const resp = await fetch(
            'https://script.google.com/macros/s/AKfycbyR88H2DtfBiHbTYz6qBzzwrm1F8YSoYXPu81ypcLtBbvu9bvLkpcLdAZtKFbKKrv6eEQ/exec',
            {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                // ajuda em casos de navegação/fechamento rápido
                keepalive: true,
                body: JSON.stringify({
                    emailDestino: emailEscola,
                    assunto,
                    mensagemHtml
                })
            }
        );

        const text = await resp.text();
        let json = null;
        try { json = JSON.parse(text); } catch (_) { }

        if (!resp.ok || (json && json.ok === false)) {
            throw new Error('Falha no envio do e-mail: ' + (json?.erro || text || resp.statusText));
        }

        localStorage.setItem('inscricaoId', docRef.id);
    }

    // ✍️ Verifica se canvas está vazio
    function canvasVazio(canvasEl) {
        const ctx = canvasEl.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        return !Array.from(pixels).some(channel => channel !== 0);
    }

    function canvasAssinaturaToPng(canvasEl) {
        return canvasEl.toDataURL('image/png');
    }
});

/**
 * Converte uma imagem (File) em DataURL JPEG comprimido + redimensionado.
 * Versão mais estável no mobile: usa toBlob() em vez de toDataURL direto.
 */
async function compressImageFileToDataURL(file, { maxSide = 1280, quality = 0.78, maxBytes = 700_000 } = {}) {
    if (!(file instanceof File)) throw new Error('Arquivo inválido');

    const bitmap = await createImageBitmap(file).catch(() => null);
    let imgW, imgH, drawSource;

    if (bitmap) {
        imgW = bitmap.width;
        imgH = bitmap.height;
        drawSource = bitmap;
    } else {
        // fallback FileReader + <img>
        const dataUrl = await fileToDataURL(file);
        const img = await loadImage(dataUrl);
        imgW = img.naturalWidth || img.width;
        imgH = img.naturalHeight || img.height;
        drawSource = img;
    }

    const scale = Math.min(1, maxSide / Math.max(imgW, imgH));
    const targetW = Math.max(1, Math.round(imgW * scale));
    const targetH = Math.max(1, Math.round(imgH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(drawSource, 0, 0, targetW, targetH);

    // tenta com qualidade e vai reduzindo
    let q = quality;

    for (let i = 0; i < 8; i++) {
        const blob = await canvasToJpegBlob(canvas, q);
        if (!blob) throw new Error('Falha ao gerar imagem (blob nulo).');

        // base64 fica maior que blob; então usamos um teto conservador:
        // se o blob já passou do maxBytes, certeza que o base64 vai passar também.
        if (blob.size <= maxBytes) {
            return await blobToDataURL(blob);
        }

        q = Math.max(0.4, q - 0.08);
    }

    throw new Error(
        'Imagem grande demais mesmo após compressão.\n' +
        'Tente aproximar mais, usar boa luz, ou escolher uma imagem menor.'
    );
}

function canvasToJpegBlob(canvas, quality) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    });
}

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Falha ao converter imagem.'));
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Falha ao carregar imagem.'));
        img.src = src;
    });
}