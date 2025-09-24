const yearElement = document.getElementById("year");

if (yearElement) {
    const now = new Date();
    yearElement.textContent = now.getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!prefersReducedMotion.matches) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.3,
        }
    );

    document
        .querySelectorAll(".pillars article, .project-card, .lab article, .testimonial-grid figure, .updates article")
        .forEach((el) => {
            el.classList.add("reveal");
            observer.observe(el);
        });
}
