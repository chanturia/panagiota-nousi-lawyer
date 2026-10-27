'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menu && nav) {
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Άνοιγμα μενού');
    nav.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(max-width: 640px)').addEventListener('change', closeMenu);
  menu.hidden = false;
  document.documentElement.classList.add('js-nav');
}

const form = document.querySelector('#demo-form');
if (form) {
  const fieldset = form.querySelector('fieldset');
  const submit = form.querySelector('[type="submit"]');
  const result = document.querySelector('#form-result');
  const fields = [
    { input: document.querySelector('#contact-name'), error: document.querySelector('#name-error'), empty: 'Συμπληρώστε το ονοματεπώνυμό σας.' },
    { input: document.querySelector('#contact-email'), error: document.querySelector('#email-error'), empty: 'Συμπληρώστε το email σας.' },
    { input: document.querySelector('#contact-message'), error: document.querySelector('#message-error'), empty: 'Γράψτε ένα σύντομο μήνυμα.' }
  ];
  const clearResult = () => {
    result.textContent = '';
    result.classList.remove('is-success');
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearResult();
    let firstInvalid = null;
    fields.forEach(({ input, error, empty }) => {
      let message = !input.value.trim() ? empty : '';
      if (!message && !input.validity.valid) message = input.type === 'email' ? 'Συμπληρώστε ένα έγκυρο email.' : 'Ελέγξτε αυτό το πεδίο.';
      error.textContent = message;
      input.setAttribute('aria-invalid', String(Boolean(message)));
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      result.textContent = 'Ελέγξτε τα πεδία που επισημαίνονται.';
      firstInvalid.focus();
      return;
    }
    result.textContent = 'Η δοκιμή ολοκληρώθηκε. Δεν στάλθηκε μήνυμα και δεν αποθηκεύτηκαν στοιχεία.';
    result.classList.add('is-success');
    result.focus({ preventScroll: true });
  });
  form.addEventListener('input', event => {
    clearResult();
    const field = fields.find(({ input }) => input === event.target);
    if (field) {
      field.error.textContent = '';
      field.input.removeAttribute('aria-invalid');
    }
  });
  // Progressive enhancement: no enabled fields until the local-only handler exists.
  fieldset.disabled = false;
  submit.disabled = false;
}
