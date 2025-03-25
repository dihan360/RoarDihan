// whatsapp.js - Final Working Version with All Features
document.addEventListener("DOMContentLoaded", function() {
    // Create button if not exists (double-check)
    let whatsappBtn = document.getElementById('whatsapp-icon');
    if (!whatsappBtn) {
        whatsappBtn = document.createElement('div');
        whatsappBtn.id = 'whatsapp-icon';
        whatsappBtn.innerHTML = `
            <img src="whatsapp-logo.png" alt="WhatsApp" draggable="false">
        `;
        document.body.appendChild(whatsappBtn);
    }

    // Force visible with important styles
    whatsappBtn.style.cssText = `
        position: fixed !important;
        width: 60px !important;
        height: 60px !important;
        z-index: 9999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
    `;

    // Drag functionality (your existing code)
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
        
        // Constrain to viewport
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
    
    // Click handler (improved)
    whatsappBtn.addEventListener('click', function(e) {
        if (!isDragging && !e.target.hasAttribute('data-dragging')) {
            window.open("https://wa.me/+8801798354565", "_blank");
        }
    });
    
    // Load saved position (with fallback)
    const savedPos = localStorage.getItem('whatsappPos');
    if (savedPos) {
        const pos = JSON.parse(savedPos);
        whatsappBtn.style.left = pos.x || 'auto';
        whatsappBtn.style.top = pos.y || 'auto';
        whatsappBtn.style.right = pos.x ? 'auto' : '20px';
        whatsappBtn.style.bottom = pos.y ? 'auto' : '20px';
    } else {
        whatsappBtn.style.right = '20px';
        whatsappBtn.style.bottom = '20px';
    }

    // Touch support (your existing code)
    whatsappBtn.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialX = whatsappBtn.offsetLeft;
        initialY = whatsappBtn.offsetTop;
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        whatsappBtn.style.left = (initialX + dx) + 'px';
        whatsappBtn.style.top = (initialY + dy) + 'px';
        whatsappBtn.setAttribute('data-dragging', 'true');
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
        if (isDragging && whatsappBtn.hasAttribute('data-dragging')) {
            localStorage.setItem('whatsappPos', JSON.stringify({
                x: whatsappBtn.style.left,
                y: whatsappBtn.style.top
            }));
        }
        isDragging = false;
        whatsappBtn.removeAttribute('data-dragging');
    });

    // Debug log
    console.log('WhatsApp button initialized');
});
