📘 Leggi questo README in:
- 🇮🇹 Italiano (questo file)
- 🇧🇷 Portoghese → [README.md](README.md)

# Progetto Sacada Certa

Sistema digitale di iscrizione per progetti sportivi sviluppato per la Segreteria dello Sport, Tempo Libero e Gioventù del comune di Carlos Barbosa.

Il sistema permette ai responsabili di iscrivere gli studenti ai progetti sportivi online, con firma digitale e conferma della scuola.

---

## 🚀 Funzionalità

- Modulo di iscrizione online
- Upload della foto dello studente
- Firma digitale del responsabile
- Salvataggio delle iscrizioni su Firebase (Cloud Firestore)
- Invio automatico di email alla scuola
- Conferma della scuola con firma digitale
- Invio automatico del documento finale alla Segreteria
- Generazione del documento con tutte le informazioni dell’iscrizione

---

## 🛠 Tecnologie Utilizzate

Frontend
- HTML5
- CSS3
- JavaScript

Backend / Cloud
- Firebase
- Cloud Firestore
- Firebase Hosting

Automazione
- Google Apps Script
- Gmail API

Altre tecnologie
- Canvas API (firma digitale)
- Base64 Image Encoding

---

## 🔄 Flusso del Sistema

1. Il responsabile accede al sistema
2. Compila il modulo di iscrizione
3. Firma digitalmente
4. I dati vengono salvati su Firebase
5. La scuola riceve un’email con il link per la conferma
6. La scuola conferma e firma digitalmente
7. La Segreteria riceve il documento finale via email

---

## 🔒 Sicurezza

Il sistema utilizza le regole di sicurezza di Firebase per:

- permettere la creazione delle iscrizioni
- permettere la lettura solo tramite ID
- bloccare la lista delle iscrizioni
- permettere la conferma una sola volta

---

## 🌐 Hosting

Il sistema è ospitato tramite **Firebase Hosting**.

---

## 👨‍💻 Sviluppatore

Sviluppato da **Kaio Oliveira**.