/* JavaScript Interactions */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypewriter();
    initIdeTerminal();
    initNavbarScroll();
    initMobileMenu();
    initProjectFilters();
    initContactForm();
    initScrollSpy();
    
    // Showcase Dashboard Initializers
    initViewRouter();
    initShowcaseDashboard();
    
    // Chatbot Initializer
    initChatbot();

    // Citation Modal Initializer
    initCitationModal();

    // TAMZHI Live NLP Playground Initializer
    initNlpPlayground();

    // Avatar Interactive Intro Initializer
    initAvatarIntro();
});

/* ==========================================
   1. Theme System (Light / Dark Mode)
   ========================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check local storage or user prefers-color-scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateThemeIcon(themeToggleBtn, savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = prefersDark ? 'dark' : 'light';
        root.setAttribute('data-theme', currentTheme);
        updateThemeIcon(themeToggleBtn, currentTheme);
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeToggleBtn, newTheme);
        
        // Notify dashboard charts to adjust grid/text colors if dashboard is active
        if (window.dashboardCharts && typeof window.updateChartTheme === 'function') {
            window.updateChartTheme(newTheme);
        }
    });
}

function updateThemeIcon(btn, theme) {
    const icon = btn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

/* ==========================================
   2. Typewriter Effect
   ========================================== */
function initTypewriter() {
    const typewriterSpan = document.getElementById('typewriter');
    const words = [
        "Technical Data Analyst.",
        "Data Analytics Engineer.",
        "BI Analyst.",
        "E-commerce Data Analyst.",
        "Junior Data Engineer.",
        "Backend & Data Developer."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Erase faster
        } else {
            typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before next word
        }
        
        if (typewriterSpan) {
            setTimeout(type, typingSpeed);
        }
    }
    
    if (typewriterSpan) {
        setTimeout(type, 1000);
    }
}

/* ==========================================
   3. Interactive IDE Terminal
   ========================================== */
const CODE_SNIPPETS = {
    python: `
<span class="kw">import</span> tensorflow <span class="kw">as</span> tf
<span class="kw">from</span> django.shortcuts <span class="kw">import</span> render
<span class="kw">from</span> rest_framework.views <span class="kw">import</span> APIView
<span class="kw">from</span> rest_framework.response <span class="kw">import</span> Response

<span class="kw">class</span> <span class="fn">TransliterationAPI</span>(APIView):
    <span class="cm">"""
    TAMZHI: Reverse transliteration service
    Maps Romanized shorthand Tamil input to Native script
    """</span>
    <span class="kw">def</span> <span class="fn">post</span>(<span class="kw">self</span>, request):
        roman_input = request.data.get(<span class="str">"text"</span>)
        <span class="kw">if</span> <span class="op">not</span> roman_input:
            <span class="kw">return</span> Response({<span class="str">"error"</span>: <span class="str">"Input empty"</span>}, status=<span class="num">400</span>)
            
        <span class="cm"># Load hybrid translation model & map phonetics</span>
        native_tamil = <span class="kw">self</span>.transliterate_model(roman_input)
        <span class="kw">return</span> Response({
            <span class="str">"input"</span>: roman_input,
            <span class="str">"output"</span>: native_tamil,
            <span class="str">"confidence"</span>: <span class="num">0.965</span>
        })
        
    <span class="kw">def</span> <span class="fn">transliterate_model</span>(<span class="kw">self</span>, input_str):
        <span class="cm"># Hybrid sequence alignment prediction logic</span>
        <span class="kw">return</span> <span class="str">"வணக்கம்"</span> <span class="kw">if</span> input_str.lower() == <span class="str">"vanakkam"</span> <span class="kw">else</span> <span class="str">"தமிழ்"</span>
`,
    javascript: `
<span class="kw">const</span> express = <span class="fn">require</span>(<span class="str">'express'</span>);
<span class="kw">const</span> { Pool } = <span class="fn">require</span>(<span class="str">'pg'</span>);
<span class="kw">const</span> app = <span class="fn">express</span>();

<span class="kw">const</span> pool = <span class="kw">new</span> <span class="fn">Pool</span>({ connectionString: process.env.DATABASE_URL });

<span class="cm">// Get monthly analytics: event count and outstanding balances</span>
app.<span class="fn">get</span>(<span class="str">'/api/dashboard/summary'</span>, <span class="kw">async</span> (req, res) => {
    <span class="kw">try</span> {
        <span class="kw">const</span> queryText = \`
            SELECT 
                TO_CHAR(date, 'YYYY-MM') AS month,
                COUNT(id) AS total_events,
                SUM(total_amount) AS total_amount,
                SUM(total_amount - paid_amount) AS outstanding_balance
            FROM bookings
            GROUP BY month
            ORDER BY month DESC
        \`;
        <span class="kw">const</span> { rows } = <span class="kw">await</span> pool.<span class="fn">query</span>(queryText);
        res.<span class="fn">json</span>({ success: <span class="kw">true</span>, data: rows });
    } <span class="kw">catch</span> (err) {
        res.<span class="fn">status</span>(<span class="num">500</span>).<span class="fn">json</span>({ error: err.message });
    }
});

app.<span class="fn">listen</span>(<span class="num">5000</span>, () => console.<span class="fn">log</span>(<span class="str">'Server active on port 5000'</span>));
`,
    sql: `
<span class="cm">-- Fetch month-wise performance metrics & outstanding totals</span>
<span class="kw">WITH</span> monthly_bookings <span class="kw">AS</span> (
    <span class="kw">SELECT </span>
        DATE_TRUNC(<span class="str">'month'</span>, event_date) <span class="kw">AS</span> booking_month,
        <span class="fn">COUNT</span>(booking_id) <span class="kw">AS</span> event_count,
        <span class="fn">SUM</span>(total_charge) <span class="kw">AS</span> monthly_revenue,
        <span class="fn">SUM</span>(total_charge - amount_received) <span class="kw">AS</span> outstanding_dues
    <span class="kw">FROM</span> event_sheet
    <span class="kw">WHERE</span> booking_status = <span class="str">'Confirmed'</span>
    <span class="kw">GROUP</span> <span class="kw">BY</span> booking_month
)
<span class="kw">SELECT </span>
    <span class="fn">TO_CHAR</span>(booking_month, <span class="str">'Month YYYY'</span>) <span class="kw">AS</span> billing_period,
    event_count,
    monthly_revenue <span class="kw">AS</span> revenue_in_gbp,
    outstanding_dues <span class="kw">AS</span> total_pending,
    <span class="cm">-- Compute growth trend</span>
    (monthly_revenue - <span class="fn">LAG</span>(monthly_revenue) <span class="fn">OVER</span> (<span class="kw">ORDER</span> <span class="kw">BY</span> booking_month)) / 
        <span class="fn">NULLIF</span>(<span class="fn">LAG</span>(monthly_revenue) <span class="fn">OVER</span> (<span class="kw">ORDER</span> <span class="kw">BY</span> booking_month), <span class="num">0</span>) * <span class="num">100.0</span> <span class="kw">AS</span> mom_revenue_growth
<span class="kw">FROM</span> monthly_bookings
<span class="kw">ORDER</span> <span class="kw">BY</span> booking_month <span class="kw">DESC</span>;
`
};

const RAW_CODE = {
    python: `import tensorflow as tf
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class TransliterationAPI(APIView):
    """
    TAMZHI: Reverse transliteration service
    Maps Romanized shorthand Tamil input to Native script
    """
    def post(self, request):
        roman_input = request.data.get("text")
        if not roman_input:
            return Response({"error": "Input empty"}, status=400)
            
        # Load hybrid translation model & map phonetics
        native_tamil = self.transliterate_model(roman_input)
        return Response({
            "input": roman_input,
            "output": native_tamil,
            "confidence": 0.965
        })
        
    def transliterate_model(self, input_str):
        # Hybrid sequence alignment prediction logic
        return "வணக்கம்" if input_str.lower() == "vanakkam" else "தமிழ்"`,
    javascript: `const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get monthly analytics: event count and outstanding balances
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        const queryText = \`
            SELECT 
                TO_CHAR(date, 'YYYY-MM') AS month,
                COUNT(id) AS total_events,
                SUM(total_amount) AS total_amount,
                SUM(total_amount - paid_amount) AS outstanding_balance
            FROM bookings
            GROUP BY month
            ORDER BY month DESC
        \`;
        const { rows } = await pool.query(queryText);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Server active on port 5000'));`,
    sql: `-- Fetch month-wise performance metrics & outstanding totals
WITH monthly_bookings AS (
    SELECT 
        DATE_TRUNC('month', event_date) AS booking_month,
        COUNT(booking_id) AS event_count,
        SUM(total_charge) AS monthly_revenue,
        SUM(total_charge - amount_received) AS outstanding_dues
    FROM event_sheet
    WHERE booking_status = 'Confirmed'
    GROUP BY booking_month
)
SELECT 
    TO_CHAR(booking_month, 'Month YYYY') AS billing_period,
    event_count,
    monthly_revenue AS revenue_in_gbp,
    outstanding_dues AS total_pending,
    -- Compute growth trend
    (monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY booking_month)) / 
        NULLIF(LAG(monthly_revenue) OVER (ORDER BY booking_month), 0) * 100.0 AS mom_revenue_growth
FROM monthly_bookings
ORDER BY booking_month DESC;`
};

function initIdeTerminal() {
    const tabs = document.querySelectorAll('.ide-tab');
    const codeBlock = document.getElementById('ide-code-block');
    const copyBtn = document.getElementById('ide-copy-btn');
    let activeLang = 'python';
    
    if (codeBlock) {
        codeBlock.innerHTML = CODE_SNIPPETS[activeLang].trim();
        codeBlock.className = `language-${activeLang}`;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            const lang = tab.getAttribute('data-lang');
            activeLang = lang;
            codeBlock.innerHTML = CODE_SNIPPETS[lang].trim();
            codeBlock.className = `language-${lang}`;
        });
    });
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(RAW_CODE[activeLang].trim()).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check text-glow"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                }, 2000);
            });
        });
    }
}

/* ==========================================
   4. Navbar Styling on Scroll
   ========================================== */
function initNavbarScroll() {
    const header = document.querySelector('.navbar-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================
   5. Mobile Responsive Menu
   ========================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksWrapper = document.getElementById('nav-links-wrapper');
    const navLinks = document.querySelectorAll('.nav-item-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
            
            navLinksWrapper.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinksWrapper.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksWrapper) {
                navLinksWrapper.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });
}

/* ==========================================
   6. Projects Filter Grid
   ========================================== */
function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card-item');
    
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active from other filters
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // Animate filter change
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8) translateY(20px)';
                
                setTimeout(() => {
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/* ==========================================
   7. Contact Form Validations & Submissions
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const statusMsg = document.getElementById('form-status-msg');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Name Validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, true);
                isValid = false;
            } else {
                showError(nameInput, false);
            }
            
            // Email Validation
            if (emailInput.value.trim() === '' || !validateEmail(emailInput.value.trim())) {
                showError(emailInput, true);
                isValid = false;
            } else {
                showError(emailInput, false);
            }
            
            // Subject Validation
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, true);
                isValid = false;
            } else {
                showError(subjectInput, false);
            }
            
            // Message Validation
            if (messageInput.value.trim() === '') {
                showError(messageInput, true);
                isValid = false;
            } else {
                showError(messageInput, false);
            }
            
            if (isValid) {
                const submitBtn = document.getElementById('form-submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
                
                // Simulate API Request (Form Submission)
                setTimeout(() => {
                    statusMsg.className = 'form-status success';
                    statusMsg.textContent = 'Message sent successfully! Thank you for reaching out.';
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        statusMsg.textContent = '';
                        statusMsg.className = 'form-status';
                    }, 5000);
                }, 1500);
            } else {
                statusMsg.className = 'form-status error';
                statusMsg.textContent = 'Please correct the highlighted fields and try again.';
            }
        });
        
        // Clear validation error when typing
        const inputs = [nameInput, emailInput, subjectInput, messageInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.value.trim() !== '') {
                        showError(input, false);
                    }
                });
            }
        });
    }
}

function showError(inputElement, show) {
    if (!inputElement) return;
    const formGroup = inputElement.parentElement;
    if (show) {
        formGroup.classList.add('invalid');
    } else {
        formGroup.classList.remove('invalid');
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/* ==========================================
   8. Scroll Spy for Navigation Active Link
   ========================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item-link');
    
    window.addEventListener('scroll', () => {
        // Only trigger scrollspy if portfolio view is active
        const portfolioView = document.getElementById('portfolio-view');
        if (portfolioView && portfolioView.classList.contains('hidden')) return;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Offset check
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================
   9. View Routing (Portfolio vs Showcase Dashboard)
   ========================================== */
function initViewRouter() {
    const toggleBtn = document.getElementById('showcase-view-btn');
    const portfolioView = document.getElementById('portfolio-view');
    const dashboardView = document.getElementById('dashboard-view');
    const navLinks = document.querySelectorAll('.nav-item-link');
    
    if (toggleBtn && portfolioView && dashboardView) {
        toggleBtn.addEventListener('click', () => {
            const isDashboard = portfolioView.classList.contains('hidden');
            
            if (isDashboard) {
                // Return to Portfolio View
                portfolioView.classList.remove('hidden');
                dashboardView.classList.add('hidden');
                toggleBtn.innerHTML = '<i class="fa-solid fa-chart-pie"></i> Interactive Demo';
                
                // Reset active header links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Smooth scroll back to top of portfolio
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else {
                // Switch to Dashboard View
                portfolioView.classList.add('hidden');
                dashboardView.classList.remove('hidden');
                toggleBtn.innerHTML = '<i class="fa-solid fa-house"></i> View Portfolio';
                
                // Clear active states in nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Scroll to top of dashboard
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Re-align layouts of charts on open
                if (window.dashboardCharts && typeof window.resizeCharts === 'function') {
                    window.resizeCharts();
                }
            }
        });
        
        // Ensure clicking any navigation link switches back to portfolio view
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (portfolioView.classList.contains('hidden')) {
                    portfolioView.classList.remove('hidden');
                    dashboardView.classList.add('hidden');
                    toggleBtn.innerHTML = '<i class="fa-solid fa-chart-pie"></i> Interactive Demo';
                }
            });
        });
    }
}

/* ==========================================
   10. Interactive Industry Showcase Dashboard
   ========================================== */

// --- MOCK DATABASE DATASETS ---
const CRYSTAL_EVENTS_BOOKINGS = [
    { name: "Client A", date: "2026-02-12", location: "Venue A", total: 4500, paid: 4500, status: "Paid" },
    { name: "Client B", date: "2026-02-18", location: "Venue B", total: 3200, paid: 1500, status: "Confirmed" },
    { name: "Client C", date: "2026-03-01", location: "Venue C", total: 6000, paid: 6000, status: "Paid" },
    { name: "Client D", date: "2026-03-10", location: "Venue D", total: 2800, paid: 0, status: "Pending" },
    { name: "Client E", date: "2026-03-24", location: "Venue E", total: 7500, paid: 7500, status: "Paid" },
    { name: "Client F", date: "2026-04-05", location: "Venue F", total: 3900, paid: 2000, status: "Confirmed" },
    { name: "Client G", date: "2026-04-14", location: "Venue G", total: 5500, paid: 1000, status: "Outstanding" },
    { name: "Client H", date: "2026-04-20", location: "Venue H", total: 4800, paid: 4800, status: "Paid" },
    { name: "Client I", date: "2026-05-02", location: "Venue I", total: 6500, paid: 0, status: "Pending" },
    { name: "Client J", date: "2026-05-18", location: "Venue J", total: 8000, paid: 5000, status: "Confirmed" }
];

const CRYSTAL_EVENTS_FINANCE = [
    {
        event: "Client Event A",
        branch: "Branch A",
        hall: "Venue A",
        guests: 400,
        revenue: 19500,
        costs: 4882.75,
        grossProfit: 14617.25,
        customerOwed: 0,
        netCashflow: 19500,
        notes: "Event P&L statement with catering, decoration, lighting, bar, and food costs."
    }
];

const CRYSTAL_EVENTS_SUPPLIER_PAYMENTS = [
    { month: "Month A", supplier: "Supplier Group A", totalOwed: 4882.75, totalPaid: 0, balance: 4882.75, status: "UNPAID" },
    { month: "Month B", supplier: "Supplier Group B", totalOwed: 3200, totalPaid: 1500, balance: 1700, status: "PARTIAL" }
];

// Reference colors matching dark/light CSS variables
const chartThemes = {
    dark: {
        text: '#f8fafc',
        grid: 'rgba(255,255,255,0.08)',
        cyan: '#00f0f0',
        purple: '#a855f7',
        purpleGlow: 'rgba(168, 85, 247, 0.15)',
        green: '#22c55e',
        red: '#ff5f56',
        cardBg: '#1e293b'
    },
    light: {
        text: '#0f172a',
        grid: 'rgba(15,23,42,0.08)',
        cyan: '#0284c7',
        purple: '#6366f1',
        purpleGlow: 'rgba(99, 102, 241, 0.15)',
        green: '#16a34a',
        red: '#d73a49',
        cardBg: '#ffffff'
    }
};

window.dashboardCharts = {};

function maskCurrencyValue(value) {
    return Math.round(value / 1000) * 1000;
}

function formatMaskedCurrency(value) {
    return `£${maskCurrencyValue(value).toLocaleString()}`;
}

function initShowcaseDashboard() {
    const btnEvents = document.getElementById('db-tab-events');
    const btnSales = document.getElementById('db-tab-sales');
    const containerEvents = document.getElementById('events-dashboard-container');
    const containerSales = document.getElementById('sales-dashboard-container');
    const scenarioCards = document.querySelectorAll('.feature-showcase-card');
    const liveTitle = document.getElementById('demo-live-title');
    const liveCopy = document.getElementById('demo-live-copy');
    const liveTags = document.getElementById('demo-live-tags');
    
    if (btnEvents && btnSales && containerEvents && containerSales) {
        btnEvents.addEventListener('click', () => {
            btnEvents.classList.add('active');
            btnEvents.setAttribute('aria-selected', 'true');
            btnSales.classList.remove('active');
            btnSales.setAttribute('aria-selected', 'false');
            
            containerEvents.classList.remove('hidden');
            containerSales.classList.add('hidden');
            
            window.resizeCharts();
        });
        
        btnSales.addEventListener('click', () => {
            btnSales.classList.add('active');
            btnSales.setAttribute('aria-selected', 'true');
            btnEvents.classList.remove('active');
            btnEvents.setAttribute('aria-selected', 'false');
            
            containerSales.classList.remove('hidden');
            containerEvents.classList.add('hidden');
            
            window.resizeCharts();
        });
    }
    
    // 1. Initialize Event Bookings Panel
    initEventsAnalytics();
    
    // 2. Initialize Virosa Sales Projector Panel
    initSalesProjector();

    const scenarioContent = {
        enquiry: {
            title: 'Multi-branch enquiry routing',
            copy: 'This interactive scenario highlights how multi-branch enquiries are routed through dedicated email flows with live admin visibility.',
            badge: 'Enquiry routing',
            mini: [
                { value: '3', label: 'branch routes' },
                { value: '98%', label: 'handoff speed' },
                { value: 'Live', label: 'admin visibility' }
            ],
            tags: ['3 branch routes', '3 email flows', 'Fast handoff']
        },
        chatbot: {
            title: 'Admin chatbot insights',
            copy: 'This scenario shows the chatbot responses being reviewed inside the admin view so customer guidance and event updates stay visible.',
            badge: 'Admin chatbot',
            mini: [
                { value: '12', label: 'instant answers' },
                { value: '24/7', label: 'support flow' },
                { value: 'Live', label: 'guidance view' }
            ],
            tags: ['Admin review panel', 'Live answers', 'Operational guidance']
        },
        upload: {
            title: 'Easy image upload',
            copy: 'This scenario previews how admins can add halls, decoration, and venue images directly from the admin page for quick showcase updates.',
            badge: 'Image uploads',
            mini: [
                { value: '4', label: 'image types' },
                { value: '1 min', label: 'upload flow' },
                { value: 'Visual', label: 'venue-ready previews' }
            ],
            tags: ['Direct upload', 'Fast updates', 'Visual showcase']
        },
        branding: {
            title: 'Sales-team showcase + branded output',
            copy: 'This scenario previews the sales-team login and the automatic logo branding applied to event photo outputs.',
            badge: 'Sales branding',
            mini: [
                { value: '1 click', label: 'sales login' },
                { value: 'Auto', label: 'logo branding' },
                { value: 'Ready', label: 'customer output' }
            ],
            tags: ['Sales showcase', 'Logo branding', 'Customer-ready photos']
        }
    };

    function setScenarioPreview(key) {
        const content = scenarioContent[key] || scenarioContent.enquiry;
        const livePanel = document.getElementById('demo-live-panel');
        const liveBadge = document.getElementById('demo-live-badge');
        const liveMiniGrid = document.getElementById('demo-live-mini-grid');

        if (liveTitle) liveTitle.textContent = content.title;
        if (liveCopy) liveCopy.textContent = content.copy;
        if (liveBadge) liveBadge.textContent = content.badge;
        if (liveTags) {
            liveTags.innerHTML = content.tags.map(tag => `<span>${tag}</span>`).join('');
        }
        if (liveMiniGrid) {
            liveMiniGrid.innerHTML = content.mini
                .map(item => `<div class="demo-live-mini-card"><strong>${item.value}</strong><span>${item.label}</span></div>`)
                .join('');
        }
        if (livePanel) {
            livePanel.dataset.scenario = key;
        }
        scenarioCards.forEach(card => {
            const isActive = card.dataset.demoScenario === key;
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-pressed', String(isActive));
        });
    }

    scenarioCards.forEach(card => {
        card.addEventListener('click', () => setScenarioPreview(card.dataset.demoScenario || 'enquiry'));
        card.addEventListener('focus', () => setScenarioPreview(card.dataset.demoScenario || 'enquiry'));
    });

    setScenarioPreview('enquiry');
    
    // Global resizing helper
    window.resizeCharts = () => {
        Object.values(window.dashboardCharts).forEach(chart => {
            if (chart) {
                chart.resize();
                chart.update();
            }
        });
    };
    
    // Global theme updates helper
    window.updateChartTheme = (themeName) => {
        const colors = chartThemes[themeName];
        Chart.defaults.color = colors.text;
        
        Object.values(window.dashboardCharts).forEach(chart => {
            if (chart) {
                // Update grid lines
                if (chart.options.scales) {
                    if (chart.options.scales.x && chart.options.scales.x.grid) {
                        chart.options.scales.x.grid.color = colors.grid;
                    }
                    if (chart.options.scales.y && chart.options.scales.y.grid) {
                        chart.options.scales.y.grid.color = colors.grid;
                    }
                }
                // Update specific dataset colors depending on chart type
                if (chart.canvas.id === 'chart-events-cashflow') {
                    chart.data.datasets[0].backgroundColor = colors.cyan;
                    chart.data.datasets[1].backgroundColor = colors.purple;
                }
                if (chart.canvas.id === 'chart-sales-multichannel') {
                    chart.data.datasets[0].backgroundColor = [colors.cyan, colors.purple, colors.green];
                }
                chart.update();
            }
        });
    };
}

/* ==========================================
   10A. Event Management Company Dashboard Logic
   ========================================== */
function initEventsAnalytics() {
    const searchInput = document.getElementById('search-client');
    const statusSelect = document.getElementById('filter-status');
    
    // Render initial states
    filterAndRenderBookings();
    renderFinanceSummary();
    buildEventCharts();
    
    // Hook listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderBookings);
    }
    if (statusSelect) {
        statusSelect.addEventListener('change', filterAndRenderBookings);
    }
}

function filterAndRenderBookings() {
    const searchValue = document.getElementById('search-client').value.toLowerCase().trim();
    const statusValue = document.getElementById('filter-status').value;
    
    const filtered = CRYSTAL_EVENTS_BOOKINGS.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchValue);
        const matchesStatus = (statusValue === 'all') || (b.status === statusValue);
        return matchesSearch && matchesStatus;
    });
    
    renderBookingsTable(filtered);
    updateEventKPIs(filtered);
    updateEventChartsData(filtered);
}

function renderFinanceSummary() {
    const eventContainer = document.getElementById('event-finance-list');
    const supplierContainer = document.getElementById('supplier-payments-list');

    if (eventContainer) {
        eventContainer.innerHTML = CRYSTAL_EVENTS_FINANCE.map(item => `
            <article class="finance-card">
                <h5>${item.event}</h5>
                <p>${item.branch} • ${item.hall} • ${item.guests} guests</p>
                <div class="finance-meta">
                    <span class="finance-chip">Revenue ${formatMaskedCurrency(item.revenue)}</span>
                    <span class="finance-chip">Costs ${formatMaskedCurrency(item.costs)}</span>
                    <span class="finance-chip">Gross profit ${formatMaskedCurrency(item.grossProfit)}</span>
                </div>
                <div class="finance-metric-row">
                    <div class="finance-metric"><span class="finance-metric-label">Customer owed</span><strong class="finance-metric-value">${formatMaskedCurrency(item.customerOwed)}</strong></div>
                    <div class="finance-metric"><span class="finance-metric-label">Net cash flow</span><strong class="finance-metric-value">${formatMaskedCurrency(item.netCashflow)}</strong></div>
                </div>
            </article>
        `).join('');
    }

    if (supplierContainer) {
        supplierContainer.innerHTML = CRYSTAL_EVENTS_SUPPLIER_PAYMENTS.map(item => `
            <article class="finance-card">
                <h5>${item.month}</h5>
                <p>${item.supplier}</p>
                <div class="finance-meta">
                    <span class="finance-chip">Total owed ${formatMaskedCurrency(item.totalOwed)}</span>
                    <span class="finance-chip">Paid ${formatMaskedCurrency(item.totalPaid)}</span>
                    <span class="finance-chip">Balance ${formatMaskedCurrency(item.balance)}</span>
                </div>
                <div class="finance-metric-row">
                    <div class="finance-metric"><span class="finance-metric-label">Status</span><strong class="finance-metric-value">${item.status}</strong></div>
                </div>
            </article>
        `).join('');
    }
}

function renderBookingsTable(data) {
    const tbody = document.getElementById('bookings-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No records match your filters.</td></tr>`;
        return;
    }
    
    data.forEach(item => {
        const balance = item.total - item.paid;
        let badgeClass = 'status-pending';
        if (item.status === 'Paid') badgeClass = 'status-paid';
        else if (item.status === 'Confirmed') badgeClass = 'status-confirmed';
        else if (item.status === 'Outstanding') badgeClass = 'status-outstanding';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${item.date}</td>
            <td>${item.location}</td>
            <td>${formatMaskedCurrency(item.total)}</td>
            <td>${formatMaskedCurrency(item.paid)}</td>
            <td class="${balance > 0 ? 'text-glow' : ''}" style="color: ${balance > 0 ? 'var(--accent-secondary)' : 'inherit'}">${formatMaskedCurrency(balance)}</td>
            <td><span class="badge-status ${badgeClass}">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateEventKPIs(data) {
    const elCount = document.getElementById('kpi-bookings-count');
    const elRevenue = document.getElementById('kpi-revenue-total');
    const elOutstanding = document.getElementById('kpi-outstanding-total');
    const elRate = document.getElementById('kpi-collection-rate');
    
    let totalVolume = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    
    data.forEach(item => {
        totalVolume += item.total;
        totalPaid += item.paid;
        totalOutstanding += (item.total - item.paid);
    });
    
    const collectionRate = totalVolume > 0 ? Math.round((totalPaid / totalVolume) * 100) : 0;
    
    if (elCount) elCount.textContent = data.length.toLocaleString();
    if (elRevenue) elRevenue.textContent = formatMaskedCurrency(totalVolume);
    if (elOutstanding) elOutstanding.textContent = formatMaskedCurrency(totalOutstanding);
    if (elRate) elRate.textContent = `${collectionRate}%`;
}

function buildEventCharts() {
    const ctxCashflow = document.getElementById('chart-events-cashflow');
    const ctxStatus = document.getElementById('chart-events-status');
    if (!ctxCashflow || !ctxStatus) return;
    
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colors = chartThemes[theme];
    
    // Pre-calculate months cashflow
    const cashflowData = getMonthsCashflow(CRYSTAL_EVENTS_BOOKINGS);
    
    window.dashboardCharts.eventsCashflow = new Chart(ctxCashflow, {
        type: 'bar',
        data: {
            labels: cashflowData.labels,
            datasets: [
                {
                    label: 'Revenue Volume (GBP)',
                    data: cashflowData.revenue,
                    backgroundColor: colors.cyan,
                    borderRadius: 4
                },
                {
                    label: 'Outstanding Dues (GBP)',
                    data: cashflowData.outstanding,
                    backgroundColor: colors.purple,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Outfit' } } }
            },
            scales: {
                x: { grid: { color: colors.grid }, ticks: { font: { family: 'Outfit' } } },
                y: { grid: { color: colors.grid }, ticks: { font: { family: 'Outfit' } } }
            }
        }
    });
    
    // Status counts
    const statusCounts = getStatusBreakdown(CRYSTAL_EVENTS_BOOKINGS);
    
    window.dashboardCharts.eventsStatus = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: statusCounts.labels,
            datasets: [{
                data: statusCounts.data,
                backgroundColor: [colors.green, colors.cyan, '#ffbd2e', colors.red],
                borderWidth: 1,
                borderColor: colors.cardBg
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Outfit' } } }
            }
        }
    });
}

function updateEventChartsData(filteredData) {
    const cashflow = window.dashboardCharts.eventsCashflow;
    const status = window.dashboardCharts.eventsStatus;
    
    if (cashflow) {
        const updatedCashflow = getMonthsCashflow(filteredData);
        cashflow.data.labels = updatedCashflow.labels;
        cashflow.data.datasets[0].data = updatedCashflow.revenue;
        cashflow.data.datasets[1].data = updatedCashflow.outstanding;
        cashflow.update();
    }
    
    if (status) {
        const updatedStatus = getStatusBreakdown(filteredData);
        status.data.labels = updatedStatus.labels;
        status.data.datasets[0].data = updatedStatus.data;
        status.update();
    }
}

function getMonthsCashflow(data) {
    const monthlyMap = {};
    
    data.forEach(item => {
        const month = item.date.substring(0, 7); // YYYY-MM
        if (!monthlyMap[month]) {
            monthlyMap[month] = { revenue: 0, outstanding: 0 };
        }
        monthlyMap[month].revenue += item.total;
        monthlyMap[month].outstanding += (item.total - item.paid);
    });
    
    const sortedMonths = Object.keys(monthlyMap).sort();
    
    return {
        labels: sortedMonths.map(m => {
            const dateObj = new Date(m + "-01");
            return dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
        }),
        revenue: sortedMonths.map(m => maskCurrencyValue(monthlyMap[m].revenue)),
        outstanding: sortedMonths.map(m => maskCurrencyValue(monthlyMap[m].outstanding))
    };
}

function getStatusBreakdown(data) {
    const counts = { Paid: 0, Confirmed: 0, Pending: 0, Outstanding: 0 };
    data.forEach(item => {
        if (counts[item.status] !== undefined) {
            counts[item.status]++;
        }
    });
    
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

/* ==========================================
   10B. Virosa Sales Projector Model Logic
   ========================================== */
function initSalesProjector() {
    const sliderBudget = document.getElementById('slider-budget');
    const sliderConversion = document.getElementById('slider-conversion');
    const sliderMargin = document.getElementById('slider-margin');
    
    // Sliders event listeners
    if (sliderBudget && sliderConversion && sliderMargin) {
        const updateAll = () => {
            document.getElementById('val-budget').textContent = `£${parseInt(sliderBudget.value).toLocaleString()}`;
            document.getElementById('val-conversion').textContent = `${parseFloat(sliderConversion.value).toFixed(1)}%`;
            document.getElementById('val-margin').textContent = `${sliderMargin.value}%`;
            
            runSalesProjectionModel(
                parseInt(sliderBudget.value),
                parseFloat(sliderConversion.value) / 100,
                parseInt(sliderMargin.value) / 100
            );
        };
        
        sliderBudget.addEventListener('input', updateAll);
        sliderConversion.addEventListener('input', updateAll);
        sliderMargin.addEventListener('input', updateAll);
        
        // Build charts and run initial simulation
        buildSalesCharts();
        updateAll();
    }
}

function runSalesProjectionModel(budget, conversionRate, profitMargin) {
    // Model assumptions
    const CPC = 0.48; // Average cost per click of 48p
    const AOV = 68.00; // Average order value of £68
    
    // Computational projections
    const clicks = budget / CPC;
    const orders = Math.round(clicks * conversionRate);
    const projectedSales = Math.round(orders * AOV);
    const projectedProfit = Math.round((projectedSales * profitMargin) - budget);
    const roas = budget > 0 ? (projectedSales / budget).toFixed(1) : "0.0";
    
    // Update KPI panels
    document.getElementById('kpi-projected-sales').textContent = `£${projectedSales.toLocaleString()}`;
    document.getElementById('kpi-projected-profit').textContent = `£${projectedProfit.toLocaleString()}`;
    document.getElementById('kpi-projected-orders').textContent = orders.toLocaleString();
    document.getElementById('kpi-projected-roas').textContent = `${roas}x`;
    
    // Update Sales charts data
    updateSalesChartsData(projectedSales);
}

function buildSalesCharts() {
    const ctxChannel = document.getElementById('chart-sales-multichannel');
    const ctxTrajectory = document.getElementById('chart-sales-growth');
    if (!ctxChannel || !ctxTrajectory) return;
    
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colors = chartThemes[theme];
    
    // Channel Share Chart (Bar)
    window.dashboardCharts.salesChannel = new Chart(ctxChannel, {
        type: 'bar',
        data: {
            labels: ['Shopify Store', 'Amazon UK', 'TikTok Shop'],
            datasets: [{
                label: 'Channel Value (GBP)',
                data: [0, 0, 0],
                backgroundColor: [colors.cyan, colors.purple, colors.green],
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: colors.grid }, ticks: { font: { family: 'Outfit' } } },
                y: { grid: { color: 'transparent' }, ticks: { font: { family: 'Outfit' } } }
            }
        }
    });
    
    // Trajectory Growth Chart (Line)
    window.dashboardCharts.salesTrajectory = new Chart(ctxTrajectory, {
        type: 'line',
        data: {
            labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
            datasets: [{
                label: 'Forecast Trajectory (GBP)',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: colors.purple,
                backgroundColor: colors.purpleGlow,
                borderWidth: 3,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: colors.purple
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Outfit' } } }
            },
            scales: {
                x: { grid: { color: colors.grid }, ticks: { font: { family: 'Outfit' } } },
                y: { grid: { color: colors.grid }, ticks: { font: { family: 'Outfit' } } }
            }
        }
    });
}

function updateSalesChartsData(totalSales) {
    const channel = window.dashboardCharts.salesChannel;
    const trajectory = window.dashboardCharts.salesTrajectory;
    
    if (channel) {
        // Shopify: 45%, Amazon: 35%, TikTok Shop: 20%
        channel.data.datasets[0].data = [
            Math.round(totalSales * 0.45),
            Math.round(totalSales * 0.35),
            Math.round(totalSales * 0.20)
        ];
        channel.update();
    }
    
    if (trajectory) {
        // Growth trajectory: M1: 100%, M2: 112%, M3: 125%, M4: 140%, M5: 162%, M6: 185%
        trajectory.data.datasets[0].data = [
            totalSales,
            Math.round(totalSales * 1.12),
            Math.round(totalSales * 1.25),
            Math.round(totalSales * 1.40),
            Math.round(totalSales * 1.62),
            Math.round(totalSales * 1.85)
        ];
        trajectory.update();
    }
}

/* ==========================================
   11. Conversational AI Chatbot Widget
   ========================================== */

// --- CHATBOT CONVERSATIONAL RESPONSES ---
// --- CHATBOT CONVERSATIONAL RESPONSES ---
const BOT_RESPONSES = {
    hello: "Hello! I'm AnuAI, an assistant built to showcase Anuja's NLP and Chatbot work. How can I help you today?",
    skills: "Anuja's core technologies include:<br>• <strong>Backend Systems</strong>: Python (Django), Java (Spring Boot, Microservices), Node.js (Express)<br>• <strong>Data Science & AI</strong>: Machine Learning, Natural Language Processing (NLP/LLMs), TensorFlow, OpenCV, SQL (PostgreSQL), R<br>• <strong>Frontend & Apps</strong>: ReactJS, JavaScript, Swift, Flutter",
    tamzhi: "<strong>TAMZHI</strong> is Anuja's award-winning NLP research on <em>Shorthand Romanized Tamil to Tamil reverse transliteration</em>. Which component of the project would you like to explore?<br>• 🔀 <strong>Hybrid Transliteration Engine</strong> (Core sequential rules mapping)<br>• 🌳 <strong>Trie-based Autocomplete</strong> (Prefix-matching prefix tree search)<br>• 📉 <strong>Trigram Machine Learning Tagger</strong> (N-gram contextual word parsing)<br>• 🔇 <strong>Vowel Omission Compensator</strong> (Isolating consonant skeletons for text matching)<br><br><em>Click on a suggestion button below to dive in!</em>",
    tamzhi_hybrid: "The <strong>Core Hybrid Transliterator</strong> (<code>TransliteratorLogic.py</code>) maps shorthand Romanized text back into Tamil characters. It replaces prefixes sequentially:<br>• <strong>Sanskrit Characters</strong>: <code>sri</code> -> <code>ஸ்ரீ</code>, <code>j</code> -> <code>ஜ</code><br>• <strong>Rakaransha Rules</strong>: <code>kr</code> -> <code>க்ரு</code><br>• <strong>Consonant-Vowel Modifiers</strong>: Maps the 12 base vowels to their respective graphemes (e.g. <code>k</code> + <code>aa</code> -> <code>கா</code>)<br>• <strong>HAL Pulli Conversions</strong>: Automatically appends pulli to lone consonants (e.g. final <code>m</code> -> <code>ம்</code>)",
    tamzhi_trie: "The <strong>Trie Autocomplete</strong> (<code>TrieCode.py</code>) utilizes a standard prefix tree where children represent Roman characters.<br>• <strong>Prefix Matching</strong>: Traverses nodes up to length 6 to reconstruct Tamil words dynamically.<br>• <strong>Auto-suggestions</strong>: Predicts full Tamil suffixes based on character paths to speed up user typing.",
    tamzhi_trigram: "To resolve informal spelling ambiguities (e.g., <code>n</code> mapping to <code>ந்</code> vs <code>ன்</code> vs <code>ண்</code>), TAMZHI trains an <strong>NLTK Trigram Tagger</strong> (with Bigram and Unigram backoff models).<br>• <strong>Context Tagger</strong>: Learns word positioning from aligned datasets (<code>ta.romanized.split.tsv</code>).<br>• <strong>Trained Project Datasets</strong>: The live playground now loads the full 119k word training dataset compiled from <code>Tami.txt</code>, <code>Tanglish.txt</code>, and <code>tanglishSuggestion.txt</code> directly from Anuja's repository!<br>• <strong>Out-Of-Vocabulary Fallback</strong>: Unknown words tagged as <code>'NNN'</code> fall back to the rule-based engine.",
    tamzhi_vowels: "The <strong>Vowel Omission Compensator</strong> (<code>OmittingVowel.py</code>) handles informal SMS typing where vowels are omitted.<br>• <strong>Consonant Skeletons</strong>: Drops letters <code>a, e, i, o, u</code> to capture pure consonants.<br>• <strong>Dictionary Alignment</strong>: Matches the remaining consonant stems against indexed keys in the database.",
    main_menu: "Main menu restored. What else would you like to ask AnuAI about Anuja's experience or skills?",
    antarions: "At <strong>IT Domain</strong>, Anuja worked on the Western Australian analytics platform **Antarions** (antarions.com):<br>• Built optimized backend API routes for their **interactive charts dashboards**, speeding up visual data queries by 40%.<br>• Designed and integrated the **conversational AI chatbot module** for intelligent customer queries and data retrieval.",
    experience: "Anuja's professional background covers:<br>• **Data Analyst** at an event management company (Jan 2026 – Present)<br>• **Data Analyst** at Virosa (May 2025 – Oct 2025)<br>• **Backend Developer** at IT Domain (Antarions Project, 2024)<br>• **Software Engineer Intern** at Informatics (2022 – 2023)",
    education: "Anuja completed her higher education at the **University of Westminster, UK**:<br>• **MSc in Data Science & Analytics** (2025) – <em>Graduated with Merit</em><br>• **BEng (Hons) in Software Engineering** (2023)",
    contact: "You can reach Anuja Herath at:<br>• **Email**: anuanujadilrukshi@gmail.com<br>• **Phone**: +44 7932 858305<br>• **Location**: London, United Kingdom",
    default: "I'm not sure I understood that. You can ask about my skills, TAMZHI research, Westminster education, or Antarions work. Try using the suggestions buttons!"
};

function initChatbot() {
    const chatTrigger = document.getElementById('chat-trigger');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input-field');
    const chatSuggestions = document.getElementById('chat-suggestions');
    
    if (!chatTrigger || !chatWindow || !chatClose || !chatMessages || !chatForm || !chatInput || !chatSuggestions) return;

    // Suggestion configurations
    const MAIN_MENU_CHIPS = [
        { text: "Technical Skills", query: "skills" },
        { text: "TAMZHI Research", query: "tamzhi" },
        { text: "Antarions Work", query: "antarions" },
        { text: "Contact Details", query: "contact" }
    ];

    const TAMZHI_MENU_CHIPS = [
        { text: "Hybrid Engine", query: "tamzhi_hybrid" },
        { text: "Trie Autocomplete", query: "tamzhi_trie" },
        { text: "Trigram Model", query: "tamzhi_trigram" },
        { text: "Vowel Omission", query: "tamzhi_vowels" },
        { text: "🔙 Main Menu", query: "main_menu" }
    ];
    
    // Dynamic chip renderer
    function renderSuggestions(chips) {
        chatSuggestions.innerHTML = '';
        chips.forEach(chip => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip';
            btn.textContent = chip.text;
            btn.setAttribute('data-query', chip.query);
            btn.addEventListener('click', () => {
                handleUserMessage(chip.text, chip.query);
            });
            chatSuggestions.appendChild(btn);
        });
    }

    // Initialize with main menu
    renderSuggestions(MAIN_MENU_CHIPS);
    
    // Toggle Window
    chatTrigger.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            scrollToBottom();
        }
    });
    
    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });
    
    // Form Input Submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawText = chatInput.value.trim();
        if (rawText === '') return;
        
        // Match query to intent
        const queryKey = matchIntent(rawText);
        handleUserMessage(rawText, queryKey);
        chatInput.value = '';
    });
    
    function handleUserMessage(displayMsg, intentKey) {
        // 1. Append User Message
        appendMessage(displayMsg, 'user-message');
        
        // 2. Append Typing Indicator
        const typingEl = appendTypingIndicator();
        scrollToBottom();
        
        // 3. Simulated Response Delay
        setTimeout(() => {
            typingEl.remove();
            const botResponse = BOT_RESPONSES[intentKey] || BOT_RESPONSES['default'];
            appendMessage(botResponse, 'bot-message');
            
            // Context-based suggestion chips updates
            if (intentKey === 'tamzhi') {
                renderSuggestions(TAMZHI_MENU_CHIPS);
            } else if (intentKey === 'main_menu') {
                renderSuggestions(MAIN_MENU_CHIPS);
            } else if (['skills', 'antarions', 'experience', 'education', 'contact'].includes(intentKey)) {
                renderSuggestions(MAIN_MENU_CHIPS);
            }
            
            scrollToBottom();
        }, 900);
    }
    
    function appendMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${className}`;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        return msgDiv;
    }
    
    function appendTypingIndicator() {
        const indDiv = document.createElement('div');
        indDiv.className = 'chat-message bot-message typing-indicator';
        indDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        chatMessages.appendChild(indDiv);
        return indDiv;
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function matchIntent(text) {
        const clean = text.toLowerCase().trim();
        
        if (clean.includes('hi') || clean.includes('hello') || clean.includes('hey')) return 'hello';
        if (clean.includes('skill') || clean.includes('languages') || clean.includes('code')) return 'skills';
        
        if (clean.includes('hybrid') || clean.includes('sequential') || clean.includes('rules')) return 'tamzhi_hybrid';
        if (clean.includes('trie') || clean.includes('autocomplete') || clean.includes('prefix')) return 'tamzhi_trie';
        if (clean.includes('trigram') || clean.includes('n-gram') || clean.includes('nltk')) return 'tamzhi_trigram';
        if (clean.includes('vowel') || clean.includes('omission') || clean.includes('sms')) return 'tamzhi_vowels';
        
        if (clean.includes('tamzhi') || clean.includes('research') || clean.includes('sinhala') || clean.includes('transliteration')) return 'tamzhi';
        if (clean.includes('antarion') || clean.includes('it domain') || clean.includes('australia')) return 'antarions';
        if (clean.includes('experience') || clean.includes('work') || clean.includes('job') || clean.includes('crystal') || clean.includes('virosa')) return 'experience';
        if (clean.includes('education') || clean.includes('westminster') || clean.includes('msc') || clean.includes('degree') || clean.includes('university')) return 'education';
        if (clean.includes('contact') || clean.includes('phone') || clean.includes('email') || clean.includes('address') || clean.includes('reach')) return 'contact';
        if (clean.includes('main menu') || clean.includes('back') || clean.includes('menu')) return 'main_menu';
        
        return 'default';
    }
}

/* ==========================================
   12. Citation Modal Manager
   ========================================== */
function initCitationModal() {
    const modal = document.getElementById('citation-modal');
    const openBtn = document.getElementById('cite-paper-btn');
    const closeBtn = document.getElementById('modal-close');
    const tabs = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.modal-tab-content');
    const copyBtns = document.querySelectorAll('.copy-cite-btn');
    const downloadBtn = document.getElementById('download-bibtex-btn');

    if (!modal || !openBtn || !closeBtn) return;

    // Show modal
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    });

    // Close modal
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Enable page scrolling
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs & show correct contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tab.classList.add('active');
            const matchingContent = document.getElementById(`tab-${targetTab}`);
            if (matchingContent) {
                matchingContent.classList.add('active');
            }
        });
    });

    // Clipboard Copy Action
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            const textToCopy = targetEl.textContent.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = btn.innerHTML;
                
                // Show success status
                btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
                btn.classList.add('copied');

                // Revert after delay
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });

    // Download BibTeX File
    downloadBtn.addEventListener('click', () => {
        const bibtexEl = document.getElementById('cite-bibtex');
        if (!bibtexEl) return;

        const bibtexContent = bibtexEl.textContent.trim();
        const blob = new Blob([bibtexContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tamzhi_citation.bib';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}

/* ==========================================
   13. TAMZHI Live NLP Playground
   ========================================== */
function initNlpPlayground() {
    const inputField = document.getElementById('nlp-input-field');
    const outputDisplay = document.getElementById('nlp-output-display');
    const suggestionChips = document.querySelectorAll('.nlp-sug-chip');

    if (!inputField || !outputDisplay) return;

    // Word-level shorthand dictionary (defaults from Table I & V)
    const SHORTHAND_MAP = {
        "vanakkam": "வணக்கம்",
        "vankam": "வணக்கம்",
        "nalam": "நலம்",
        "nandri": "நன்றி",
        "nanri": "நன்றி",
        "tamzhi": "தமிழி",
        "tamizh": "தமிழ்",
        "tamil": "தமிழ்",
        "amma": "அம்மா",
        "appa": "அಪ್ಪா",
        "eppadi": "எப்படி",
        "epadi": "எப்படி",
        "sugam": "சுகம்",
        "sukam": "சுகம்",

        // Table I: varungal (வாருங்கள்)
        "varungal": "வாருங்கள்",
        "varungl": "வாருங்கள்",
        "vrungl": "வாருங்கள்",
        "vrngal": "வாருங்கள்",
        "varngal": "வாருங்கள்",

        // Table I: kanakkil (கணக்கில்)
        "kanakkil": "கணக்கில்",
        "kanakkl": "கணக்கில்",
        "kanakil": "கணக்கில்",
        "kankl": "கணக்கில்",
        "knakil": "கணக்கில்",
        "knkkil": "கணக்கில்",
        "knkil": "கணக்கில்",
        "knakl": "கணக்கில்",
        "knkkl": "கணக்கில்",
        "knkl": "கணக்கில்",

        // Table I: nillungal (நில்லுங்கள்)
        "nillungal": "நில்லுங்கள்",
        "nilungal": "நில்லுங்கள்",
        "nillngl": "நில்லுங்கள்",
        "nllungl": "நில்லுங்கள்",
        "nllngal": "நில்லுங்கள்",
        "nlngl": "நில்லுங்கள்",

        // Table I: yaarukku (யாருக்கு)
        "yaarukku": "யாருக்கு",
        "yarukku": "யாருக்கு",
        "yrukku": "யாருக்கு",
        "yrkku": "யாருக்கு",
        "yarkku": "யாருக்கு",
        "yarkk": "யாருக்கு",
        "yruku": "யாருக்கு",
        "yrkk": "யாருக்கு",
        "yrk": "யாருக்கு",

        // Table V Sentences
        "puthiya": "புதிய",
        "vedhantham": "வேதாந்தம்",
        "thorathil": "தூரத்தில்",
        "ulla": "உள்ள",
        "oru": "ஒரு",
        "grmamagm": "கிராமமாகும்",
        "avi": "அவை",
        "thenkoottai": "தேன்கூட்டை",
        "otha": "ஒத்த",
        "arugona": "அறுகோண",
        "vadivl": "வடிவில்",
        "araigal": "அறைகள்",
        "kondathaaga": "கொண்டதாக",
        "irukkum": "இருக்கும்"
    };

    // Asynchronous dataset loader variables (119k word mappings from training data)
    let datasetMap = null;
    let datasetKeys = [];
    let skeletonMap = {};
    let isDatasetLoading = false;
    let isDatasetLoaded = false;

    const autocompleteContainer = document.getElementById('nlp-autocomplete-container');

    // Asynchronous loading function
    async function loadDataset() {
        if (isDatasetLoaded || isDatasetLoading) return;
        isDatasetLoading = true;

        const statusText = document.querySelector('.playground-status');
        if (statusText) {
            statusText.innerHTML = '<span class="status-pulse-dot" style="background-color: var(--accent-secondary); animation: pulse 1s infinite;"></span> Loading Dataset (5.5MB)...';
        }
        
        outputDisplay.textContent = 'Initializing trained model dataset (5.5MB)... Please wait.';

        try {
            const response = await fetch('dataset_map.json');
            if (!response.ok) {
                throw new Error('Failed to load: ' + response.statusText);
            }
            datasetMap = await response.json();
            datasetKeys = Object.keys(datasetMap);

            // Build the consonant skeleton mapping database (maps vowel-less stems to target words)
            skeletonMap = {};
            for (let i = 0; i < datasetKeys.length; i++) {
                const key = datasetKeys[i];
                const skeleton = key.replace(/[aeiou]/g, "");
                if (skeleton) {
                    // Prefer longer Romanized key match (usually the fully spelled word)
                    if (!skeletonMap[skeleton] || key.length > skeletonMap[skeleton].keyLen) {
                        skeletonMap[skeleton] = {
                            tamil: datasetMap[key],
                            keyLen: key.length
                        };
                    }
                }
            }

            isDatasetLoaded = true;
            isDatasetLoading = false;

            if (statusText) {
                statusText.innerHTML = '<span class="status-pulse-dot"></span> Active Engine (Trained Model Loaded)';
            }
            
            // Re-run translation immediately upon loading dataset
            triggerTranslation();
        } catch (error) {
            console.error('Error loading dataset:', error);
            isDatasetLoading = false;
            if (statusText) {
                statusText.innerHTML = '<span class="status-pulse-dot" style="background-color: #ef4444;"></span> Active Engine (Fallback Mode)';
            }
            triggerTranslation();
        }
    }

    // Trigger dataset load on first focus, click, keydown, or hover on the sandbox
    const triggerEvents = ['focus', 'click', 'input', 'mouseenter'];
    triggerEvents.forEach(evtName => {
        inputField.addEventListener(evtName, loadDataset, { once: true });
    });

    // Dynamic autocomplete helper
    function updateAutocompleteSuggestions(query) {
        if (!isDatasetLoaded || !datasetMap || !autocompleteContainer) return;

        const words = query.split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase().trim();
        const lastWordSkeleton = lastWord.replace(/[aeiou]/g, "");

        // Only search if the last word is at least 2 characters long
        if (lastWord.length < 2) {
            autocompleteContainer.style.display = 'none';
            autocompleteContainer.innerHTML = '';
            return;
        }

        // Fast linear search over cached keys array (exits after 6 matches)
        const matches = [];
        
        // 1. Direct prefix matches (e.g. "van" -> "vanakkam")
        for (let i = 0; i < datasetKeys.length; i++) {
            if (datasetKeys[i].startsWith(lastWord)) {
                matches.push({ roman: datasetKeys[i], tamil: datasetMap[datasetKeys[i]] });
                if (matches.length >= 6) break;
            }
        }

        // 2. Vowel Omission prefix matches (e.g. "vn" -> "vanakkam")
        if (matches.length < 6 && lastWordSkeleton.length >= 2) {
            for (let i = 0; i < datasetKeys.length; i++) {
                const key = datasetKeys[i];
                const keySkeleton = key.replace(/[aeiou]/g, "");
                if (keySkeleton.startsWith(lastWordSkeleton)) {
                    if (!matches.some(m => m.roman === key)) {
                        matches.push({ roman: key, tamil: datasetMap[key] });
                        if (matches.length >= 6) break;
                    }
                }
            }
        }

        if (matches.length === 0) {
            autocompleteContainer.style.display = 'none';
            autocompleteContainer.innerHTML = '';
            return;
        }

        // Render matching chips
        autocompleteContainer.innerHTML = '';
        autocompleteContainer.style.display = 'flex';

        matches.forEach(match => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'nlp-autocomplete-chip';
            chip.innerHTML = `${match.tamil} <span class="roman-part">${match.roman}</span>`;
            
            chip.addEventListener('click', () => {
                // Replace the last word in the input box with this romanized word
                const lastSpaceIndex = inputField.value.lastIndexOf(' ');
                let baseText = '';
                if (lastSpaceIndex !== -1) {
                    baseText = inputField.value.substring(0, lastSpaceIndex + 1);
                }
                inputField.value = baseText + match.roman + ' ';
                
                // Hide autocomplete suggestions
                autocompleteContainer.style.display = 'none';
                autocompleteContainer.innerHTML = '';
                
                // Trigger translation
                triggerTranslation();
                inputField.focus();
            });
            
            autocompleteContainer.appendChild(chip);
        });
    }

    // Clean word mapping query (strip punctuation for match and restore it in output)
    function cleanAndTranslateWord(word) {
        if (!word) return "";

        // Extract leading/trailing punctuation
        const leadingPunctMatch = word.match(/^[.,\/#!$%\^&\*;:{}=\-_`~()?\"\'\[\]]+/g);
        const trailingPunctMatch = word.match(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"\'\[\]]+$/g);

        const leadingPunct = leadingPunctMatch ? leadingPunctMatch[0] : "";
        const trailingPunct = trailingPunctMatch ? trailingPunctMatch[0] : "";
        const cleanedWord = word.replace(/^[.,\/#!$%\^&\*;:{}=\-_`~()?\"\'\[\]]+|[.,\/#!$%\^&\*;:{}=\-_`~()?\"\'\[\]]+$/g, "");

        if (!cleanedWord) return word;

        let translated = "";
        
        // 1. Try fully trained external dataset direct match
        if (isDatasetLoaded && datasetMap && datasetMap[cleanedWord]) {
            translated = datasetMap[cleanedWord];
        }
        // 2. Try default paper shorthands direct match
        else if (SHORTHAND_MAP[cleanedWord]) {
            translated = SHORTHAND_MAP[cleanedWord];
        }
        // 3. VOWEL OMISSION: Check mapping consonant skeletons of Romanized input to native Tamil
        else {
            const skeleton = cleanedWord.replace(/[aeiou]/g, "");
            if (isDatasetLoaded && skeletonMap && skeletonMap[skeleton]) {
                translated = skeletonMap[skeleton].tamil;
            } else {
                // Fallback: Check SHORTHAND_MAP keys for consonant skeleton matches
                let shorthandMatch = "";
                const shorthandKeys = Object.keys(SHORTHAND_MAP);
                for (let i = 0; i < shorthandKeys.length; i++) {
                    if (shorthandKeys[i].replace(/[aeiou]/g, "") === skeleton) {
                        shorthandMatch = SHORTHAND_MAP[shorthandKeys[i]];
                        break;
                    }
                }
                
                if (shorthandMatch) {
                    translated = shorthandMatch;
                } else {
                    // 4. Fallback: phonetic rule-based transliterator
                    translated = runSequentialTransliterator(cleanedWord);
                }
            }
        }

        return leadingPunct + translated + trailingPunct;
    }

    // Core rule-based phonetic engine (TransliteratorLogic.py sequential logic)
    function runSequentialTransliterator(wordVal) {
        const vowels = [
            "aa", "a", "a", "oo", "o", "ee", "e", "uu", "u", "ii", "i", "A",
            "a\\)", "i\\", "II", "u\\)", "u", "E", "e\\", "O", "o\\)", "ai)", "au", "ah",
            "A", "e", "u", "o", "I"
        ];
        const vowelsUni = [
            "ஆ", "அ", "அ", "ஓ", "ஒ", "ஏ", "எ", "ஊ", "உ", "ஈ", "இ", "அ",
            "ஆ", "ஈ", "ஈ", "ஊ", "ு", "எ", "ஏ", "ஒ", "ஓ", "ஐ", "ஔ", "ஃ",
            "அ", "எ", "உ", "ஒ", "ஐ"
        ];
        const vowelModifiersUni = [
            "ா", "", "ா", "ோ", "ொ", "ே", "ெ", "ூ", "ு", "ீ", "ி", "",
            "ா", "ீ", "ீ", "ூ", "ு", "ெ", "ே", "ொ", "ோ", "ை", "ௌ", "ஃ",
            "ா", "ெ", "ு", "ொ", "ை"
        ];

        const consonants = [
            "k", "g", "ng", "c", "ch", "s", "sh\\", "gn", "t", "d", "N", "th", "d", "nh", "n",
            "p", "f", "b", "bh", "m", "y", "r", "r", "l", "l", "zh", "v", "w", "j", "sh", "s", "h", "sh", "ks"
        ];
        const consonantsUni = [
            "க", "க", "ங", "ச", "ச", "ச", "ச\\", "ஞ", "ட", "ட", "ண", "த", "த", "ந", "ன",
            "ப", "ப", "ப", "ப", "ம", "ய", "ர", "ற", "ல", "ள", "ழ", "வ", "w", "ஜ", "ஷ", "ஸ", "ஹ", "ஶ", "க்ஷ"
        ];

        const specialChar = ["sri"];
        const specialCharUni = ["ஸ்ரீ"];

        // Special characters replacement
        for (let i = 0; i < specialChar.length; i++) {
            wordVal = wordVal.split(specialChar[i]).join(specialCharUni[i]);
        }

        // Consonants + Special characters
        for (let i = 0; i < specialCharUni.length; i++) {
            for (let j = 0; j < consonants.length; j++) {
                let s = consonants[j] + specialChar[i];
                let v = consonantsUni[j] + vowelModifiersUni[0] + specialCharUni[i];
                wordVal = wordVal.split(s).join(v);
            }
        }

        // Consonants + Rakaransha + Vowels
        for (let j = 0; j < consonants.length; j++) {
            for (let i = 0; i < vowels.length; i++) {
                let s = consonants[j] + "r" + vowels[i];
                let v = consonantsUni[j] + "்ரு" + vowelModifiersUni[i];
                wordVal = wordVal.split(s).join(v);
            }
            let s = consonants[j] + "r";
            let v = consonantsUni[j] + "்ரு";
            wordVal = wordVal.split(s).join(v);
        }

        // Consonants + Vowel modifiers (first 12 vowels)
        const nVowels = 12;
        for (let i = 0; i < consonants.length; i++) {
            for (let j = 0; j < nVowels; j++) {
                let s = consonants[i] + vowels[j];
                let v = consonantsUni[i] + vowelModifiersUni[j];
                wordVal = wordVal.split(s).join(v);
            }
        }

        // Consonants + HAL (pulli)
        for (let i = 0; i < consonants.length; i++) {
            wordVal = wordVal.split(consonants[i]).join(consonantsUni[i] + "்");
        }

        // Vowels alone
        for (let i = 0; i < vowels.length; i++) {
            wordVal = wordVal.split(vowels[i]).join(vowelsUni[i]);
        }

        return wordVal;
    }

    // Sequential rule-based transliterator engine matching TransliteratorLogic.py
    function translateText(text) {
        if (!text) return "";
        let words = text.toLowerCase().trim().split(/\s+/);
        let translatedWords = words.map(cleanAndTranslateWord);
        return translatedWords.join(" ");
    }

    // Helper to trigger translation manually
    function triggerTranslation() {
        const query = inputField.value;
        if (query.trim() === '') {
            outputDisplay.textContent = '... Type above or click suggestions ...';
            outputDisplay.classList.remove('has-val');
            if (autocompleteContainer) {
                autocompleteContainer.style.display = 'none';
                autocompleteContainer.innerHTML = '';
            }
        } else {
            const transliterated = translateText(query);
            outputDisplay.textContent = transliterated;
            outputDisplay.classList.add('has-val');

            // Trigger dynamic autocomplete suggestions search
            updateAutocompleteSuggestions(query);
        }
    }

    // Run transliteration on user input
    inputField.addEventListener('input', triggerTranslation);

    // Handle suggestion chips clicks
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.getAttribute('data-val');
            inputField.value = val;
            
            // Trigger manual input event
            triggerTranslation();
            inputField.focus();
        });
    });
}

/* ==========================================
   14. Avatar Interactive Speech & Intro
   ========================================== */
function initAvatarIntro() {
    const bubble = document.getElementById('avatar-bubble');
    const textEl = document.getElementById('bubble-text');
    const nextBtn = document.getElementById('bubble-next-btn');
    const closeBtn = document.getElementById('bubble-close-btn');
    const audioBtn = document.getElementById('bubble-audio-btn');
    const triggerBtn = document.getElementById('avatar-trigger-btn');

    if (!bubble || !textEl || !nextBtn || !closeBtn || !audioBtn || !triggerBtn) return;

    // Intro script slides
    const slides = [
        {
            text: "Hi there! I'm <strong>Anuja Herath</strong>. I'm a Technical Data Analyst & Data Analytics Engineer. Welcome to my portfolio! 👋",
            speech: "Hi there! I'm Anuja Herath. I'm a Technical Data Analyst and Data Analytics Engineer. Welcome to my portfolio!"
        },
        {
            text: "I recently graduated with my <strong>MSc in Data Science & Analytics with Merit</strong> from the University of Westminster in London! 🎓",
            speech: "I recently graduated with my MSc in Data Science and Analytics with Merit from the University of Westminster in London!"
        },
        {
            text: "My research paper, <strong>TAMZHI</strong> (a reverse-transliteration system mapping shorthand Tanglish to Tamil script), won a Bronze award! 🏆",
            speech: "My research paper, TAMZHI, a reverse transliteration system mapping shorthand Tanglish to Tamil script, won a Bronze award!"
        },
        {
            text: "I build high-throughput backend APIs and design data science systems. Check out my projects, test the TAMZHI sandbox, or download my CV! 🚀",
            speech: "I build high-throughput backend APIs and design data science systems. Check out my projects, test the TAMZHI sandbox, or download my CV!"
        }
    ];

    let currentSlide = 0;
    let isTyping = false;
    let typingTimer = null;
    let speechSynthUtterance = null;
    let isSpeaking = false;

    const wrapper = bubble.closest('.avatar-card-wrapper');

    // Show bubble
    function showIntro() {
        bubble.classList.add('active');
        if (wrapper) wrapper.classList.add('bubble-active');
        currentSlide = 0;
        renderSlide();
    }

    // Hide bubble
    function hideIntro() {
        stopSpeech();
        bubble.classList.remove('active');
        if (wrapper) wrapper.classList.remove('bubble-active');
        if (typingTimer) clearTimeout(typingTimer);
        isTyping = false;
    }

    // Typewriter effect inside the speech bubble
    function typeText(htmlText, rawText) {
        if (typingTimer) clearTimeout(typingTimer);
        textEl.innerHTML = '';
        isTyping = true;
        
        // Split text by HTML tags to type them correctly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        const nodes = Array.from(tempDiv.childNodes);
        
        let nodeIndex = 0;
        let charIndex = 0;
        let currentText = '';

        function typeChar() {
            if (nodeIndex >= nodes.length) {
                isTyping = false;
                return;
            }

            const node = nodes[nodeIndex];
            if (node.nodeType === Node.TEXT_NODE) {
                if (charIndex < node.textContent.length) {
                    currentText += node.textContent[charIndex];
                    textEl.innerHTML = currentText;
                    charIndex++;
                    typingTimer = setTimeout(typeChar, 18);
                } else {
                    nodeIndex++;
                    charIndex = 0;
                    typeChar();
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const outerHTML = node.outerHTML;
                const tagContent = node.innerHTML;
                const tagName = node.tagName.toLowerCase();
                
                let elementText = `<${tagName}>`;
                let innerCharIndex = 0;
                
                function typeElementChar() {
                    if (innerCharIndex < tagContent.length) {
                        elementText += tagContent[innerCharIndex];
                        textEl.innerHTML = currentText + elementText + `</${tagName}>`;
                        innerCharIndex++;
                        typingTimer = setTimeout(typeElementChar, 18);
                    } else {
                        currentText += outerHTML;
                        textEl.innerHTML = currentText;
                        nodeIndex++;
                        charIndex = 0;
                        typeChar();
                    }
                }
                typeElementChar();
            }
        }

        typeChar();
    }

    // Render current slide
    function renderSlide() {
        stopSpeech();
        const slide = slides[currentSlide];
        
        typeText(slide.text, slide.speech);
        
        if (currentSlide === slides.length - 1) {
            nextBtn.innerHTML = 'Finish <i class="fa-solid fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fa-solid fa-chevron-right"></i>';
        }
    }

    // Cycle slides
    function nextSlide() {
        if (isTyping) {
            if (typingTimer) clearTimeout(typingTimer);
            textEl.innerHTML = slides[currentSlide].text;
            isTyping = false;
            return;
        }

        if (currentSlide < slides.length - 1) {
            currentSlide++;
            renderSlide();
        } else {
            hideIntro();
        }
    }

    // Web Speech API Synthesis
    function speakText(text) {
        stopSpeech();
        
        if ('speechSynthesis' in window) {
            speechSynthUtterance = new SpeechSynthesisUtterance(text);
            
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Tessa')));
            if (femaleVoice) {
                speechSynthUtterance.voice = femaleVoice;
            }
            
            speechSynthUtterance.rate = 1.05;
            
            speechSynthUtterance.onstart = () => {
                isSpeaking = true;
                audioBtn.classList.add('playing');
                audioBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i>';
                audioBtn.setAttribute('title', 'Stop speaking');
            };
            
            speechSynthUtterance.onend = () => {
                resetAudioBtnState();
            };

            speechSynthUtterance.onerror = () => {
                resetAudioBtnState();
            };

            window.speechSynthesis.speak(speechSynthUtterance);
        } else {
            alert("Voice synthesis is not supported on this browser.");
        }
    }

    function stopSpeech() {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        resetAudioBtnState();
    }

    function resetAudioBtnState() {
        isSpeaking = false;
        audioBtn.classList.remove('playing');
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        audioBtn.setAttribute('title', 'Speak Intro');
    }

    // Toggle speech audio play/stop
    function toggleSpeech() {
        if (isSpeaking) {
            stopSpeech();
        } else {
            const slide = slides[currentSlide];
            speakText(slide.speech);
        }
    }

    // Event Listeners
    triggerBtn.addEventListener('click', () => {
        if (bubble.classList.contains('active')) {
            hideIntro();
        } else {
            showIntro();
        }
    });

    nextBtn.addEventListener('click', nextSlide);
    closeBtn.addEventListener('click', hideIntro);
    audioBtn.addEventListener('click', toggleSpeech);

    // Trigger on load after delay to draw attention
    setTimeout(() => {
        if (!sessionStorage.getItem('avatarIntroShown')) {
            showIntro();
            sessionStorage.setItem('avatarIntroShown', 'true');
        }
    }, 1500);

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {};
    }
}
