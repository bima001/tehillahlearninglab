document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#year').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
      });
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wordCycle = document.querySelector('[data-word-cycle]');
  if (wordCycle && !reducedMotion) {
    const words = ['learning', 'building', 'exploring'];
    let wordIndex = 0;
    window.setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      wordCycle.classList.add('word-changing');
      window.setTimeout(() => {
        wordCycle.textContent = words[wordIndex];
        wordCycle.classList.remove('word-changing');
      }, 180);
    }, 2400);
  }

  const skillDetails = {
    programming: {
      title: 'Programming',
      description: 'I’m developing a foundation in computational thinking and writing code through study and beginner projects.',
      status: 'Learning'
    },
    web: {
      title: 'Web Development',
      description: 'Learning how HTML, CSS, and JavaScript work together to create accessible, responsive websites.',
      status: 'Developing'
    },
    analysis: {
      title: 'Data Analysis',
      description: 'Exploring how to organise information, notice patterns, and communicate what data can tell us.',
      status: 'Learning'
    },
    excel: {
      title: 'Excel',
      description: 'Building familiarity with spreadsheets as a practical tool for working with and understanding data.',
      status: 'Learning'
    },
    support: {
      title: 'Technology Support',
      description: 'Learning the foundations of troubleshooting and helping people use everyday technology.',
      status: 'Learning'
    }
  };
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillDetail = document.getElementById('skill-detail');
  skillTabs.forEach((button, index) => {
    button.addEventListener('click', () => {
      const detail = skillDetails[button.dataset.skill];
      if (!detail || !skillDetail) return;

      skillTabs.forEach((tab) => {
        const isSelected = tab === button;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-pressed', String(isSelected));
      });

      skillDetail.querySelector('.mono-label').textContent = `LEARNING TRACK / ${String(index + 1).padStart(2, '0')}`;
      skillDetail.querySelector('h3').textContent = detail.title;
      skillDetail.querySelector('p:not(.mono-label)').textContent = detail.description;
      skillDetail.querySelector('.skill-status').textContent = detail.status;
    });
  });

  const statusToggle = document.querySelector('.status-toggle');
  const statusDetails = document.getElementById('status-details');
  if (statusToggle && statusDetails) {
    statusToggle.addEventListener('click', () => {
      const isExpanded = statusToggle.getAttribute('aria-expanded') === 'true';
      statusToggle.setAttribute('aria-expanded', String(!isExpanded));
      statusDetails.hidden = isExpanded;
      statusToggle.textContent = isExpanded ? 'Show status notes' : 'Hide status notes';
    });
  }

  const revealTargets = document.querySelectorAll('.section-heading, .status-panel, .journey-timeline .info-card, .project-card, .academic-table-block');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => {
      element.classList.add('reveal-ready');
      revealObserver.observe(element);
    });
  }

  const destinations = [
    { label: 'Home', href: 'index.html', keywords: 'start landing home' },
    { label: 'About', href: 'about.html', keywords: 'profile biography skills courses results academic record' },
    { label: 'Projects', href: 'projects.html', keywords: 'work portfolio data web' },
    { label: 'Academic Planner', href: 'planner.html', keywords: 'tasks courses deadlines planner' },
    { label: 'Contact', href: 'contact.html', keywords: 'email phone github linkedin' }
  ];
  const palette = document.createElement('dialog');
  palette.className = 'command-palette';
  palette.setAttribute('aria-labelledby', 'palette-title');
  palette.innerHTML = `
    <div class="palette-topline">
      <label id="palette-title" for="palette-search">Jump to a page</label>
      <button class="palette-close" type="button" aria-label="Close command palette">Esc</button>
    </div>
    <input id="palette-search" type="search" autocomplete="off" placeholder="Search this notebook…" aria-controls="palette-results" />
    <ul id="palette-results" role="listbox" aria-label="Pages"></ul>
    <p class="palette-hint">↑ ↓ to move <span>↵ to open</span></p>`;
  document.body.append(palette);

  const paletteSearch = palette.querySelector('#palette-search');
  const paletteResults = palette.querySelector('#palette-results');
  const closeButton = palette.querySelector('.palette-close');
  const paletteTrigger = document.createElement('button');
  paletteTrigger.type = 'button';
  paletteTrigger.className = 'palette-trigger';
  paletteTrigger.setAttribute('aria-haspopup', 'dialog');
  paletteTrigger.setAttribute('aria-label', 'Open page search, Control or Command K');
  paletteTrigger.innerHTML = '<span>Find a page</span><kbd>Ctrl / ⌘ K</kbd>';
  const navigationBar = document.querySelector('.nav-wrapper');
  (navigationBar || document.body).append(paletteTrigger);

  let selectedResult = 0;
  let previousFocus;

  function renderPaletteResults() {
    const query = paletteSearch.value.trim().toLowerCase();
    const matches = destinations.filter((destination) =>
      `${destination.label} ${destination.keywords}`.toLowerCase().includes(query)
    );
    paletteResults.replaceChildren();
    selectedResult = 0;

    if (matches.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'palette-empty';
      empty.textContent = 'No matching page. Try another search.';
      paletteResults.append(empty);
      return;
    }

    matches.forEach((destination, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = destination.href;
      link.role = 'option';
      link.id = `palette-result-${index}`;
      link.setAttribute('aria-selected', String(index === selectedResult));
      link.innerHTML = `<span>${destination.label}</span><span aria-hidden="true">↗</span>`;
      link.addEventListener('click', (event) => {
        const target = new URL(link.href, window.location.href);
        if (target.pathname === window.location.pathname) {
          event.preventDefault();
          palette.close();
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
      item.append(link);
      paletteResults.append(item);
    });
  }

  function openPalette() {
    previousFocus = document.activeElement;
    if (!palette.open) palette.showModal();
    paletteSearch.value = '';
    renderPaletteResults();
    paletteSearch.focus();
  }

  function moveSelection(direction) {
    const results = paletteResults.querySelectorAll('[role="option"]');
    if (results.length === 0) return;
    selectedResult = (selectedResult + direction + results.length) % results.length;
    results.forEach((result, index) => {
      result.setAttribute('aria-selected', String(index === selectedResult));
    });
  }

  paletteTrigger.addEventListener('click', openPalette);
  closeButton.addEventListener('click', () => palette.close());
  palette.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      palette.close();
    }
  });
  paletteSearch.addEventListener('input', renderPaletteResults);
  paletteSearch.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === 'Enter') {
      const selected = paletteResults.querySelector('[aria-selected="true"]');
      if (selected) {
        event.preventDefault();
        selected.click();
      }
    }
  });
  palette.addEventListener('click', (event) => {
    if (event.target === palette) palette.close();
  });
  palette.addEventListener('close', () => {
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPalette();
    }
  });
});
