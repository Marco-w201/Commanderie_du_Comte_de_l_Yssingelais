// ============================================
// Configuration depuis config.js
// ============================================
const CFG = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : {};
const IS_PAGES_CONTEXT = window.location.pathname.includes('/pages/');
const ROUTES = {
  login: IS_PAGES_CONTEXT ? 'login.html' : 'pages/login.html',
  user: IS_PAGES_CONTEXT ? 'user.html' : 'pages/user.html',
  ajouter: IS_PAGES_CONTEXT ? 'ajouter.html' : 'pages/ajouter.html'
};

function getDefaultUsers() {
  return CFG.users || [
    { email: 'superadmin@commanderie.fr', password: 'super123', role: 2 },
    { email: 'admin@commanderie.fr', password: 'admin123', role: 1 },
    { email: 'user@commanderie.fr', password: 'user123', role: 0 }
  ];
}

// ============================================
// reCAPTCHA
// ============================================
function onloadRecaptcha() {
  const el = document.getElementById('adhesionRecaptcha');
  if (el && typeof grecaptcha !== 'undefined' && CFG.recaptchaSiteKey) {
    grecaptcha.render(el, { sitekey: CFG.recaptchaSiteKey });
  }
}

// ============================================
// Base de données locale (localStorage)
// ============================================
const DB_KEY = 'commanderie_db';

function initDB() {
  const defaultUsers = getDefaultUsers();
  const existing = localStorage.getItem(DB_KEY);
  if (existing) {
    const db = JSON.parse(existing);
    let changed = false;
    if (!db.users) { db.users = []; changed = true; }
    defaultUsers.forEach(u => {
      if (!db.users.find(x => x.email === u.email)) {
        db.users.push({ ...u });
        changed = true;
      }
    });
    if (!db.nextAdherentId) { db.nextAdherentId = 8; changed = true; }
    if (!db.nextArticleId) { db.nextArticleId = 4; changed = true; }
    if (changed) localStorage.setItem(DB_KEY, JSON.stringify(db));
    return;
  }
  const db = {
    adherents: [
      { id_adherent: 1, Nom: 'De La Clergerie', Prénom: 'Laurent', Mail: 'fezui', Numero_telephone: '0612345678', '1er_parrain': 'Jeffrey Epstein', '2eme_parrain': 'Donald Trump', Date_de_naissance: '2006-11-11', Lieu_naissance: 'Lyon', Profession: 'PDG', Adresse_perso: 'TKT', Adresse_pro: 'LDLC ARENA', Nom_conjoint: 'Ma', Prénom_conjoint: 'Femme', Role: 0, Date_inscription: '2026-07-02 12:22:04' },
      { id_adherent: 7, Nom: 'Utilisateur', Prénom: 'Test', Mail: 'test.utilisateur@gmail.com', Numero_telephone: '+33612345678', '1er_parrain': 'Jean Dupont', '2eme_parrain': null, Date_de_naissance: '1985-06-15', Lieu_naissance: 'Lyon', Profession: null, Adresse_perso: null, Adresse_pro: null, Nom_conjoint: null, Prénom_conjoint: null, Role: 1, Date_inscription: '2026-07-02 12:22:04' }
    ],
    articles: [
      { id: 1, Date_publication: '2026-06-15T10:00:00Z', Titre: 'Chapitre solennel d\'automne 2026', Description: 'La Commanderie vous invite à son chapitre solennel qui se tiendra le 15 novembre à Yssingeaux. Une cérémonie traditionnelle d\'intronisation et de remise des distinctions.', Lien_image: null },
      { id: 2, Date_publication: '2026-05-20T08:30:00Z', Titre: 'Don de 2 500 € à Entr\'Aides 43', Description: 'Lors de notre dernière assemblée, nous avons remis un don de 2 500 € à l\'association Entr\'Aides 43 pour soutenir leurs actions locales.', Lien_image: null },
      { id: 3, Date_publication: '2026-04-10T14:00:00Z', Titre: 'Soirée de dégustation — Secrets de l\'Anis Étoilé', Description: 'Une soirée gastronomique ouverte au public pour découvrir les secrets de l\'anis étoilé. Rendez-vous le 12 décembre à la salle des fêtes d\'Yssingeaux.', Lien_image: null }
    ],
    users: defaultUsers.map(u => ({ ...u })),
    nextAdherentId: 8,
    nextArticleId: 4
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

initDB();

// ============================================
// Mobile menu toggle
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const icon = menuToggle.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = navMobile.classList.contains('open') ? 'close' : 'menu';
    }
  });
  navMobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      const icon = menuToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    });
  });
}

// ============================================
// Active nav link on scroll
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not([href*=".html"])');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 200;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// Smooth scroll for nav links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// News ticker pause on hover
// ============================================
const tickerTrack = document.getElementById('tickerTrack');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

// ============================================
// Intersection Observer for fade-in animations
// ============================================
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
document.querySelectorAll('section > .container, .hero-content, .newsletter-inner').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================
// Newsletter form
// ============================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('.newsletter-input');
    const email = input.value.trim();
    if (email) {
      input.value = '';
      input.placeholder = 'Merci pour votre inscription !';
      setTimeout(() => { input.placeholder = 'Votre adresse e-mail'; }, 3000);
    }
  });
}

// ============================================
// Articles — affichage sur index.html
// ============================================
function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  const db = getDB();
  grid.innerHTML = '';
  if (!db.articles || db.articles.length === 0) {
    grid.innerHTML = '<p class="section-desc" style="grid-column:1/-1">Aucun article pour le moment.</p>';
    return;
  }
  db.articles.sort((a, b) => new Date(b.Date_publication) - new Date(a.Date_publication)).forEach(article => {
    const date = new Date(article.Date_publication);
    const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-card-image">
        ${article.Lien_image
          ? `<img src="${article.Lien_image}" alt="${article.Titre}">`
          : '<span class="material-symbols-outlined">article</span>'}
      </div>
      <div class="article-card-body">
        <div class="article-card-date">${dateStr}</div>
        <h3 class="article-card-title">${article.Titre || 'Sans titre'}</h3>
        <p class="article-card-desc">${article.Description || ''}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

renderArticles();

// ============================================
// Formulaire d'adhésion
// ============================================
const adhesionForm = document.getElementById('adhesionForm');
if (adhesionForm) {
  adhesionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('adhesionSubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    if (typeof grecaptcha !== 'undefined') {
      const resp = grecaptcha.getResponse();
      if (!resp) {
        const msg = document.getElementById('adhesionMessage');
        if (msg) {
          msg.textContent = 'Veuillez valider le reCAPTCHA.';
          msg.className = 'form-message error';
        }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
    }

    const fd = new FormData(adhesionForm);
    const db = getDB();
    const adherent = {
      id_adherent: db.nextAdherentId++,
      Nom: fd.get('Nom') || '',
      Prénom: fd.get('Prénom') || '',
      Mail: fd.get('Mail') || '',
      Numero_telephone: fd.get('Numero_telephone') || '',
      '1er_parrain': fd.get('1er_parrain') || null,
      '2eme_parrain': fd.get('2eme_parrain') || null,
      Date_de_naissance: fd.get('Date_de_naissance') || '',
      Lieu_naissance: fd.get('Lieu_naissance') || null,
      Profession: fd.get('Profession') || null,
      Adresse_perso: fd.get('Adresse_perso') || null,
      Adresse_pro: fd.get('Adresse_pro') || null,
      Nom_conjoint: fd.get('Nom_conjoint') || null,
      Prénom_conjoint: fd.get('Prénom_conjoint') || null,
      Role: 0,
      Date_inscription: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    db.adherents.push(adherent);
    saveDB(db);
    adhesionForm.reset();
    const msg = document.getElementById('adhesionMessage');
    if (msg) {
      msg.textContent = 'Votre candidature a bien été envoyée ! Nous vous contacterons rapidement.';
      msg.className = 'form-message success';
      setTimeout(() => { msg.className = 'form-message'; }, 5000);
    }
  });
}

// ============================================
// Login
// ============================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const msg = document.getElementById('loginMessage');
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminEmail', email);
      sessionStorage.setItem('adminRole', user.role);
      msg.textContent = 'Connexion réussie ! Redirection...';
      msg.className = 'form-message success';
      const target = user.role === 0 ? 'user.html' : 'admin.html';
      setTimeout(() => { window.location.href = target; }, 1000);
    } else {
      msg.textContent = 'E-mail ou mot de passe incorrect.';
      msg.className = 'form-message error';
    }
  });
}

// ============================================
// Admin Panel
// ============================================
if (document.querySelector('.admin-page')) {
  checkAdminAuth();

  // Show users tab for both admin and super admin
  const currentRole = parseInt(sessionStorage.getItem('adminRole'));
  if (currentRole >= 1) {
    document.getElementById('navUsers').style.display = '';
  }

  // Navigation tabs
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').slice(1);
      document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(target);
      if (section) section.classList.add('active');
      if (target === 'dashboard') renderDashboard();
      if (target === 'adherents') renderAdherentsTable();
      if (target === 'articles') renderArticlesTable();
      if (target === 'users') renderUsersTable();
    });
  });

  // Handle hash on page load for direct section navigation
  const initHash = window.location.hash.slice(1);
  if (initHash) {
    const hashLink = document.querySelector(`.admin-nav-link[href="#${initHash}"]`);
    if (hashLink) {
      hashLink.click();
    }
  }

  renderDashboard();
  renderAdherentsTable();
  renderArticlesTable();

  // Modal logic
  setupAdherentModal();
  setupArticleModal();
  setupUserModal();
}

function checkAdminAuth() {
  if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = ROUTES.login;
  }
  const role = parseInt(sessionStorage.getItem('adminRole'));
  if (role === 0) {
    window.location.href = ROUTES.user;
  }
}

function isSuperAdmin() {
  return parseInt(sessionStorage.getItem('adminRole')) === 2;
}

// ============================================
// Dashboard
// ============================================
function renderDashboard() {
  const db = getDB();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  document.getElementById('statAdherents').textContent = db.adherents.length;

  const articleCount = db.articles ? db.articles.length : 0;
  document.getElementById('statArticles').textContent = articleCount;

  const newThisMonth = db.adherents.filter(a => {
    const d = new Date(a.Date_inscription);
    return d >= startOfMonth;
  }).length;
  document.getElementById('statNewThisMonth').textContent = newThisMonth;

  const articlesThisMonth = (db.articles || []).filter(a => {
    const d = new Date(a.Date_publication);
    return d >= startOfMonth;
  }).length;
  document.getElementById('statArticlesThisMonth').textContent = articlesThisMonth;

  const recent = db.adherents.slice(-5).reverse();
  const tbody = document.getElementById('recentAdherentsBody');
  tbody.innerHTML = recent.map(a => `
    <tr>
      <td>${a.id_adherent}</td>
      <td>${a.Nom || ''}</td>
      <td>${a.Prénom || ''}</td>
      <td>${a.Mail || ''}</td>
      <td>${a.Date_inscription || ''}</td>
    </tr>
  `).join('');
}

// ============================================
// Adherents CRUD
// ============================================
function renderAdherentsTable() {
  const db = getDB();
  const tbody = document.getElementById('adherentsBody');
  tbody.innerHTML = db.adherents.map(a => `
    <tr>
      <td>${a.id_adherent}</td>
      <td>${a.Nom || ''}</td>
      <td>${a.Prénom || ''}</td>
      <td>${a.Mail || ''}</td>
      <td>${a.Numero_telephone || ''}</td>
      <td>${a['1er_parrain'] || ''}</td>
      <td>${a['2eme_parrain'] || ''}</td>
      <td>${a.Date_de_naissance || ''}</td>
      <td>${a.Profession || ''}</td>
      <td>${a.Role === 1 ? 'Admin' : a.Role === 2 ? 'Dignitaire' : 'Membre'}</td>
      <td>${a.Date_inscription || ''}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn-icon btn-icon-edit" data-edit-adherent="${a.id_adherent}" title="Modifier">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn-icon btn-icon-delete" data-delete-adherent="${a.id_adherent}" title="Supprimer">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-edit-adherent]').forEach(btn => {
    btn.addEventListener('click', () => openAdherentModal(parseInt(btn.dataset.editAdherent)));
  });
  tbody.querySelectorAll('[data-delete-adherent]').forEach(btn => {
    btn.addEventListener('click', () => deleteAdherent(parseInt(btn.dataset.deleteAdherent)));
  });
}

function setupAdherentModal() {
  const overlay = document.getElementById('adherentModal');
  if (!overlay) return;

  document.getElementById('btnAddAdherent').addEventListener('click', () => {
    document.getElementById('adherentModalTitle').textContent = 'Ajouter un adhérent';
    document.getElementById('editAdherentId').value = '';
    document.getElementById('adherentForm').reset();
    overlay.classList.add('open');
  });

  document.getElementById('adherentModalClose').addEventListener('click', () => overlay.classList.remove('open'));
  document.getElementById('adherentModalCancel').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  document.getElementById('adherentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const db = getDB();
    const fd = new FormData(e.target);
    const editId = document.getElementById('editAdherentId').value;

    const data = {
      Nom: fd.get('Nom') || '',
      Prénom: fd.get('Prénom') || '',
      Mail: fd.get('Mail') || '',
      Numero_telephone: fd.get('Numero_telephone') || '',
      '1er_parrain': fd.get('1er_parrain') || null,
      '2eme_parrain': fd.get('2eme_parrain') || null,
      Date_de_naissance: fd.get('Date_de_naissance') || '',
      Lieu_naissance: fd.get('Lieu_naissance') || null,
      Profession: fd.get('Profession') || null,
      Adresse_perso: fd.get('Adresse_perso') || null,
      Adresse_pro: fd.get('Adresse_pro') || null,
      Nom_conjoint: fd.get('Nom_conjoint') || null,
      Prénom_conjoint: fd.get('Prénom_conjoint') || null,
      Role: parseInt(fd.get('Role')) || 0
    };

    if (editId) {
      const idx = db.adherents.findIndex(a => a.id_adherent === parseInt(editId));
      if (idx !== -1) {
        db.adherents[idx] = { ...db.adherents[idx], ...data };
      }
    } else {
      data.id_adherent = db.nextAdherentId++;
      data.Date_inscription = new Date().toISOString().slice(0, 19).replace('T', ' ');
      db.adherents.push(data);
    }

    saveDB(db);
    overlay.classList.remove('open');
    renderDashboard();
    renderAdherentsTable();
  });
}

function openAdherentModal(id) {
  const db = getDB();
  const a = db.adherents.find(x => x.id_adherent === id);
  if (!a) return;
  document.getElementById('adherentModalTitle').textContent = 'Modifier un adhérent';
  document.getElementById('editAdherentId').value = id;
  document.getElementById('aNom').value = a.Nom || '';
  document.getElementById('aPrenom').value = a.Prénom || '';
  document.getElementById('aMail').value = a.Mail || '';
  document.getElementById('aTelephone').value = a.Numero_telephone || '';
  document.getElementById('aDateNaissance').value = a.Date_de_naissance || '';
  document.getElementById('aLieuNaissance').value = a.Lieu_naissance || '';
  document.getElementById('aProfession').value = a.Profession || '';
  document.getElementById('aAdressePerso').value = a.Adresse_perso || '';
  document.getElementById('aAdressePro').value = a.Adresse_pro || '';
  document.getElementById('a1erParrain').value = a['1er_parrain'] || '';
  document.getElementById('a2emeParrain').value = a['2eme_parrain'] || '';
  document.getElementById('aNomConjoint').value = a.Nom_conjoint || '';
  document.getElementById('aPrenomConjoint').value = a.Prénom_conjoint || '';
  document.getElementById('aRole').value = a.Role || 0;
  document.getElementById('adherentModal').classList.add('open');
}

function deleteAdherent(id) {
  if (!confirm('Supprimer cet adhérent ?')) return;
  const db = getDB();
  db.adherents = db.adherents.filter(a => a.id_adherent !== id);
  saveDB(db);
  renderDashboard();
  renderAdherentsTable();
}

// ============================================
// Articles CRUD
// ============================================
function renderArticlesTable() {
  const db = getDB();
  const tbody = document.getElementById('articlesBody');
  tbody.innerHTML = (db.articles || []).map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.Titre || ''}</td>
      <td>${(a.Description || '').slice(0, 60)}${(a.Description || '').length > 60 ? '...' : ''}</td>
      <td>${a.Lien_image ? 'Oui' : 'Non'}</td>
      <td>${a.Date_publication ? new Date(a.Date_publication).toLocaleDateString('fr-FR') : ''}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn-icon btn-icon-edit" data-edit-article="${a.id}" title="Modifier">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn-icon btn-icon-delete" data-delete-article="${a.id}" title="Supprimer">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-edit-article]').forEach(btn => {
    btn.addEventListener('click', () => openArticleModal(parseInt(btn.dataset.editArticle)));
  });
  tbody.querySelectorAll('[data-delete-article]').forEach(btn => {
    btn.addEventListener('click', () => deleteArticle(parseInt(btn.dataset.deleteArticle)));
  });
}

function setupArticleModal() {
  const overlay = document.getElementById('articleModal');
  if (!overlay) return;

  document.getElementById('btnAddArticle').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = ROUTES.ajouter;
  });

  document.getElementById('articleModalClose').addEventListener('click', () => overlay.classList.remove('open'));
  document.getElementById('articleModalCancel').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  document.getElementById('articleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const db = getDB();
    const fd = new FormData(e.target);
    const editId = document.getElementById('editArticleId').value;

    const data = {
      Titre: fd.get('Titre') || '',
      Description: fd.get('Description') || null,
      Lien_image: fd.get('Lien_image') || null
    };

    if (editId) {
      const idx = (db.articles || []).findIndex(a => a.id === parseInt(editId));
      if (idx !== -1) {
        db.articles[idx] = { ...db.articles[idx], ...data };
      }
    } else {
      data.id = db.nextArticleId++;
      data.Date_publication = new Date().toISOString();
      if (!db.articles) db.articles = [];
      db.articles.push(data);
    }

    saveDB(db);
    overlay.classList.remove('open');
    renderDashboard();
    renderArticlesTable();
    renderArticles();
  });
}

function openArticleModal(id) {
  const db = getDB();
  const a = (db.articles || []).find(x => x.id === id);
  if (!a) return;
  document.getElementById('articleModalTitle').textContent = 'Modifier un article';
  document.getElementById('editArticleId').value = id;
  document.getElementById('aTitre').value = a.Titre || '';
  document.getElementById('aDescription').value = a.Description || '';
  document.getElementById('aLienImage').value = a.Lien_image || '';
  document.getElementById('articleModal').classList.add('open');
}

function deleteArticle(id) {
  if (!confirm('Supprimer cet article ?')) return;
  const db = getDB();
  db.articles = (db.articles || []).filter(a => a.id !== id);
  saveDB(db);
  renderDashboard();
  renderArticlesTable();
  renderArticles();
}

// ============================================
// Users CRUD (Super Admin only)
// ============================================
function renderUsersTable() {
  const db = getDB();
  const tbody = document.getElementById('usersBody');
  if (!tbody) return;
  const currentEmail = sessionStorage.getItem('adminEmail');
  tbody.innerHTML = db.users.map((u, i) => `
    <tr>
      <td>${u.email}</td>
      <td>${u.role === 2 ? 'Super Admin' : u.role === 1 ? 'Admin' : 'Utilisateur'}</td>
      <td>
        <div class="admin-table-actions">
          ${u.email !== currentEmail ? `
            <button class="btn-icon btn-icon-edit" data-edit-user="${i}" title="Modifier">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-icon btn-icon-delete" data-delete-user="${i}" title="Supprimer">
              <span class="material-symbols-outlined">delete</span>
            </button>
          ` : '<span class="admin-table-current">Vous</span>'}
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-edit-user]').forEach(btn => {
    btn.addEventListener('click', () => openUserModal(parseInt(btn.dataset.editUser)));
  });
  tbody.querySelectorAll('[data-delete-user]').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(parseInt(btn.dataset.deleteUser)));
  });
}

function filterUserRoles() {
  const currentRole = parseInt(sessionStorage.getItem('adminRole'));
  const roleSelect = document.getElementById('uRole');
  Array.from(roleSelect.options).forEach(opt => {
    const val = parseInt(opt.value);
    if (currentRole === 1) {
      opt.style.display = val === 0 ? '' : 'none';
    } else {
      opt.style.display = '';
    }
  });
}

function setupUserModal() {
  const overlay = document.getElementById('userModal');
  if (!overlay) return;

  document.getElementById('btnAddUser').addEventListener('click', () => {
    filterUserRoles();
    document.getElementById('userModalTitle').textContent = 'Ajouter un utilisateur';
    document.getElementById('editUserIndex').value = '';
    document.getElementById('userForm').reset();
    document.getElementById('uPassword').required = true;
    overlay.classList.add('open');
  });

  document.getElementById('userModalClose').addEventListener('click', () => overlay.classList.remove('open'));
  document.getElementById('userModalCancel').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const db = getDB();
    const fd = new FormData(e.target);
    const editIndex = document.getElementById('editUserIndex').value;
    const currentRole = parseInt(sessionStorage.getItem('adminRole'));

    const email = fd.get('Email').trim();
    const password = fd.get('Password').trim();
    const selectedRole = parseInt(fd.get('Role')) || 0;

    // Admin can only create/manage users (role 0)
    if (currentRole === 1 && selectedRole !== 0) {
      alert('Vous ne pouvez créer que des utilisateurs (rôle Utilisateur).');
      return;
    }

    // Check duplicate email
    const existingIdx = db.users.findIndex((u, i) => u.email === email && i !== parseInt(editIndex || -1));
    if (existingIdx !== -1) {
      alert('Cet e-mail est déjà utilisé.');
      return;
    }

    if (editIndex) {
      const idx = parseInt(editIndex);
      const targetUser = db.users[idx];
      // Admin can only edit users (role 0), not admins/super admins
      if (currentRole === 1 && targetUser.role !== 0) {
        alert('Vous ne pouvez modifier que les utilisateurs (rôle Utilisateur).');
        return;
      }
      db.users[idx].email = email;
      if (password) db.users[idx].password = password;
      db.users[idx].role = selectedRole;
    } else {
      if (!password) {
        alert('Le mot de passe est requis.');
        return;
      }
      db.users.push({
        email: email,
        password: password,
        role: selectedRole
      });
    }

    saveDB(db);
    overlay.classList.remove('open');
    renderUsersTable();
  });
}

function openUserModal(index) {
  const db = getDB();
  const u = db.users[index];
  if (!u) return;
  const currentRole = parseInt(sessionStorage.getItem('adminRole'));
  if (currentRole === 1 && u.role !== 0) {
    alert('Vous ne pouvez modifier que les utilisateurs (rôle Utilisateur).');
    return;
  }
  filterUserRoles();
  document.getElementById('userModalTitle').textContent = "Modifier un utilisateur";
  document.getElementById('editUserIndex').value = index;
  document.getElementById('uEmail').value = u.email;
  document.getElementById('uPassword').value = '';
  document.getElementById('uPassword').required = false;
  document.getElementById('uRole').value = u.role;
  document.getElementById('userModal').classList.add('open');
}

function deleteUser(index) {
  const db = getDB();
  const u = db.users[index];
  if (!u) return;
  const currentEmail = sessionStorage.getItem('adminEmail');
  const currentRole = parseInt(sessionStorage.getItem('adminRole'));
  if (u.email === currentEmail) {
    alert('Vous ne pouvez pas vous supprimer vous-même.');
    return;
  }
  if (currentRole === 1 && u.role !== 0) {
    alert('Vous ne pouvez supprimer que les utilisateurs (rôle Utilisateur).');
    return;
  }
  if (!confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
  db.users.splice(index, 1);
  saveDB(db);
  renderUsersTable();
}

// ============================================
// User Page (user.html)
// ============================================
if (document.querySelector('.user-page')) {
  if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = ROUTES.login;
  } else {
    renderUserPage();
  }
}

function renderUserPage() {
  const email = sessionStorage.getItem('adminEmail');
  const badge = document.getElementById('userEmailBadge');
  if (badge) badge.textContent = email;

  const welcome = document.getElementById('userWelcomeName');
  if (welcome) welcome.textContent = 'Bienvenue, ' + (email || 'Membre');

  const profileEmail = document.getElementById('profileEmail');
  if (profileEmail) profileEmail.textContent = email;

  const profileRole = document.getElementById('profileRole');
  if (profileRole) profileRole.textContent = 'Membre';

  const db = getDB();
  const articleCount = (db.articles || []).length;
  const statEl = document.getElementById('userStatArticles');
  if (statEl) statEl.textContent = articleCount;

  // Navigation tabs
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').slice(1);
      document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(target);
      if (section) section.classList.add('active');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminRole');
      window.location.href = ROUTES.login;
    });
  }
}
