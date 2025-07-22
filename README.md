# 📝 Comment SPA Frontend

This project is a **Single Page Application** for posting, viewing, and replying to comments with file attachments and CAPTCHA validation.

## 🚀 Features

✅ User registration and authentication  
✅ Post comments with:
- User Name (alphanumeric, required)
- Email (valid email format, required)
- Home page (valid URL, optional)
- CAPTCHA validation
- Text content with allowed HTML tags (`<a>`, `<code>`, `<i>`, `<strong>`)

✅ Attach files:
- Images (JPG, PNG, GIF) up to **320x240px**
- Text files (TXT) up to **100KB**

✅ View comments in a sortable table by **User Name**, **Email**, or **Created At** (ASC/DESC)  
✅ Pagination with **25 comments per page**  
✅ Nested replies (cascade display)  
✅ XSS protection for text content  
✅ Global error handling  
✅ Simple and clean CSS design

---

## 🛠 Tech Stack

- **Vue 3 + Vite**
- **vee-validate** for form validation
- **Fetch** for API requests
- **WebSocket** for real-time updates
- CSS modules for styling

---

## ⚙️ Setup

1. **Clone the repository:**

```bash
git clone https://github.com/RikiBob/front-dzen-code.git
cd front-dzen-code
npm install
```

## Create a .env file and add:

```env
VITE_SERVER_URL=http://localhost:4000
```

## Run the development server

```bash
npm run dev
```