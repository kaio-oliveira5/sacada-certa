document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('assinaturaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let desenhando = false;

    function ajustarCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
    }

    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    // ✅ POSIÇÃO CORRETA (SEM OFFSET)
    function posicao(e) {
        const rect = canvas.getBoundingClientRect();

        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // ===== MOUSE =====
    canvas.addEventListener('mousedown', (e) => {
        desenhando = true;
        const p = posicao(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!desenhando) return;
        const p = posicao(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => desenhando = false);
    canvas.addEventListener('mouseleave', () => desenhando = false);

    // ===== TOQUE =====
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        desenhando = true;
        const p = posicao(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const p = posicao(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });

    canvas.addEventListener('touchend', () => desenhando = false);

    // ===== LIMPAR =====
    const btnLimpar = document.getElementById('limparAssinatura');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ajustarCanvas(); // reaplica escala e estilo
        });
    }
});