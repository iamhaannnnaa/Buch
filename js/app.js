import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

import { firebaseConfig, ADMIN_DELETE_PASSWORD } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const entriesCol = collection(db, "entries");

const state = {
  entries: [],
  index: 0,
};

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");
const entryCount = document.getElementById("entryCount");
const pageNumber = document.getElementById("pageNumber");
const emptyState = document.getElementById("emptyState");
const entryView = document.getElementById("entryView");
const entryMood = document.getElementById("entryMood");
const entryTitle = document.getElementById("entryTitle");
const entryAuthor = document.getElementById("entryAuthor");
const entryDate = document.getElementById("entryDate");
const entryText = document.getElementById("entryText");
const entryImage = document.getElementById("entryImage");
const entryFacts = document.getElementById("entryFacts");
const form = document.getElementById("entryForm");
const formStatus = document.getElementById("formStatus");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const deleteButton = document.getElementById("deleteButton");
const passwordDialog = document.getElementById("passwordDialog");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const deleteStatus = document.getElementById("deleteStatus");

function switchView(viewName) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
}

tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));

function formatDate(value) {
  if (!value) return "Gerade eben";
  const date = value.toDate ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildFacts(entry) {
  const facts = [
    ["Klo-Rating", entry.rating],
    ["Besuchstyp", entry.visitType],
    ["Ort", entry.locationNote],
    ["Zitat", entry.quote],
    ["Song", entry.song],
  ].filter(([, value]) => value && String(value).trim());

  entryFacts.innerHTML = facts
    .map(
      ([label, value]) => `
      <div>
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>
    `,
    )
    .join("");
}

function renderEntry() {
  const count = state.entries.length;
  entryCount.textContent = count;

  if (!count) {
    emptyState.classList.remove("hidden");
    entryView.classList.add("hidden");
    pageNumber.textContent = "Seite 0 / 0";
    prevButton.disabled = true;
    nextButton.disabled = true;
    deleteButton.disabled = true;
    return;
  }

  const entry = state.entries[state.index];
  emptyState.classList.add("hidden");
  entryView.classList.remove("hidden");
  pageNumber.textContent = `Seite ${state.index + 1} / ${count}`;
  entryMood.textContent = entry.mood || "Kapitel";
  entryTitle.textContent = entry.title || "Ohne Titel";
  entryAuthor.textContent = entry.author || "Anonym";
  entryDate.textContent = formatDate(entry.createdAt);
  entryText.textContent = entry.message || "";
  buildFacts(entry);

  if (entry.imageUrl) {
    entryImage.src = entry.imageUrl;
    entryImage.classList.remove("hidden");
  } else {
    entryImage.src = "";
    entryImage.classList.add("hidden");
  }

  prevButton.disabled = state.index === 0;
  nextButton.disabled = state.index === count - 1;
  deleteButton.disabled = false;
}

async function loadEntries() {
  const q = query(entriesCol, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  state.entries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (state.index >= state.entries.length) state.index = Math.max(0, state.entries.length - 1);
  renderEntry();
}

async function uploadImageIfPresent(file) {
  if (!file) return "";
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const imageRef = ref(storage, `guestbook-images/${filename}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Eintrag wird gespeichert ...";

  try {
    const formData = new FormData(form);
    const file = formData.get("photo");
    const imageUrl = file && file.size > 0 ? await uploadImageIfPresent(file) : "";

    await addDoc(entriesCol, {
      author: String(formData.get("author") || "Anonym").trim() || "Anonym",
      title: String(formData.get("title") || "").trim(),
      mood: String(formData.get("mood") || "").trim(),
      rating: String(formData.get("rating") || "").trim(),
      visitType: String(formData.get("visitType") || "").trim(),
      locationNote: String(formData.get("locationNote") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      quote: String(formData.get("quote") || "").trim(),
      song: String(formData.get("song") || "").trim(),
      imageUrl,
      createdAt: serverTimestamp(),
    });

    form.reset();
    formStatus.textContent = "Eintrag erfolgreich gespeichert.";
    await loadEntries();
    state.index = state.entries.length - 1;
    renderEntry();
    switchView("read");
  } catch (error) {
    console.error(error);
    formStatus.textContent = "Speichern fehlgeschlagen. Firebase-Konfiguration und Regeln prüfen.";
  }
});

prevButton.addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    renderEntry();
  }
});

nextButton.addEventListener("click", () => {
  if (state.index < state.entries.length - 1) {
    state.index += 1;
    renderEntry();
  }
});

deleteButton.addEventListener("click", () => {
  deleteStatus.textContent = "";
  adminPasswordInput.value = "";
  passwordDialog.showModal();
});

confirmDeleteButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const current = state.entries[state.index];
  if (!current) return;

  if (adminPasswordInput.value !== ADMIN_DELETE_PASSWORD) {
    deleteStatus.textContent = "Falsches Passwort.";
    return;
  }

  try {
    await deleteDoc(doc(db, "entries", current.id));
    passwordDialog.close();
    await loadEntries();
  } catch (error) {
    console.error(error);
    deleteStatus.textContent = "Löschen fehlgeschlagen.";
  }
});

loadEntries().catch((error) => {
  console.error(error);
  formStatus.textContent = "Daten konnten nicht geladen werden. Prüfe Firebase-Konfiguration.";
});
