window.addEventListener('load', () => {
    const botao = document.getElementById('gerarPdf');
    if (!botao) return;

    botao.addEventListener('click', async () => {
        botao.style.display = 'none';

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        // ✅ Se tua “página A4” é #pagina-a4, eu recomendo capturar ela (pega cabeçalho junto).
        // Se quiser continuar só com #documento, deixa como está.
        const elemento = document.getElementById('pagina-a4') || document.getElementById('documento');
        if (!elemento) {
            botao.style.display = 'block';
            alert('Elemento do documento não encontrado.');
            return;
        }

        const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: elemento.scrollWidth,
            windowHeight: elemento.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');

        const pageWidth = doc.internal.pageSize.getWidth();   // 210
        const pageHeight = doc.internal.pageSize.getHeight(); // 297

        const margin = 10;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const printableHeight = pageHeight - margin * 2;

        // ✅ Primeira página
        let heightLeft = imgHeight;
        let positionY = margin;

        doc.addImage(imgData, 'PNG', margin, positionY, imgWidth, imgHeight);
        heightLeft -= printableHeight;

        // ✅ Páginas seguintes (offset Y negativo)
        while (heightLeft > 0) {
            doc.addPage();
            positionY = margin - (imgHeight - heightLeft);
            doc.addImage(imgData, 'PNG', margin, positionY, imgWidth, imgHeight);
            heightLeft -= printableHeight;
        }

        doc.save('ficha-inscricao-projeto-sacada-certa.pdf');
        botao.style.display = 'block';
    });
});