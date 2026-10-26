
/* =====================================
   QUEUESKI REVIEWER - APP JAVASCRIPT
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    //        ELEMENT REFERENCES
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const themeToggle = document.getElementById("themeToggle");
    const homeButton = document.getElementById("homeButton");
    const progressFill = document.getElementById("progressFill");
    const backToTop = document.getElementById("backToTop");
    const searchInput = document.getElementById("searchInput");
    const searchResultCount = document.getElementById("searchResultCount");

    const navLinks = document.querySelectorAll(".nav-link");
    const searchableElements = document.querySelectorAll(".searchable");
    const sections = document.querySelectorAll("main section[id]");

    // =====================================
    //        SIDEBAR MENU
    // =====================================

    function openSidebar() {
        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        document.body.classList.remove("sidebar-open");
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            document.body.classList.toggle("sidebar-open");
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", closeSidebar);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeSidebar();
        }
    });

    // =====================================
    //        DARK / LIGHT THEME
    // =====================================

    const savedTheme = localStorage.getItem("queueski-reviewer-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        document.documentElement.dataset.theme = savedTheme;
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const isDark =
            document.documentElement.dataset.theme === "dark";

        themeToggle.textContent = isDark ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        themeToggle.setAttribute(
            "title",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark =
                document.documentElement.dataset.theme === "dark";

            const nextTheme = isDark ? "light" : "dark";

            document.documentElement.dataset.theme = nextTheme;

            localStorage.setItem(
                "queueski-reviewer-theme",
                nextTheme
            );

            updateThemeButton();
        });
    }

    // =====================================
    //        HOME BUTTON
    // =====================================

    if (homeButton) {
        homeButton.addEventListener("click", () => {
            const homeSection = document.getElementById("home");

            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            closeSidebar();
        });
    }

    // =====================================
    //        READING PROGRESS BAR
    // =====================================

    function updateReadingProgress() {
        if (!progressFill) return;

        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressFill.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener("scroll", updateReadingProgress, {
        passive: true
    });

    window.addEventListener("resize", updateReadingProgress);

    updateReadingProgress();

    // =====================================
    //        BACK TO TOP BUTTON
    // =====================================

    function updateBackToTop() {
        if (!backToTop) return;

        backToTop.hidden = window.scrollY < 300;
    }

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        window.addEventListener("scroll", updateBackToTop, {
            passive: true
        });

        updateBackToTop();
    }

    // =====================================
    //        ACTIVE NAVIGATION LINK
    // =====================================

    function updateActiveNavigation() {
        let currentSection = "";

        const scrollPosition = window.scrollY + 150;

        sections.forEach((section) => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href");

            const isActive =
                target === `#${currentSection}` &&
                currentSection !== "";

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    window.addEventListener("resize", updateActiveNavigation);

    updateActiveNavigation();

    // =====================================
    //        SEARCH REVIEWER CONTENT
    // =====================================

    function performSearch() {
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        let matchingElements = 0;

        searchableElements.forEach((element) => {
            const content = element.textContent.toLowerCase();
            const matches = content.includes(query);

            element.hidden = query !== "" && !matches;

            if (query !== "" && matches) {
                matchingElements++;
            }
        });

        if (searchResultCount) {
            if (query === "") {
                searchResultCount.textContent = "";
            } else if (matchingElements === 0) {
                searchResultCount.textContent =
                    "No matching content found.";
            } else {
                searchResultCount.textContent =
                    `${matchingElements} matching item(s) found.`;
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", performSearch);

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                searchInput.value = "";
                performSearch();
                searchInput.blur();
            }
        });
    }

    // =====================================
    //        COPY CODE BUTTONS
    // =====================================

    async function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const temporaryTextarea = document.createElement("textarea");

        temporaryTextarea.value = text;
        temporaryTextarea.setAttribute("readonly", "");
        temporaryTextarea.style.position = "fixed";
        temporaryTextarea.style.opacity = "0";
        temporaryTextarea.style.pointerEvents = "none";

        document.body.appendChild(temporaryTextarea);

        temporaryTextarea.select();
        temporaryTextarea.setSelectionRange(
            0,
            temporaryTextarea.value.length
        );

        const successful = document.execCommand("copy");

        temporaryTextarea.remove();

        if (!successful) {
            throw new Error("Copy command was unsuccessful.");
        }
    }

    document.querySelectorAll(".copy-button").forEach((button) => {
        button.addEventListener("click", async () => {
            const codeContainer = button.closest(".code-box");

            const codeElement = codeContainer
                ? codeContainer.querySelector("pre code")
                : null;

            if (!codeElement) {
                button.textContent = "Code not found";
                return;
            }

            const originalText =
                button.dataset.originalText || button.textContent;

            button.dataset.originalText = originalText;
            button.disabled = true;

            try {
                await copyTextToClipboard(codeElement.textContent);

                button.textContent = "Copied!";

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1500);
            } catch (error) {
                console.error("Unable to copy code:", error);

                button.textContent = "Copy failed";

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }
        });
    });

    // =====================================
    //        INITIALIZE REVIEWER
    // =====================================

    console.log("QUEUESKI Reviewer initialized successfully.");
});
