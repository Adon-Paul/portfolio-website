// Scroll-triggered reveal animations using Intersection Observer
(function initScrollReveal() {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before fully in view
        threshold: 0.15
    };

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Optionally unobserve after reveal (one-time animation)
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });
})();

// Smooth scroll for anchor links
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();

// Staggered reveal for child elements
(function initStaggerReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var staggerContainers = document.querySelectorAll('.stagger-reveal');

    var staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var children = entry.target.querySelectorAll('.stagger-item');
                children.forEach(function (child, index) {
                    child.style.transitionDelay = (index * 0.08) + 's';
                    child.classList.add('stagger-visible');
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    staggerContainers.forEach(function (container) {
        staggerObserver.observe(container);
    });
})();
