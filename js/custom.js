(function () {
    const OVERLAY_ID = 'popup-overlay';
    const CLOSE_ID = 'popup-close';
    const CTA_ID = 'popup-cta';
    const SHOW_DELAY_MS = 600;
    const JOIN_CLUB_BTN_CLASS = 'btn-line'; // Class for the Join Wash Club button
    const BASIC_WASH_BTN_ID = 'btn-basic-wash'; // ID for the Basic Wash button

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
                    <img src="images/mr-sudz/logo/yeti.png" alt="Mr Sudz Logo" height="300" />
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
              <a href="https://mywashmembership.app.link/kexLEqgqrLb/?customer_id=eb90708c-b71f-418a-8146-c161836042b2" 
   id="popup-cta" target="_blank" 
   onmouseover="this.style.transform='scale(1.1)'; this.style.transition='transform 0.3s ease'; this.style.boxShadow='0 0 20px #00f0ff';" 
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
   <img src="/images/mr-sudz/buttons/Apple_App_Button2x-9460183.webp" alt="Join Now" style="height:50px;">
</a>

<a href="https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection" 
   id="popup-cta" target="_blank" 
   onmouseover="this.style.transform='scale(1.1)'; this.style.transition='transform 0.3s ease'; this.style.boxShadow='0 0 20px #00f0ff';" 
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
   <img src="/images/mr-sudz/buttons/Google_App_Button2x-9460183.webp" alt="Join Now" style="height:50px;">
</a>

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

    // Function to show Basic Wash content
    function showBasicWashContent() {
        const popupContent = document.querySelector('.popup-content');
        if (!popupContent) return;

        popupContent.innerHTML = `
            <button id="popup-close" class="popup-close" aria-label="Close popup">&times;</button>

            <div class="popup-logo">
                <img src="images/mr-sudz/logo/logo.png" alt="Mr Sudz Logo" height="150" />
            </div>

            <h2 id="popup-title" class="popup-title text-white">Basic Wash Package</h2>

            <div class="popup-body">
                <div class="price-section text-center mb-4">
                    <p class="popup-text"><strong>Wash Club:</strong> <span class="accent fs-24">$25/month</span></p>
                    <p class="popup-text"><strong>Single Wash:</strong> <span class="fs-20">$10</span></p>
                </div>

                <div class="includes-section">
                    <h4 class="text-white mb-3">Package Includes:</h4>
                    <ul class="benefits-list">
                        <li>✓ Premium Wash</li>
                        <li>✓ Fresh Water Rinse</li>
                        <li>✓ Speed Dry</li>
                        <li>✓ Protective Wax Finish</li>
                    </ul>
                </div>

                <div class="text-center mt-4">
                    <a href="https://mywashmembership.com/#/customer/eb90708c-b71f-418a-8146-c161836042b2/passes/pass-selection" 
                       id="popup-cta" 
                       target="_blank" 
                       class="popup-btn">
                       Select Basic Wash
                    </a>
                </div>
            </div>
        `;

        // Re-attach close button event listener
        const newCloseBtn = document.getElementById('popup-close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', closePopup);
        }

        // Re-attach CTA button event listener
        const newCtaBtn = document.getElementById('popup-cta');
        if (newCtaBtn) {
            newCtaBtn.addEventListener('click', (e) => {
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

        // Add event listener for Basic Wash button
        const basicWashBtn = document.getElementById(BASIC_WASH_BTN_ID);
        if (basicWashBtn) {
            basicWashBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                showJoinClubContent(); // Show the Join the Wash Club popup
                openPopup(); // Open the popup
            });
        } else {
            // If button not found immediately, try with a delay
            setTimeout(() => {
                const delayedBasicWashBtn = document.getElementById(BASIC_WASH_BTN_ID);
                if (delayedBasicWashBtn) {
                    delayedBasicWashBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        showJoinClubContent();
                        openPopup();
                    });
                }
            }, 1000);
        }

        // Alternative: Add event delegation for basic wash buttons
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === BASIC_WASH_BTN_ID) {
                e.preventDefault();
                showJoinClubContent();
                openPopup();
            }
        });
    });

})();