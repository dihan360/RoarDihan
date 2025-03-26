// whatsapp.js - Final Working Version (Mobile + Desktop)
document.addEventListener("DOMContentLoaded", function() {
    // 1. Create button with absolute visibility guarantee
    let whatsappBtn = document.getElementById('whatsapp-icon');
    if (!whatsappBtn) {
        whatsappBtn = document.createElement('div');
        whatsappBtn.id = 'whatsapp-icon';
        whatsappBtn.innerHTML = `
            <img src="whatsapp-logo.png" alt="WhatsApp" 
                 style="width:70%;height:auto;pointer-events:none;">
        `;
        document.body.appendChild(whatsappBtn);
    }

    // 2. Set base styles that work everywhere
    whatsappBtn.style.cssText = `
        position: fixed !important;
        width: 62px !important;
        height: 62px !important;
        right: 20px !important;
        bottom: 20px !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #25D366 !important;
        border-radius: 50% !important;
        box-shadow: 0 4px 20px rgba(37,211,102,0.4) !important;
        border: 2px solid white !important;
        cursor: pointer !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;

    // 3. Enhanced mobile appearance
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        whatsappBtn.style.width = '64px !important';
        whatsappBtn.style.height = '64px !important';
        whatsappBtn.style.bottom = '25px !important';
        const img = whatsappBtn.querySelector('img');
        if (img) img.style.width = '75% !important';
    }

    // 4. Click handler (simplified and reliable)
    whatsappBtn.addEventListener('click', function() {
        window.open("https://wa.me/+8801798354565", "_blank");
    });

    // 5. Desktop-only drag functionality (your original code)
    if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        whatsappBtn.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = whatsappBtn.offsetLeft;
            initialY = whatsappBtn.offsetTop;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            newX = Math.max(10, Math.min(window.innerWidth - whatsappBtn.offsetWidth - 10, newX));
            newY = Math.max(10, Math.min(window.innerHeight - whatsappBtn.offsetHeight - 10, newY));
            
            whatsappBtn.style.left = newX + 'px';
            whatsappBtn.style.top = newY + 'px';
            whatsappBtn.style.right = 'auto';
            whatsappBtn.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                localStorage.setItem('whatsappPos', JSON.stringify({
                    x: whatsappBtn.style.left,
                    y: whatsappBtn.style.top
                }));
            }
            isDragging = false;
        });

        // Load saved position
        const savedPos = localStorage.getItem('whatsappPos');
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            whatsappBtn.style.left = pos.x || 'auto';
            whatsappBtn.style.top = pos.y || 'auto';
            whatsappBtn.style.right = pos.x ? 'auto' : '20px';
            whatsappBtn.style.bottom = pos.y ? 'auto' : '20px';
        }
    }

    console.log('WhatsApp button loaded successfully!');
});