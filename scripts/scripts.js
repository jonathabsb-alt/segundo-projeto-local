console.log("scripts.js carregado!");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM pronto!");
});

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

(() => {
  const btn = $('#btn-menu');
  const menu = $('#menu-list');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

(() => {
  const openBtn = $('#btn-open-modal');
  const closeBtn = $('#btn-close-modal');
  const confirmBtn = $('#btn-confirm-modal');
  const dialog = $('#modalDemo');

  if (!dialog) return;

  const openModal = () => dialog.showModal();
  const closeModal = () => dialog.close();

  openBtn && openBtn.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  confirmBtn && confirmBtn.addEventListener('click', () => {
    showToast('success', 'Ação confirmada com sucesso!');
    closeModal();
  });

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inDialog) closeModal();
  });
})();

function showToast(type = 'info', message = 'Olá!') {
  const wrap = $('#toasts');
  if (!wrap) return;

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.setAttribute('role', 'status');
  el.textContent = message;

  wrap.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity .3s ease, transform .3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

(() => {
  const btn = $('#btn-toast');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const types = ['success','warning','error','info'];
    const pick = types[Math.floor(Math.random()*types.length)];
    showToast(pick, `Exemplo de toast ${pick}.`);
  });
})();

(() => {
  const form = $('#contatoForm');
  if (!form) return;

  const fields = {
    nome: {
      input: $('#nome'),
      error: $('#err-nome'),
      test: (el) => el.value.trim().length >= 3
    },
    email: {
      input: $('#email'),
      error: $('#err-email'),
      test: (el) => el.checkValidity()
    },
    assunto: {
      input: $('#assunto'),
      error: $('#err-assunto'),
      test: (el) => el.value.trim() !== ''
    },
    mensagem: {
      input: $('#mensagem'),
      error: $('#err-mensagem'),
      test: (el) => el.value.trim().length >= 10
    }
  };

  const showError = (errEl, show) => {
    errEl.style.display = show ? 'block' : 'none';
  };

  Object.values(fields).forEach(({input, error, test}) => {
    input.addEventListener('input', () => showError(error, !test(input)));
    input.addEventListener('blur',  () => showError(error, !test(input)));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(fields).forEach(({input, error, test}) => {
      const ok = test(input);
      showError(error, !ok);
      if (!ok) valid = false;
    });

    if (valid) {
      showToast('success', 'Formulário enviado! (simulação)');
      form.reset();
      setTimeout(() => {
        Object.values(fields).forEach(({error}) => showError(error, false));
      }, 0);
    } else {
      showToast('warning', 'Verifique os campos destacados.');
    }
  });

  form.addEventListener('reset', () => {
    Object.values(fields).forEach(({error}) => showError(error, false));
  });
})();