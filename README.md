# BackEnd_Stackoverflow

![CI](https://github.com/Benlaptrinh/BackEnd_Stackoverflow/actions/workflows/main.yml/badge.svg)
![Node.js](https://img.shields.io/badge/node-18-green)
![License](https://img.shields.io/badge/license-MIT-blue)

📌 A scalable backend API that mimics StackOverflow — built with Node.js, Express, MongoDB, and Socket.IO.

---

## 🚀 Features

- 🔐 **Authentication** (JWT + OAuth Google/GitHub)
- 📝 **Ask & answer questions** with Markdown + code + images
- 💬 **Nested comments** with like system
- 🗳 **Voting, tags, folders, following**
- 📩 **Real-time + stored notifications** (Socket.IO + DB)
- ⚠️ **Report & moderation** system with admin approval
- 📈 **Leaderboard + profile reputation**
- 🧩 Modular MVC architecture with clear separation of concerns

---

## 📸 Screenshots

| Ask Question Flow | Real-time Notification |
|-------------------|------------------------|
| ![Ask Screenshot](https://github.com/user-attachments/assets/f3b9d37a-f53c-49f0-ba8b-85e9d226f5b3) | ![Noti Screenshot](https://github.com/user-attachments/assets/d895b228-8d21-435f-b4f4-9411b022f646) |

> _(Bạn có thể thay bằng ảnh thật hoặc GIF demo ứng dụng sau)_

---

## 🧪 Testing

- ✅ Unit tests with Jest
- 🔄 Integration tests with Supertest
- 📊 Test coverage with `npm run test:coverage`
- 🧪 Mongo Memory Server for clean DB mocking

---

## 🧰 Tech Stack

| Layer        | Tech           |
|--------------|----------------|
| Backend      | Node.js, Express |
| Database     | MongoDB + Mongoose |
| Auth         | JWT + Passport (OAuth2) |
| Realtime     | Socket.IO |
| Upload       | Cloudinary |
| Email        | Nodemailer |
| CI/CD        | GitHub Actions |
| Testing      | Jest + Supertest |

---

## 📁 Project Structure

```bash
├── controllers/       # Route handlers
├── services/          # Business logic
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middlewares/       # JWT, error, rate-limit, upload
├── sockets/           # Socket.IO logic
├── utils/             # Email, validation, token
├── tests/             # Jest + Supertest
└── .github/workflows/ # CI/CD configs

# Clone repo
git clone https://github.com/Benlaptrinh/BackEnd_Stackoverflow.git
cd BackEnd_Stackoverflow

# Install deps
npm install

# Set up environment
cp .env.example .env

# Run locally
npm run dev
