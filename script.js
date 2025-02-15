document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('signatureCanvas');
  const clearBtn = document.getElementById('clearSignature');
  const form = document.getElementById('signingForm');
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.strokeStyle = '#00247D';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let hasSignature = false;

  function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
    hasSignature = true;
  }

  function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
    hasSignature = true;
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
  
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', () => isDrawing = false);

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!hasSignature) {
      alert('Por favor, forneça sua assinatura antes de enviar.');
      return;
    }

    // Get selected category radio button
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (!selectedCategory) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    const formData = {
      nick: document.getElementById('nick').value,
      id: document.getElementById('id').value,
      discord: document.getElementById('discord').value || 'Não informado',
      category: selectedCategory.value,
      date: document.getElementById('date').value,
      signature: canvas.toDataURL()
    };

    // Get terms content safely
    const termsElements = document.querySelectorAll('.terms-content p');
    const termsAndRules = termsElements[0]?.textContent || '';
    const athleteAndRights = termsElements[3]?.textContent || '';

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Acordo - Seleção England</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500;700&display=swap');
            
            body {
              font-family: 'Roboto', sans-serif;
              line-height: 1.6;
              color: #2c3e50;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 4px solid #CE1124;
              padding-bottom: 20px;
              position: relative;
            }
            
            .header::after {
              content: '';
              position: absolute;
              bottom: -4px;
              right: 0;
              width: 50%;
              height: 4px;
              background: #00247D;
            }
            
            h1 {
              font-family: 'Playfair Display', serif;
              font-size: 2.5rem;
              color: #00247D;
              margin: 0;
              letter-spacing: -0.02em;
            }
            
            .info-section {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            
            .info-item {
              margin: 15px 0;
              padding-left: 20px;
              border-left: 4px solid #CE1124;
            }
            
            .info-label {
              font-weight: 600;
              color: #00247D;
              margin-right: 10px;
            }
            
            .terms-section {
              margin: 40px 0;
              padding: 30px;
              background: #f8f9fa;
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            
            h2 {
              font-family: 'Playfair Display', serif;
              color: #00247D;
              font-size: 1.8rem;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #eee;
            }
            
            .signature-section {
              margin-top: 40px;
              padding: 20px;
              border: 2px solid #eee;
              border-radius: 12px;
              text-align: center;
            }
            
            .signature-image {
              max-width: 300px;
              margin: 20px auto;
              border-bottom: 2px solid #00247D;
              padding-bottom: 10px;
            }
            
            @media print {
              body { padding: 20px; }
              .info-section, .terms-section {
                background: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Seleção England - Acordo Oficial</h1>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Nick:</span>
              <span>${formData.nick}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span>${formData.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Discord:</span>
              <span>${formData.discord}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Categoria:</span>
              <span>${formData.category}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data:</span>
              <span>${formData.date}</span>
            </div>
          </div>
          
          <div class="terms-section">
            <h2>TERMOS E REGRAS</h2>
            <p>${termsAndRules}</p>
            
            <h2>ATLETA E DIREITOS</h2>
            <p>${athleteAndRights}</p>
          </div>
          
          <div class="signature-section">
            <h2>Assinatura do Jogador</h2>
            <img src="${formData.signature}" class="signature-image" alt="Assinatura">
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };

      alert('Acordo gerado com sucesso! Uma nova janela será aberta para impressão/salvamento do documento.');
    } else {
      alert('Não foi possível abrir a janela de impressão. Por favor, verifique se o bloqueador de pop-ups está desativado.');
    }
  });

  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.value = today;
  }
});