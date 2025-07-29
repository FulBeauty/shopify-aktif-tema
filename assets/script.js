document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effects
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(139, 111, 77, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 20px rgba(139, 111, 77, 0.08)';
            }
        });
    }

    // WhatsApp integration
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            // Track WhatsApp clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'WhatsApp',
                    event_label: 'Float Button'
                });
            }
        });
    }

    // ===== FAQ FUNCTIONALITY ===== 
    window.toggleFaq = function(button) {
        const faqItem = button.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = button.querySelector('.faq-icon');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                const otherAnswer = item.querySelector('.faq-answer');
                const otherButton = item.querySelector('.faq-question');
                const otherIcon = item.querySelector('.faq-icon');
                
                if (otherAnswer) otherAnswer.classList.remove('active');
                if (otherButton) otherButton.classList.remove('active');
                if (otherIcon) otherIcon.textContent = '+';
            }
        });
        
        // Toggle current FAQ item
        if (answer && answer.classList.contains('active')) {
            answer.classList.remove('active');
            button.classList.remove('active');
            if (icon) icon.textContent = '+';
        } else {
            if (answer) answer.classList.add('active');
            button.classList.add('active');
            if (icon) icon.textContent = '×';
        }
    };

    // FAQ Category Filtering
    window.showFaqCategory = function(category) {
        const faqItems = document.querySelectorAll('.faq-item');
        const tabs = document.querySelectorAll('.tab');
        
        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        // Show/hide FAQ items
        let visibleCount = 0;
        faqItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
        
        // Close all open FAQs when filtering
        document.querySelectorAll('.faq-answer.active').forEach(answer => {
            answer.classList.remove('active');
            const question = answer.previousElementSibling;
            if (question) {
                question.classList.remove('active');
                const icon = question.querySelector('.faq-icon');
                if (icon) icon.textContent = '+';
            }
        });
    };

    // FAQ Search Functionality
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const questionSpan = item.querySelector('.faq-question span');
                const answerDiv = item.querySelector('.faq-answer');
                
                if (questionSpan && answerDiv) {
                    const question = questionSpan.textContent.toLowerCase();
                    const answer = answerDiv.textContent.toLowerCase();
                    
                    if (question.includes(searchTerm) || answer.includes(searchTerm) || searchTerm === '') {
                        item.style.display = 'block';
                        visibleCount++;
                        
                        // Highlight search term
                        if (searchTerm !== '') {
                            highlightSearchTerm(item, searchTerm);
                        } else {
                            removeHighlight(item);
                        }
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            
            // Show/hide no results message
            const noResults = document.getElementById('noResults');
            if (noResults) {
                noResults.style.display = visibleCount === 0 && searchTerm !== '' ? 'block' : 'none';
            }
            
            // Reset category filter when searching
            if (searchTerm !== '') {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                const firstTab = document.querySelector('.tab');
                if (firstTab) firstTab.classList.add('active');
            }
        });
    }

    // Highlight search terms
    function highlightSearchTerm(item, term) {
        const question = item.querySelector('.faq-question span');
        const answer = item.querySelector('.faq-answer');
        
        [question, answer].forEach(element => {
            if (element) {
                const originalText = element.dataset.originalText || element.innerHTML;
                element.dataset.originalText = originalText;
                
                const regex = new RegExp(`(${term})`, 'gi');
                element.innerHTML = originalText.replace(regex, '<mark style="background: yellow; padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>');
            }
        });
    }

    // Remove highlight
    function removeHighlight(item) {
        const question = item.querySelector('.faq-question span');
        const answer = item.querySelector('.faq-answer');
        
        [question, answer].forEach(element => {
            if (element && element.dataset.originalText) {
                element.innerHTML = element.dataset.originalText;
                delete element.dataset.originalText;
            }
        });
    }

    // ===== TAB FUNCTIONALITY =====
    window.showTab = function(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Add active class to clicked tab
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        // Track tab interactions
        if (typeof gtag !== 'undefined') {
            gtag('event', 'tab_interaction', {
                'event_category': 'engagement',
                'event_label': tabName,
                'value': 1
            });
        }
    };

    // ===== FORM VALIDATION =====
    const contactForm = document.querySelector('form[action*="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const nameField = contactForm.querySelector('#ContactFormName, input[name="contact[name]"]');
            const emailField = contactForm.querySelector('#ContactFormEmail, input[name="contact[email]"]');
            const subjectField = contactForm.querySelector('#ContactFormSubject, select[name="contact[subject]"]');
            const messageField = contactForm.querySelector('#ContactFormMessage, textarea[name="contact[body]"]');
            const honeyField = contactForm.querySelector('#ContactFormHoney, input[name="contact[honey]"]');
            
            // Spam protection
            if (honeyField && honeyField.value !== '') {
                e.preventDefault();
                return false;
            }
            
            // Basic validation
            const name = nameField ? nameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
            const subject = subjectField ? subjectField.value : '';
            const message = messageField ? messageField.value.trim() : '';
            
            if (!name || !email || !subject || !message) {
                alert('Lütfen tüm zorunlu alanları doldurun.');
                e.preventDefault();
                return false;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Lütfen geçerli bir e-posta adresi girin.');
                e.preventDefault();
                return false;
            }
        });
        
        // Character counter for message field
        const messageField = contactForm.querySelector('#ContactFormMessage, textarea[name="contact[body]"]');
        if (messageField) {
            const maxLength = 1000;
            const counter = document.createElement('div');
            counter.style.cssText = 'font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; text-align: right;';
            messageField.parentNode.appendChild(counter);
            
            function updateCounter() {
                const remaining = maxLength - messageField.value.length;
                counter.textContent = `${messageField.value.length}/${maxLength} karakter`;
                counter.style.color = remaining < 50 ? 'var(--warning-color)' : 'var(--text-secondary)';
            }
            
            messageField.addEventListener('input', updateCounter);
            messageField.maxLength = maxLength;
            updateCounter();
        }
    }

    // ===== ANIMATIONS ON SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe page templates and feature cards
    document.querySelectorAll('.page-template, .feature-card, .faq-item').forEach(element => {
        observer.observe(element);
    });

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all open FAQs
            document.querySelectorAll('.faq-answer.active').forEach(answer => {
                answer.classList.remove('active');
                const question = answer.previousElementSibling;
                if (question) {
                    question.classList.remove('active');
                    const icon = question.querySelector('.faq-icon');
                    if (icon) icon.textContent = '+';
                }
            });
        }
    });

    // ===== ANALYTICS TRACKING =====
    // Track FAQ interactions
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const questionSpan = this.querySelector('span');
            if (questionSpan) {
                const questionText = questionSpan.textContent;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'faq_interaction', {
                        'event_category': 'engagement',
                        'event_label': questionText.substring(0, 50),
                        'value': 1
                    });
                }
            }
        });
    });

    // Track CTA button clicks
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'conversion',
                    'event_label': buttonText,
                    'value': 1
                });
            }
        });
    });

    // ===== PRIVACY POLICY SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Cookie preferences modal (simple version)
    window.showCookiePreferences = function() {
        alert('Çerez tercih merkezi yakında aktif olacak. Şu an için tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.');
    };

    // ===== PAGE LOAD PERFORMANCE =====
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.message, 'at', e.filename, ':', e.lineno);
    });

    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%cFulBeauty Theme Loaded Successfully! 🎉', 'color: #8B6F4D; font-size: 16px; font-weight: bold;');
    console.log('%cAll interactive features are ready.', 'color: #6B8E5A; font-size: 12px;');
});