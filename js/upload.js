import { db, storage } from './js/firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

document.getElementById("entryForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const text = document.getElementById("text").value;
    const mood = document.getElementById("mood").value;
    const imageFile = document.getElementById("image").files[0];

    let imageUrl = "";

    if(imageFile){
        const storageRef = ref(storage, 'images/' + imageFile.name);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "entries"), {
        name,
        text,
        mood,
        imageUrl,
        date: new Date()
    });

    alert("Gespeichert!");
    window.location.href = "index.html";
});
