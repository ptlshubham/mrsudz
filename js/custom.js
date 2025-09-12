(function () {
    const OVERLAY_ID = 'popup-overlay';
    const CLOSE_ID = 'popup-close';
    const CTA_ID = 'popup-cta';
    const SHOW_DELAY_MS = 600;
    const JOIN_CLUB_BTN_CLASS = 'btn-line'; // Class for the Join Wash Club button

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

    // Function to switch popup content for Join Club
    function showJoinClubContent() {
        const popupContent = document.querySelector('.popup-content');
        if (!popupContent) return;

        popupContent.innerHTML = `
            <button id="popup-close" class="popup-close" aria-label="Close popup">&times;</button>
            
            <div class="popup-body-with-logo">
                <div class="popup-logo-left">
                    <img src="images/misc/af.png" alt="Mr Sudz Logo" height="300" />
                </div>
                
                <div class="popup-content-right">
                    <h2 id="popup-title" class="popup-title text-white">Join the Wash Club!</h2>
                    
                    <p class="popup-text">
                        Get unlimited washes and exclusive member benefits at Mr Sudz!
                    </p>
                    
                    <div class="popup-benefits">
                        <ul class="benefits-list">
                            <li>✓ Up to 15 washes per month</li>
                            <li>✓ No contracts - cancel anytime</li>
                            <li>✓ Free vacuums included</li>
                            <li>✓ Multi-vehicle savings</li>
                        </ul>
                    </div>
                    
                    <p class="popup-text">
                        <strong>Starting at just $25/month</strong>
                    </p>
                    <div class="d-flex justify-center gap-3 ">
                
                    <a href="https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection" 
                       id="popup-cta" class="popup-btn" target="_blank">Join Now!</a>
                       <a href="https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection" 
                       id="popup-cta" class="popup-btn" target="_blank">Join Now!</a>
                       </div>
                </div>
            </div>
        `;

        // Re-attach close button event listener
        const newCloseBtn = document.getElementById('popup-close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', closePopup);
        }

        // Re-attach App Store button event listener
        const appStoreBtn = document.getElementById('popup-app-store');
        if (appStoreBtn) {
            appStoreBtn.addEventListener('click', (e) => {
                closePopup();
                // Link opens in new tab automatically due to target="_blank"
            });
        }

        // Re-attach Google Play button event listener
        const googlePlayBtn = document.getElementById('popup-google-play');
        if (googlePlayBtn) {
            googlePlayBtn.addEventListener('click', (e) => {
                closePopup();
                // Link opens in new tab automatically due to target="_blank"
            });
        }
    }

    // Function to restore original popup content
    function showOriginalContent() {
        const popupContent = document.querySelector('.popup-content');
        if (!popupContent) return;

        popupContent.innerHTML = `
            <button id="popup-close" class="popup-close" aria-label="Close popup">&times;</button>

            <div class="popup-logo">
                <img src="images/mr-sudz/logo/logo.png" alt="Mr Sudz Logo" height="150" />
            </div>

            <h2 id="popup-title" class="popup-title text-white">FREE CAR WASH</h2>

            <p class="popup-text">
                Mr Sudz Car Wash is <strong>NOW OPEN</strong> in Columbus, Ohio!<br />
                Visit us at <strong>5560 W Broad St, Columbus, OH 43228</strong>.
            </p>

            <p class="popup-text">
                <strong>Click below</strong> to grab your
                <span class="accent">FREE Shine Wash</span> today!
            </p>

            <a href="#contact" id="popup-cta" class="popup-btn">Get a FREE WASH!</a>
        `;

        // Re-attach event listeners
        const newCloseBtn = document.getElementById('popup-close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', closePopup);
        }

        const newCtaBtn = document.getElementById('popup-cta');
        if (newCtaBtn) {
            newCtaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                window.open(
                    "https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection",
                    "_blank"
                );
            });
        }
    }

    window.addEventListener('load', () => {
        // Show original popup after delay (existing functionality)
        setTimeout(openPopup, SHOW_DELAY_MS);

        const el = overlay();
        const closeBtn = document.getElementById(CLOSE_ID);
        const ctaBtn = document.getElementById(CTA_ID);

        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        // Click outside card
        if (el) {
            el.addEventListener('click', (e) => { if (e.target === el) closePopup(); });
        }

        // ESC key
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

        // Original CTA button
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                window.open(
                    "https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection",
                    "_blank"
                );
            });
        }

        // Add event listener for Join Wash Club button
        const joinClubBtn = document.querySelector('.' + JOIN_CLUB_BTN_CLASS);
        if (joinClubBtn) {
            joinClubBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                showJoinClubContent(); // Switch to join club content
                openPopup(); // Open the popup
            });
        }
    });
})();