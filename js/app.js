import { db } from './js/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let entries = [];
let currentPage = 0;

window.nextPage = function() {
    if (currentPage < entries.length - 1) {
        currentPage++;
        showPage();
    }
}
window.prevPage = function() {
    if (currentPage > 0) {
        currentPage--;
        showPage();
    }
}

async function loadEntries() {
    const querySnapshot = await getDocs(collection(db, "entries"));
    entries = querySnapshot.docs.map(doc => doc.data());
    showPage();
}

function showPage() {
    const page = document.getElementById("entries");
    if(entries.length === 0){
        page.innerHTML = "Noch keine Einträge.";
        return;
    }
    const e = entries[currentPage];
    page.innerHTML = `
        <h2>${e.name}</h2>
        <p>${e.text}</p>
        <p>${e.mood}</p>
        ${e.imageUrl ? `<img src="${e.imageUrl}" width="100%">` : ""}
    `;
}

loadEntries();
