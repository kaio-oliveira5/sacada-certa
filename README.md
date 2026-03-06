📘 Leia este arquivo README em:
- 🇧🇷 Português (este arquivo)
- 🇮🇹 Italiano → [README.it.md](README.IT.md)

# Projeto Sacada Certa

Sistema digital de inscrição para projetos esportivos desenvolvido para a Secretaria de Esportes, Lazer e Juventude do município de Carlos Barbosa.

O sistema permite que responsáveis realizem a inscrição de alunos em projetos esportivos de forma online, com assinatura digital e confirmação da escola.

---

## 🚀 Funcionalidades

- Formulário de inscrição online
- Upload da foto do aluno
- Assinatura digital do responsável
- Armazenamento das inscrições no Firebase (Cloud Firestore)
- Envio automático de e-mail para a escola
- Confirmação da escola com assinatura digital
- Envio automático do documento final para a Secretaria
- Geração de documento com todas as informações da inscrição

---

## 🛠 Tecnologias Utilizadas

Frontend
- HTML5
- CSS3
- JavaScript

Backend / Cloud
- Firebase
- Cloud Firestore
- Firebase Hosting

Automação
- Google Apps Script
- Gmail API

Outros recursos
- Canvas API (assinatura digital)
- Base64 Image Encoding

---

## 🔄 Fluxo do Sistema

1. Responsável acessa o sistema
2. Preenche o formulário de inscrição
3. Assina digitalmente
4. Os dados são salvos no Firebase
5. A escola recebe um e-mail com o link para confirmação
6. A escola confirma e assina digitalmente
7. A Secretaria recebe o documento final por e-mail

---

## 🔒 Segurança

O sistema utiliza regras de segurança do Firebase para:

- permitir criação de inscrições
- permitir leitura somente por ID
- impedir listagem de inscrições
- permitir confirmação apenas uma vez pela escola

---

## 🌐 Hospedagem

O sistema é hospedado utilizando **Firebase Hosting**.

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Kaio Oliveira**.