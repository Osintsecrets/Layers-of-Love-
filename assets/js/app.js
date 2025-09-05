// ===== i18n dictionary =====
const I18N = {
  en: {
    brand: "Layers of Love",
    heroLine: "make something gentle today.",
    "cta.ritual": "Start 2-minute ritual",
    "cta.prompts": "Explore prompts",
    "nav.today": "Today",
    "nav.prompts": "Prompts",
    "nav.create": "Create",
    "nav.paths": "Paths",
    "nav.gallery": "Gallery",
    "nav.circle": "Circle",
    "nav.profile": "Profile",
    "pill1.title": "Daily Prompts",
    "pill1.body": "Soft, mindful invitations for writing, sketching, or voice notes.",
    "pill2.title": "Gentle Rituals",
    "pill2.body": "Two-minute breath and reflect moments to return to center.",
    "pill3.title": "Your Gallery",
    "pill3.body": "Private by default—your quiet wins, saved with care."
  },
  he: {
    brand: "שכבות של אהבה",
    heroLine: "ליצור משהו עדין היום.",
    "cta.ritual": "התחילי טקס של שתי דקות",
    "cta.prompts": "גלי פרומפטים",
    "nav.today": "היום",
    "nav.prompts": "פרומפטים",
    "nav.create": "יצירה",
    "nav.paths": "מסלולים",
    "nav.gallery": "גלריה",
    "nav.circle": "מעגל",
    "nav.profile": "פרופיל",
    "pill1.title": "פרומפטים יומיים",
    "pill1.body": "הזמנות עדינות לכתיבה, לשרטוט או להקלטת קול.",
    "pill2.title": "טקסים עדינים",
    "pill2.body": "נשימה ורפלקציה של שתי דקות כדי לחזור למרכז.",
    "pill3.title": "הגלריה שלך",
    "pill3.body": "פרטי כברירת מחדל—שימור הניצחונות השקטים שלך."
  }
};

const langSwitch = document.getElementById("langSwitch");
const hamburger = document.getElementById("hamburger");
const mainMenu = document.getElementById("mainMenu");

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  const brand = document.querySelector(".brand-title");
  if (brand && dict["brand"]) brand.textContent = dict["brand"];

  localStorage.setItem("lol-lang", lang);
  if (langSwitch) langSwitch.checked = (lang === "he");
}

applyLang(localStorage.getItem("lol-lang") || (navigator.language?.startsWith("he") ? "he" : "en"));

langSwitch?.addEventListener("change", (e) => {
  applyLang(e.target.checked ? "he" : "en");
});

// Hamburger toggle
function toggleMenu(open) {
  const willOpen = typeof open === "boolean" ? open : !mainMenu.classList.contains("open");
  mainMenu.classList.toggle("open", willOpen);
  hamburger?.setAttribute("aria-expanded", String(willOpen));
}
hamburger?.addEventListener("click", () => toggleMenu());
document.addEventListener("click", (e) => {
  if (!mainMenu.contains(e.target) && e.target !== hamburger) toggleMenu(false);
});

