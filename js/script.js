/* ==========================================================================
   Lamont Roofing Services Pty Ltd — Interactive UI Controller (Vanilla JS)
   Zero dependencies · Accessible · Mobile-First
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll Shadow
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('site-header');

  function updateHeaderScroll() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = mobileDrawer ? mobileDrawer.querySelectorAll('a') : [];

  function setDrawerState(open) {
    if (!menuToggle || !mobileDrawer) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileDrawer.classList.toggle('is-open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('nav-open', open);
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setDrawerState(!isOpen);
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setDrawerState(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        setDrawerState(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && mobileDrawer.classList.contains('is-open')) {
        setDrawerState(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Core Capabilities Category Filter Tabs
     ------------------------------------------------------------------------ */
  const filterTabs = document.querySelectorAll('[data-filter-tab]');
  const serviceCells = document.querySelectorAll('[data-service-category]');

  if (filterTabs.length && serviceCells.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const selected = tab.getAttribute('data-filter-tab');

        filterTabs.forEach(function (btn) {
          const active = btn === tab;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
        });

        serviceCells.forEach(function (cell) {
          const categories = (cell.getAttribute('data-service-category') || '').split(' ');
          const match = selected === 'all' || categories.includes(selected);
          cell.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Accessible FAQ Accordion
     ------------------------------------------------------------------------ */
  const faqTriggers = document.querySelectorAll('[data-faq-trigger]');

  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const isCurrentlyOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close sibling items for clean single-focus readability
      faqTriggers.forEach(function (otherTrigger) {
        const otherId = otherTrigger.getAttribute('aria-controls');
        const otherPanel = otherId ? document.getElementById(otherId) : null;
        otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.classList.remove('is-open');
      });

      if (!isCurrentlyOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Interactive Site Scope Helper (Zero-Backend Honest SMS & Clipboard Tool)
     ------------------------------------------------------------------------ */
  const propertyField = document.getElementById('brief-property');
  const serviceField = document.getElementById('brief-service');
  const suburbField = document.getElementById('brief-suburb');
  const notesField = document.getElementById('brief-notes');
  const previewText = document.getElementById('brief-preview-text');
  const smsLink = document.getElementById('brief-sms-link');
  const copyBtn = document.getElementById('brief-copy-btn');
  const statusEl = document.getElementById('brief-status');

  const SMS_TARGET = '+61412485999';

  function buildScopeSummary() {
    const property = propertyField ? propertyField.value.trim() : 'Industrial / Warehouse';
    const service = serviceField ? serviceField.value.trim() : 'Industrial & Commercial Roofing (New / Re-Roof)';
    const suburb = suburbField && suburbField.value.trim() ? suburbField.value.trim() : 'Sutherland Shire / Greater Sydney';
    const notes = notesField ? notesField.value.trim() : '';

    const lines = [
      'Enquiry for Lamont Roofing Services Pty Ltd:',
      '- Property Type: ' + property,
      '- Scope Required: ' + service,
      '- Suburb / Location: ' + suburb
    ];

    if (notes) {
      lines.push('- Site Notes: ' + notes);
    }

    lines.push('Please contact me regarding an inspection and quote.');
    return lines.join('\n');
  }

  function updateBriefOutputs() {
    const summary = buildScopeSummary();
    if (previewText) {
      previewText.textContent = summary;
    }
    if (smsLink) {
      smsLink.setAttribute('href', 'sms:' + SMS_TARGET + '?&body=' + encodeURIComponent(summary));
    }
  }

  [propertyField, serviceField, suburbField, notesField].forEach(function (field) {
    if (!field) return;
    field.addEventListener('input', function () {
      updateBriefOutputs();
      if (statusEl) statusEl.textContent = '';
    });
    field.addEventListener('change', function () {
      updateBriefOutputs();
      if (statusEl) statusEl.textContent = '';
    });
  });

  updateBriefOutputs();

  // Pre-select a service scope when clicking "Enquire about this scope" from Services or Footer
  const scopeButtons = document.querySelectorAll('[data-select-scope]');
  scopeButtons.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      const targetScope = btn.getAttribute('data-select-scope');
      if (serviceField && targetScope) {
        serviceField.value = targetScope;
        updateBriefOutputs();
      }
      const quoteSection = document.getElementById('quote-brief');
      if (quoteSection) {
        event.preventDefault();
        quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (statusEl && targetScope) {
          statusEl.textContent = 'Scope pre-selected: ' + targetScope + '. Add your suburb below or call directly.';
        }
      }
    });
  });

  // Honest Clipboard Copy Button
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const summary = buildScopeSummary();

      function showCopied() {
        if (statusEl) {
          statusEl.textContent = 'Project brief copied to clipboard — ready to share when you call (02) 9543 6317.';
        }
      }

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(summary).then(showCopied).catch(function () {
          fallbackCopy(summary, showCopied);
        });
      } else {
        fallbackCopy(summary, showCopied);
      }
    });
  }

  function fallbackCopy(text, onSuccess) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (e) {
      if (statusEl) {
        statusEl.textContent = 'Please select and copy the summary above, or call (02) 9543 6317 directly.';
      }
    }
    document.body.removeChild(temp);
  }

  /* ------------------------------------------------------------------------
     6. Subtle Progressive Scroll Reveal (Zero Invisible Content Risk)
     ------------------------------------------------------------------------ */
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = document.querySelectorAll('[data-reveal]');

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealNodes.length) {
    document.documentElement.classList.add('js-enabled');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }
})();
