/**
 * TAPZO — Smart NFC Business Solutions
 * Interactive behavior: sticky navbar, mobile drawer, scroll reveal,
 * interactive NFC/QR product demo, package pre-selection, and form validation.
 */

(() => {
  'use strict';

  const WHATSAPP_NUMBER = '919737175978';

  /* --------------------------------------------------------------------------
     1. Sticky Navbar & Active Section Tracking
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('.navbar__link'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 130;
    let currentId = 'home';
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    }
    navLinks.forEach((link) => {
      const target = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', target === currentId);
    });
  };

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveNav();
  }, { passive: true });
  updateNavbar();
  updateActiveNav();

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta'));

  const setMobileMenu = (open) => {
    if (!navToggle || !mobileNav) return;
    mobileNav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      setMobileMenu(!isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => setMobileMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMobileMenu(false);
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Subtle Scroll Reveal
     -------------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     4. Interactive Product Demonstration (NFC Tap vs QR Scan)
     -------------------------------------------------------------------------- */
  const demoTabs = document.querySelectorAll('.demo-tab');
  const demoCaption = document.getElementById('demoCaption');
  const demoPulseRings = document.querySelectorAll('.pulse-ring');
  const demoCardVisual = document.getElementById('demoCardVisual');

  const demoCopy = {
    nfc: '<strong>NFC Tap Mode:</strong> Hold the top of any NFC-enabled smartphone near the TAPZO card. No app needed—your digital business profile opens in under a second.',
    qr: '<strong>QR Scan Mode:</strong> Point any smartphone camera at the precision-printed QR code on the card back or front to launch the exact same business landing page.'
  };

  demoTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.demoMode;
      demoTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      if (demoCaption && demoCopy[mode]) {
        demoCaption.innerHTML = demoCopy[mode];
      }
      demoPulseRings.forEach((ring) => {
        ring.style.display = mode === 'nfc' ? 'block' : 'none';
      });
      if (demoCardVisual) {
        demoCardVisual.dataset.mode = mode;
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Package Pre-selection ("Choose Package" Buttons)
     -------------------------------------------------------------------------- */
  const packageSelect = document.getElementById('package');
  const chooseButtons = document.querySelectorAll('[data-select-package]');

  chooseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pkg = btn.dataset.selectPackage;
      if (packageSelect && pkg) {
        packageSelect.value = pkg;
        clearFieldError(packageSelect);
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          document.getElementById('name')?.focus();
        }, 450);
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Contact Form Validation & Transparent WhatsApp Dispatch
     -------------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const statusWhatsappBtn = document.getElementById('statusWhatsappBtn');
  const statusCopyBtn = document.getElementById('statusCopyBtn');

  function setFieldError(input, message) {
    const errorEl = document.getElementById(`${input.id}Error`);
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(input) {
    const errorEl = document.getElementById(`${input.id}Error`);
    input.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(input) {
    const val = input.value.trim();
    clearFieldError(input);

    if (input.hasAttribute('required') && !val) {
      setFieldError(input, 'This field is required.');
      return false;
    }

    if (input.id === 'phone' && val) {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) {
        setFieldError(input, 'Please enter a valid 10-digit phone number.');
        return false;
      }
    }

    if (input.id === 'email' && val) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!emailOk) {
        setFieldError(input, 'Please enter a valid email address.');
        return false;
      }
    }

    return true;
  }

  if (form) {
    const fields = Array.from(form.querySelectorAll('.form-control'));
    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    let lastSummaryText = '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      fields.forEach((field) => {
        if (!validateField(field)) {
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      const data = {
        name: document.getElementById('name').value.trim(),
        business: document.getElementById('businessName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        pkg: document.getElementById('package').value,
        message: document.getElementById('message').value.trim()
      };

      lastSummaryText = [
        'Hello TAPZO Team, I would like to enquire about an NFC Smart Card:',
        `• Name: ${data.name}`,
        `• Business Name: ${data.business}`,
        `• Phone: ${data.phone}`,
        `• Email: ${data.email}`,
        `• Selected Package: ${data.pkg}`,
        data.message ? `• Message: ${data.message}` : null
      ]
        .filter(Boolean)
        .join('\n');

      if (statusWhatsappBtn) {
        statusWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lastSummaryText)}`;
      }

      if (formStatus) {
        formStatus.classList.add('visible');
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (statusCopyBtn) {
      statusCopyBtn.addEventListener('click', async () => {
        if (!lastSummaryText) return;
        try {
          await navigator.clipboard.writeText(lastSummaryText);
          const original = statusCopyBtn.textContent;
          statusCopyBtn.textContent = 'Copied to Clipboard';
          setTimeout(() => {
            statusCopyBtn.textContent = original;
          }, 2200);
        } catch {
          statusCopyBtn.textContent = 'Copy unavailable';
        }
      });
    }
  }
})();
