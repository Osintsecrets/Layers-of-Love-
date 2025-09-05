import { sb, fmtErr } from "./supa.js";
import { HER_UUID } from "./config.js";

/** UI refs */
const loginBtn = document.getElementById("loginPasskey");
const logoutBtn = document.getElementById("logout");
const authState = document.getElementById("authState");

const inspText = document.getElementById("inspText");
const postInspirationBtn = document.getElementById("postInspiration");
const inspMsg = document.getElementById("inspMsg");

const vidTitle = document.getElementById("vidTitle");
const vidUrl = document.getElementById("vidUrl");
const addVideoBtn = document.getElementById("addVideo");
const vidMsg = document.getElementById("vidMsg");

function ok(msg){ inspMsg.textContent = msg; inspMsg.className = "ok"; }
function err(el,msg){ el.textContent = msg; el.className = "danger"; }

/** Auth */
async function refreshAuthUI() {
  const client = await sb();
  const { data: { user } } = await client.auth.getUser();
  if (user) {
    authState.textContent = `Signed in as ${user.email || user.id}`;
    // Only HER_UUID can see posting controls
    const isHer = user.id === HER_UUID;
    postInspirationBtn.disabled = !isHer;
    addVideoBtn.disabled = !isHer;
    inspText.disabled = !isHer;
    vidTitle.disabled = !isHer;
    vidUrl.disabled = !isHer;
    if (!isHer) {
      authState.textContent += " (view-only; not authorized to post)";
    }
  } else {
    authState.textContent = "Not signed in";
    [postInspirationBtn, addVideoBtn, inspText, vidTitle, vidUrl].forEach(el => el.disabled = true);
  }
}

loginBtn?.addEventListener("click", async () => {
  const client = await sb();
  try {
    // Try passkey first; if unavailable, fallback to magic-link prompt
    const { data: passkey } = await client.auth.signInWithSSO({ domain: "passkeys" }).catch(() => ({ data: null }));
    if (!passkey) {
      const email = prompt("Enter your email to receive a sign-in link:");
      if (!email) return;
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
      if (error) throw error;
      alert("Check your email for a magic link. After opening it, return to this page.");
    }
  } catch (e) {
    alert("Sign-in failed: " + fmtErr(e));
  } finally {
    setTimeout(refreshAuthUI, 800);
  }
});

logoutBtn?.addEventListener("click", async () => {
  const client = await sb();
  await client.auth.signOut();
  await refreshAuthUI();
});

/** Post Inspiration of the Day */
postInspirationBtn?.addEventListener("click", async () => {
  const client = await sb();
  const text = (inspText.value || "").trim();
  if (!text) return err(inspMsg, "Please write something.");
  try {
    const today = new Date().toISOString().slice(0,10);
    const { error } = await client
      .from("inspirations")
      .upsert({ date: today, text, author_id: HER_UUID }, { onConflict: "date" });
    if (error) throw error;
    ok("Saved today’s inspiration.");
  } catch (e) {
    err(inspMsg, fmtErr(e));
  }
});

/** Add Video (URL) */
addVideoBtn?.addEventListener("click", async () => {
  const client = await sb();
  const title = (vidTitle.value || "").trim();
  const url = (vidUrl.value || "").trim();
  if (!title || !url) return err(vidMsg, "Please fill both Title and URL.");
  try {
    const { error } = await client
      .from("resources")
      .insert({ title, url, type: "video", author_id: HER_UUID });
    if (error) throw error;
    vidMsg.className = "ok";
    vidMsg.textContent = "Video saved.";
    vidTitle.value = ""; vidUrl.value = "";
  } catch (e) {
    err(vidMsg, fmtErr(e));
  }
});

window.addEventListener("load", refreshAuthUI);
