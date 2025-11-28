(function () {
    const OVERLAY_ID = 'popup-overlay';
    const CLOSE_ID = 'popup-close';
    const CTA_ID = 'popup-cta';
    const SHOW_DELAY_MS = 600;
    const BASIC_WASH_BTN_ID = 'btn-basic-wash'; // ID for the Basic Wash button

    // Ensure the overlay exists in DOM; create it if missing (now that HTML is commented out)
    function ensureOverlay() {
        let el = document.getElementById(OVERLAY_ID);
        if (!el) {
            el = document.createElement('div');
            el.id = OVERLAY_ID;
            el.className = 'popup-overlay';
            el.setAttribute('aria-hidden', 'true');

            const content = document.createElement('div');
            content.className = 'popup-content';
            content.setAttribute('role', 'dialog');
            content.setAttribute('aria-modal', 'true');
            content.setAttribute('aria-labelledby', 'popup-title');

            el.appendChild(content);
            document.body.appendChild(el);

            // Click outside card closes popup
            el.addEventListener('click', (e) => { if (e.target === el) closePopup(); });
        }
        return el;
    }

    const overlay = () => document.getElementById(OVERLAY_ID) || ensureOverlay();

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
                    <div class="d-flex justify-center gap-3" style="flex-wrap: wrap; margin-top: 20px; padding-bottom: 15px;">
              <a href="https://apps.apple.com/us/app/my-wash-membership/id1665769284" 
   id="popup-app-store" target="_blank" 
   onmouseover="this.style.transform='scale(1.1)'; this.style.transition='transform 0.3s ease'; this.style.boxShadow='0 0 20px #00f0ff';" 
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
   <img src="/images/mr-sudz/buttons/Apple_App_Button2x-9460183.webp" alt="Download on App Store" style="height:50px; width: auto;">
</a>

<a href="https://play.google.com/store/apps/details?id=com.dencar.universal.production" 
   id="popup-google-play" target="_blank" 
   onmouseover="this.style.transform='scale(1.1)'; this.style.transition='transform 0.3s ease'; this.style.boxShadow='0 0 20px #00f0ff';" 
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
   <img src="/images/mr-sudz/buttons/Google_App_Button2x-9460183.webp" alt="Get it on Google Play" style="height:50px; width: auto;">
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
                    <a href="https://play.google.com/store/apps/details?id=com.dencar.universal.production" 
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
                    "https://play.google.com/store/apps/details?id=com.dencar.universal.production",
                    "_blank"
                );
            });
        }
    }

    window.addEventListener('load', () => {
        // Disable auto-open on load
        // setTimeout(openPopup, SHOW_DELAY_MS);

        const el = overlay();
        const closeBtn = document.getElementById(CLOSE_ID);
        const ctaBtn = document.getElementById(CTA_ID);

        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        // Click outside card (already added by ensureOverlay on first create)

        // ESC key
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

        // Original CTA button
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                window.open(
                    "https://play.google.com/store/apps/details?id=com.dencar.universal.production",
                    "_blank"
                );
            });
        }

        // Smooth scroll fallback: for browsers without CSS 'scroll-behavior' support.
        document.addEventListener('click', function (e) {
            const anchor = e.target.closest && e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;
            const id = href.substring(1);
            const targetEl = document.getElementById(id) || document.querySelector("[name='" + id + "']");
            if (!targetEl) return;
            // If CSS smooth scroll is supported, default behavior is fine.
            // But we'll prevent default and use JS smooth scroll for consistent fallback.
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update hash without causing immediate jump
            history.replaceState(null, null, '#' + id);
        });

        // Ensure watch videos play; some browsers block autoplay - attempt programmatic play
        const watchVideo = document.getElementById('watch-video-iframe');
        if (watchVideo) {
            const tryPlay = () => {
                if (watchVideo.paused) {
                    const p = watchVideo.play();
                    if (p && typeof p.then === 'function') {
                        p.then(() => {
                            // Autoplay succeeded: ensure overlay is hidden
                            const overlay = document.getElementById('watch-video-overlay');
                            if (overlay) overlay.style.display = 'none';
                        }).catch(() => {
                            // If autoplay blocked: show overlay and attach user interaction
                            const overlay = document.getElementById('watch-video-overlay');
                            if (overlay) overlay.style.display = 'flex';
                            const resumeOnInteraction = () => {
                                watchVideo.play().catch(() => { });
                                if (overlay) overlay.style.display = 'none';
                                document.removeEventListener('click', resumeOnInteraction);
                                document.removeEventListener('touchstart', resumeOnInteraction);
                            };
                            document.addEventListener('click', resumeOnInteraction);
                            document.addEventListener('touchstart', resumeOnInteraction);
                        });
                    }
                }
            };
            // Try after short delay (allow page to settle)
            setTimeout(tryPlay, 100);
            // If overlay play button clicked: start playback
            const overlayBtn = document.getElementById('watch-overlay-play');
            if (overlayBtn) {
                overlayBtn.addEventListener('click', function (e) { e.stopPropagation(); watchVideo.play().catch(() => { }); const overlay = document.getElementById('watch-video-overlay'); if (overlay) overlay.style.display = 'none'; });
            }
        }
        // Try to autoplay the contact video as well
        const contactVideo = document.getElementById('contact-feature-video');
        if (contactVideo) {
            setTimeout(() => {
                contactVideo.play().catch(() => {
                    const resume = () => { contactVideo.play().catch(() => { }); document.removeEventListener('click', resume); document.removeEventListener('touchstart', resume); };
                    document.addEventListener('click', resume);
                    document.addEventListener('touchstart', resume);
                });
            }, 120);
        }

        // Add event listener for Join Wash Club button
        const joinClubBtn = document.getElementById('join-wash-club');
        if (joinClubBtn) {
            joinClubBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // open the link in a new tab (use href so the link stays DRY)
                window.open(joinClubBtn.href, '_blank');
            });
        }
        // Add event listener for Manage Pass button (desktop)
        const managePassBtn = document.getElementById('manage-pass');
        if (managePassBtn) {
            managePassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showJoinClubContent();
                openPopup();
            });
        }

        // Add event listener for Manage Pass button (mobile)
        const managePassBtnMobile = document.getElementById('manage-pass-mobile');
        if (managePassBtnMobile) {
            managePassBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showJoinClubContent();
                openPopup();
            });
        }
        // Add event listener for Basic Wash button - COMMENTED OUT (now redirects directly via href)
        /*
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

        // Alternative: Add robust event delegation for basic wash buttons (works if child clicked)
        document.addEventListener('click', (e) => {
            const target = e.target && e.target.closest ? e.target.closest('#' + BASIC_WASH_BTN_ID) : null;
            if (target) {
                e.preventDefault();
                showJoinClubContent();
                openPopup();
            }
        });
        */
    });

})();