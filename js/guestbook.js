import { db } from './js/firebase.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.checkPassword = async function() {
    const pw = document.getElementById("password").value;
    if(pw !== "1234"){
        alert("Falsches Passwort");
        return;
    }

    const container = document.getElementById("adminEntries");
    const querySnapshot = await getDocs(collection(db, "entries"));

    container.innerHTML = "";
    querySnapshot.forEach((d) => {
        const data = d.data();
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${data.name}: ${data.text}</p>
            <button onclick="deleteEntry('${d.id}')">Löschen</button>
        `;
        container.appendChild(div);
    });
}

window.deleteEntry = async function(id){
    await deleteDoc(doc(db, "entries", id));
    alert("Gelöscht");
    location.reload();
}
