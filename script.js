const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('site-nav');
const toast = document.getElementById('toast');
const contactEmail = 'princessrquimora28@gmail.com';

if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark');
}

function setTheme(dark) {
    root.classList.toggle('dark', dark);
    if (themeLabel) {
        themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    }
}

if (themeToggle) {
    setTheme(root.classList.contains('dark'));
    themeToggle.addEventListener('click', () => {
        const dark = !root.classList.contains('dark');
        setTheme(dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
}

if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', open);
    });
}

let toastTimer;
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(btn.dataset.copy);
            showToast(`${btn.dataset.label} copied`);
        } catch (error) {
            showToast('Copy did not work. Select the text and copy it by hand.');
        }
    });
});

const projects = [
    {
        title: 'Simple console programs',
        category: 'console',
        tag: 'C# · Console',
        summary: 'Small programs that run in the command window. I wrote them to practise logic and to see how code runs step by step.',
        focus: 'Logical thinking and fixing basic errors',
        tools: 'C#'
    },
    {
        title: 'Multiple-choice trivia game',
        category: 'game',
        tag: 'C# · Game',
        summary: 'A quiz where the player picks one answer per question. It keeps the score, uses a countdown timer and ends on a final summary screen.',
        focus: 'Score tracking, timers and a final summary screen',
        tools: 'C#'
    },
    {
        title: 'Daily task manager',
        category: 'winforms',
        tag: 'C# · WinForms',
        summary: 'A Windows app built in Visual Studio. You can add daily tasks, tick them off when done and delete them.',
        focus: 'Building a graphical app with buttons and lists',
        tools: 'C#, Windows Forms (WinForms), Visual Studio'
    }
];

const projectGrid = document.getElementById('project-grid');

if (projectGrid) {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const modal = document.getElementById('project-modal');

    const renderProjects = (filter) => {
        const list = filter === 'all' ? projects : projects.filter(p => p.category === filter);
        projectGrid.innerHTML = list.map(p => `
            <button type="button" class="card project-card" data-index="${projects.indexOf(p)}">
                <span class="tag">${p.tag}</span>
                <h3>${p.title}</h3>
                <p>${p.summary}</p>
                <span class="card-link">View details →</span>
            </button>
        `).join('');
    };

    const openModal = (project) => {
        document.getElementById('modal-tag').textContent = project.tag;
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-summary').textContent = project.summary;
        document.getElementById('modal-focus').textContent = project.focus;
        document.getElementById('modal-tools').textContent = project.tools;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        modal.querySelector('.modal-close').focus();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            renderProjects(btn.dataset.filter);
        });
    });

    projectGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.project-card');
        if (card) {
            openModal(projects[card.dataset.index]);
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('.modal-close')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    renderProjects('all');
}

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(contactForm);
        const name = data.get('name');
        const email = data.get('email');
        const message = data.get('message');
        const subject = encodeURIComponent(`Website message from ${name}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
        showToast('Opening your email app...');
        contactForm.reset();
    });
}

document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
});
