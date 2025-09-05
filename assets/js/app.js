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
    "pill3.body": "Private by default—your quiet wins, saved with care.",
    "nav.podcasts": "Podcasts",
    "nav.social": "Social Media",
    "nav.daily": "Daily Inspiration",
    "nav.about": "About",
    "podcasts.title": "Podcasts",
    "podcasts.sub": "Listen to gentle, honest conversations about creativity, motherhood, and healing.",
    "social.title": "Social Media",
    "social.sub": "Find Avital’s art and updates here.",
    "daily.title": "Daily Inspiration",
    "daily.sub": "A gentle note from Avital, updated over time.",
    "about.title": "Who is Avital?",
    "about.body":
      "A woman who embodies the true meaning of femininity and motherhood. A woman who taps into what it means to be a woman in today's modern day and age, and still connects to the women who came before her — to body and soul — in ways that heal and rejuvenate."
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
    "pill3.body": "פרטי כברירת מחדל—הנצחונות השקטים שלך.",
    "nav.podcasts": "פודקאסטים",
    "nav.social": "רשתות חברתיות",
    "nav.daily": "השראה יומית",
    "nav.about": "אודות",
    "podcasts.title": "פודקאסטים",
    "podcasts.sub": "שיחות עדינות וכנות על יצירה, אמהות וריפוי.",
    "social.title": "רשתות חברתיות",
    "social.sub": "כאן תמצאו את האמנות והעדכונים של אביטל.",
    "daily.title": "השראה יומית",
    "daily.sub": "מילים עדינות מאביטל, מתעדכנות עם הזמן.",
    "about.title": "מי היא אביטל?",
    "about.body":
      "אישה שמגלמת את המשמעות האמיתית של נשיות ואימהוּת. אישה שמתחברת למהות האישה בעידן המודרני, ועדיין קשובה לנשים שלפניה — לגוף ולנפש — בדרכים שמרפאות ומחדשות."
  }
};

const langSwitch = document.getElementById("langSwitch");
const hamburger = document.getElementById("hamburger");
const mainMenu = document.getElementById("mainMenu");

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  const brand = document.querySelector(".brand-title");
  if (brand && dict["brand"]) brand.textContent = dict["brand"];

  localStorage.setItem("lol-lang", lang);
  if (langSwitch) langSwitch.checked = lang === "he";
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

// Simple typewriter effect
function typeText(el, text, speed = 80) {
  el.textContent = "";
  el.classList.add("typing");
  text.split("").forEach((ch, i) => {
    setTimeout(() => {
      el.textContent += ch;
    }, speed * i);
  });
  setTimeout(() => {
    el.classList.remove("typing");
  }, speed * text.length);
}

// Load the latest inspiration into the homepage hero (if Supabase is configured)
async function loadInspiration() {
  const el = document.querySelector("[data-i18n='heroLine']");
  if (!el) return;

  let text = el.textContent;
  try {
    const { sb: sbPublic } = await import("./supa.js");
    const client = await sbPublic();
    const { data, error } = await client
      .from("inspirations")
      .select("text,date")
      .order("date", { ascending: false })
      .limit(1);
    if (!error && data && data[0]?.text) {
      text = data[0].text;
    }
  } catch (e) {
    // If supa.js or the table aren't available, just keep the default hero line.
  }
  typeText(el, text);
}
loadInspiration();

// Populate the /inspiration.html page with a list (if present and Supabase is configured)
(async () => {
  const onInspirationPage =
    location.pathname.endsWith("/inspiration.html") ||
    location.pathname.endsWith("inspiration.html");

  if (!onInspirationPage) return;

  try {
    const { sb: sbPublic } = await import("./supa.js").catch(() => ({}));
    if (!sbPublic) return; // no supabase: skip
    const client = await sbPublic();
    const { data, error } = await client
      .from("inspirations")
      .select("text,date")
      .order("date", { ascending: false })
      .limit(30);
    if (error || !data) return;

    const list = document.getElementById("inspList");
    const fb = document.getElementById("inspFallback");
    if (list && fb) fb.remove();

    data.forEach((row) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${row.date}</h3><p>${row.text}</p>`;
      list?.appendChild(card);
    });
  } catch (_) {
    /* silent */
  }
})();

// Gentle entrance animation for cards/pills
window.addEventListener('load', () => {
  document.querySelectorAll('.pill, .card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity .36s ease, transform .36s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 60 + i * 70);
    });
  });
});
