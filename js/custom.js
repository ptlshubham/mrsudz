(function () {
    const OVERLAY_ID = 'popup-overlay';
    const CLOSE_ID = 'popup-close';
    const CTA_ID = 'popup-cta';
    const SHOW_DELAY_MS = 600;

    const overlay = () => document.getElementById(OVERLAY_ID);

    function openPopup() {
        const el = overlay();
        if (!el) return;
        el.classList.remove('closing');   // ensure clean state
        el.classList.add('active');
        el.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        const el = overlay();
        if (!el) return;
        // play exit animations, then hide
        el.classList.add('closing');
        el.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'overlay-out') {  // only after overlay finishes
                el.classList.remove('active', 'closing');
                el.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                el.removeEventListener('animationend', handler);
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(openPopup, SHOW_DELAY_MS);

        const el = overlay();
        const closeBtn = document.getElementById(CLOSE_ID);
        const ctaBtn = document.getElementById(CTA_ID);

        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        // click outside card
        if (el) {
            el.addEventListener('click', (e) => { if (e.target === el) closePopup(); });
        }

        // ESC key
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

        // CTA: close + smooth scroll to #contact
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                const target = document.querySelector('#contact');
                if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
            });
        }
    });
})();
