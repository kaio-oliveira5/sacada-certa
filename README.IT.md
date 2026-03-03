📘 Leggi questo README in:
- 🇮🇹 Italiano (questo file)
- 🇧🇷 Portoghese → [README.md](README.md)

<!-- 
# Progetto BBBE – Bom de Bola Bom na Escola ⚽📄

Sistema web per **l’iscrizione, la validazione scolastica e la generazione di un documento ufficiale in PDF** del progetto **Bom de Bola Bom na Escola**, sviluppato per il Comune di **Carlos Barbosa – RS (Brasile)**.

Il sistema automatizza l’intero flusso:
**Responsabile → Scuola → Segreteria**, garantendo sicurezza, integrità dei dati e tracciabilità del processo.

---

## 🚀 Panoramica

Il Progetto BBBE consente:

- Iscrizione online degli studenti da parte dei responsabili
- Raccolta completa dei dati dello studente (inclusi salute e foto)
- Firma digitale del responsabile
- Validazione e firma digitale da parte della scuola
- Generazione del **documento finale in PDF**
- Invio automatico di e-mail in ogni fase
- Controllo dello stato tramite Firestore

Tutto senza carta, senza lavoro manuale e con uno storico affidabile.

---

## 🔄 Flusso del Sistema

### 1️⃣ Responsabile
- Compila il modulo di iscrizione
- Inserisce i dati dello studente, dei responsabili e le informazioni sanitarie
- Firma digitalmente
- Invia il modulo

📌 Risultato:
- Dati salvati su Firestore
- Stato: `aguardando_escola`
- E-mail inviata automaticamente alla scuola

---

### 2️⃣ Scuola
- Riceve un’e-mail con un link univoco
- Visualizza i dati dello studente
- Verifica il documento del responsabile
- Firma digitalmente
- Conferma l’iscrizione

📌 Protezioni:
- Il link può essere utilizzato **una sola volta**
- Il reinvio è bloccato tramite regole e transazioni Firestore

📌 Risultato:
- Stato aggiornato a `confirmado_escola`
- Documento finale disponibile

---

### 3️⃣ Segreteria
- Riceve un’e-mail automatica
- Accede al **documento finale**
- Può:
  - Visualizzarlo nel browser
  - Scaricare il PDF ufficiale (formato A4)

Il PDF contiene:
- Dati completi dello studente
- Foto
- Informazioni sanitarie
- Dati dei responsabili
- Firme del responsabile e della scuola

---

## 🧠 Tecnologie Utilizzate

- **HTML5 / CSS3**
- **JavaScript (ES Modules)**
- **Firebase**
  - Firestore
  - Hosting
- **Google Apps Script**
  - Invio e-mail
- **html2canvas**
- **jsPDF**
- **Canvas API**
  - Firma digitale

---

## 🔐 Sicurezza e Affidabilità

### Regole Firestore
- Modalità test **disattivata**
- Regole di sicurezza esplicite per lettura e scrittura
- Controllo basato sullo stato del documento

### Protezioni implementate
- Transazioni (`runTransaction`) su Firestore
- Blocco del reinvio dopo la conferma della scuola
- Link univoci per ogni iscrizione
- Validazione obbligatoria delle firme
- Escape HTML nei contenuti delle e-mail

---

## 📄 Documento Finale (PDF)

- Layout A4
- Anteprima nel browser
- Download su richiesta
- Contenuto coerente con i dati salvati su Firestore
- Ideale per archiviazione istituzionale

---

## 📧 E-mail Automatiche

- La scuola riceve il link di validazione
- La segreteria riceve il link del documento finale
- Invio tramite Google Apps Script
- Il flusso non viene bloccato in caso di errore di invio e-mail

---

## 🛠️ Deploy

Ospitato su:
- **Firebase Hosting**

Dopo il deploy:
- Sistema immediatamente operativo
- Nessuna necessità di backend dedicato

---

## 📌 Note Importanti

- Il sistema è stato progettato per essere:
  - riutilizzabile (altri progetti sportivi)
  - scalabile
  - facile da mantenere
- Tutta la logica critica è protetta tramite Firestore
- Interfaccia ottimizzata per desktop, tablet e mobile

---

## 👨‍💻 Autore

Progetto sviluppato da **Kaio Oliveira**  
Sistema reale, utilizzato in un contesto istituzionale.

---

## ✅ Stato del Progetto

🟢 **Completato e pronto per l’ambiente di produzione** -->
