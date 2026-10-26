// =====================================
//       QUEUESKI REVIEWER SCRIPT
// =====================================
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
  try {
    localStorage.setItem("queueski-reviewer-theme", isDark ? "dark" : "light");
  } catch (error) {
    // Theme still works for the current page if storage is unavailable.
  }
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("queueski-reviewer-theme") || "light";
} catch (error) {
  // Use the default light theme if storage is unavailable.
}
setTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const searchableItems = document.querySelectorAll(".searchable");
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const matches = item.textContent.toLowerCase().includes(query);
    item.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  // Hide section headings when none of their content matches.
  document.querySelectorAll(".study-section").forEach((section) => {
    const visibleItems = [...section.querySelectorAll(".searchable")]
      .some((item) => !item.hidden);
    section.hidden = query !== "" && !visibleItems;
  });

  document.querySelector(".hero").hidden = query !== "";
  noResults.hidden = query === "" || visibleCount > 0;
});

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.closest(".code-card").querySelector("code").innerText;
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied!";
      setTimeout(() => { button.textContent = "Copy"; }, 1200);
    } catch (error) {
      button.textContent = "Copy unavailable";
      setTimeout(() => { button.textContent = "Copy"; }, 1400);
    }
  });
});
