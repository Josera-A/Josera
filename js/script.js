// ============================================
// SHARED UI BEHAVIOUR (loaded on every page)
// - Mobile menu (☰) open/close
// - Highlight of the current page in the header menu
// - Small animations (feature cards, hero button ripple, page fade-in)
// ============================================

var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== MOBILE MENU TOGGLE =====
// Called from onclick="toggleMenu()" on the ☰ button in every page header.
function toggleMenu() {
    var header = document.querySelector('header');
    var headerUl = document.querySelector('header .header-nav ul.header-buttons');
    var toggleBtn = document.querySelector('.menu-toggle');
    var isOpen = header && header.classList.contains('nav-open');
    setMenuOpen(!isOpen);
    if (headerUl) requestAnimationFrame(positionNavToToggle);
}

function setMenuOpen(open) {
    var header = document.querySelector('header');
    var headerUl = document.querySelector('header .header-nav ul.header-buttons');
    var headerNav = document.querySelector('header .header-nav');
    var toggleBtn = document.querySelector('.menu-toggle');
    if (headerUl) headerUl.classList.toggle('active', open);
    if (header) header.classList.toggle('nav-open', open);
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(open));
    if (!open && headerNav) {
        headerNav.style.left = '';
        headerNav.style.top = '';
        headerNav.style.right = '';
    }
}

// Position the header nav so it appears anchored to the menu toggle button
// (only on wider screens; on phones CSS shows it as a full-width panel).
function positionNavToToggle() {
    var header = document.querySelector('header');
    var headerNav = document.querySelector('header .header-nav');
    var headerUl = document.querySelector('header .header-nav ul.header-buttons');
    var toggleBtn = document.querySelector('.menu-toggle');
    if (!header || !headerNav || !headerUl || !toggleBtn) return;

    if (window.matchMedia('(max-width: 768px)').matches) {
        headerNav.style.left = '';
        headerNav.style.right = '';
        headerNav.style.top = '';
        return;
    }

    if (!header.classList.contains('nav-open')) return;

    requestAnimationFrame(function () {
        var headerRect = header.getBoundingClientRect();
        var toggleRect = toggleBtn.getBoundingClientRect();
        var navRect = headerNav.getBoundingClientRect();
        var toggleCenter = (toggleRect.left - headerRect.left) + (toggleRect.width / 2);
        var left = Math.round(toggleCenter - navRect.width / 2);
        var margin = 8;
        var maxLeft = header.clientWidth - navRect.width - margin;
        headerNav.style.left = Math.max(margin, Math.min(left, maxLeft)) + 'px';
        headerNav.style.top = (toggleRect.bottom - headerRect.top + 6) + 'px';
        headerNav.style.right = 'auto';
    });
}

// Close menu when clicking outside it
document.addEventListener('click', function (event) {
    var toggle = document.querySelector('.menu-toggle');
    var headerUl = document.querySelector('header .header-nav ul.header-buttons');
    if (toggle && headerUl && !toggle.contains(event.target) && !headerUl.contains(event.target)) {
        setMenuOpen(false);
    }
});

// Close menu with the Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenuOpen(false);
});

// Close menu when a menu link is clicked
document.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function () { setMenuOpen(false); });
});

// Keep the dropdown anchored to the toggle when the window is resized
window.addEventListener('resize', positionNavToToggle);

// ===== CURRENT PAGE HIGHLIGHT =====
(function () {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    if (current === 'product-detail.html') return;
    document.querySelectorAll('.header-nav a, .footer-nav a').forEach(function (link) {
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
})();

// ===== FEATURE CARDS FADE-IN (home page) =====
if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card').forEach(function (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== BUTTON RIPPLE EFFECT (styles in css/styles.css) =====
document.querySelectorAll('.cta-button').forEach(function (button) {
    button.addEventListener('click', function (e) {
        if (prefersReducedMotion) return;
        var ripple = document.createElement('span');
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.className = 'ripple';
        this.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
    });
});

// ===== PAGE FADE-IN =====
// Shows the page as soon as the HTML is ready (does NOT wait for images).
if (!prefersReducedMotion) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    var showPage = function () {
        requestAnimationFrame(function () { document.body.style.opacity = '1'; });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showPage);
    } else {
        showPage();
    }
}
