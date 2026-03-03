document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('assinaturaEscola');
    const btnLimpar = document.getElementById('limparAssinatura');

    if (!canvas) {
        console.error('Canvas #assinaturaEscola não encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');
    let desenhando = false;

    function aplicarEstiloPincel() {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
    }

    function ajustarCanvas() {
        const ratio = window.devicePixelRatio || 1;

        // pega o tamanho VISUAL do canvas (CSS)
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        // salva o que já foi desenhado antes de redimensionar (opcional)
        const imagemAntes = canvas.toDataURL();

        // ajusta tamanho REAL do canvas (pixels)
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);

        // faz o contexto desenhar em coordenadas CSS (0..w / 0..h)
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        aplicarEstiloPincel();

        // tenta restaurar o desenho anterior (pra não “sumir” ao resize)
        if (imagemAntes && imagemAntes !== 'data:,') {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, w, h);
            img.src = imagemAntes;
        }
    }

    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    // ===== Helpers de coordenada =====
    function posMouse(e) {
        return { x: e.offsetX, y: e.offsetY };
    }

    function posTouch(e) {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    // ===== Mouse =====
    canvas.addEventListener('mousedown', (e) => {
        desenhando = true;
        const p = posMouse(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!desenhando) return;
        const p = posMouse(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => (desenhando = false));
    canvas.addEventListener('mouseleave', () => (desenhando = false));

    // ===== Touch =====
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        desenhando = true;
        const p = posTouch(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const p = posTouch(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }, { passive: false });

    canvas.addEventListener('touchend', () => (desenhando = false));

    // ===== Limpar =====
    if (!btnLimpar) {
        console.warn('Botão #limparAssinatura não encontrado');
    } else {
        btnLimpar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // limpa o canvas inteiro em pixels reais
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            // reaplica transform/estilo certinho
            ajustarCanvas();
        });
    }
});