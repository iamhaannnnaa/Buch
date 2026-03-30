# Klo-Gästebuch – NFC Web App Starter

Mobiles, buchartiges Gästebuch für NFC-Tags.

## Enthalten
- mobile-first Frontend in HTML/CSS/JS
- beige / modernes Buch-Design
- Einträge lesen und durchblättern
- Einträge schreiben
- optionales Bild-Upload in Firebase Storage
- Löschen im Frontend per Passwort 1234 (nur MVP, nicht sicher)
- vorbereitete Firebase-Regeln

## Schnellstart
1. Repo nach GitHub hochladen.
2. `firebase-config.example.js` zu `firebase-config.js` kopieren.
3. Firebase-Projekt anlegen und Konfiguration eintragen.
4. Firestore-Datenbank erstellen.
5. Storage aktivieren.
6. `firestore.rules` und `storage.rules` in Firebase übernehmen.
7. GitHub Pages aktivieren oder alternativ Firebase Hosting nutzen.
8. NFC-Tag mit der finalen URL beschreiben.

## Firestore Struktur
Collection: `entries`

Beispieldokument:
```json
{
  "author": "Anonym",
  "title": "Legendärer Moment",
  "mood": "Lustig",
  "rating": "5/5",
  "visitType": "Notfall",
  "locationNote": "2. Stock links",
  "message": "Hier steht der eigentliche Eintrag.",
  "quote": "Ich kam, ich sah, ich spülte.",
  "song": "Dancing Queen",
  "imageUrl": "https://...",
  "createdAt": "serverTimestamp()"
}
```

## Wichtiger Hinweis
Das Löschen per Passwort im Frontend ist bewusst nur als schneller MVP eingebaut.
Für eine echte Veröffentlichung solltest du stattdessen entweder:
- Firebase Authentication für Admins nutzen, oder
- eine Cloud Function bauen, die serverseitig prüft, wer löschen darf.
