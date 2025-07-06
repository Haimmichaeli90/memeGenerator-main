
# 🖼️ Meme Generator – Web App in Vanilla JavaScript

A fun and interactive meme generator built with pure JavaScript, HTML, and CSS. Users can upload images, add and customize text, drag and align elements, add emojis, save memes, and even share them to Facebook – all in a simple, browser-based interface.

---

## 🚀 Live Demo

> Coming soon – can be deployed to GitHub Pages or Netlify  
> *(Add live link when ready)*

---

## 🎯 Features

- 🖼 Upload your own image or choose from gallery
- 🧠 Keyword-based filtering with font-size mapping
- ✍️ Add and edit multiple lines of text
- 🧲 Drag and reposition text on canvas
- 🎨 Customize font, size, color, and alignment
- 😀 Add stickers and emojis
- 💾 Save memes to session and re-edit later
- 📥 Download meme image
- 📤 Upload to Facebook with one click

---

## 🛠 Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- No external libraries (except html2canvas for rendering)

---

## 🕹️ How to Use

1. Open the app in a browser
2. Choose an image or upload your own
3. Add text, customize it, add emojis
4. Drag and position each element as desired
5. Save or download your meme

---

## 📂 File Structure

```
meme-generator/
│
├── index.html               # Main HTML page
├── main.js                  # App initialization and general logic
├── Controller/
│   ├── memeController.js    # Meme editing logic
│   ├── galleryController.js # Gallery rendering & filtering
│   └── savedController.js   # Saved memes logic
├── Service/
│   ├── memeService.js       # Meme model & setters
│   ├── storageService.js    # Session storage utilities
├── icon/                    # Buttons, emoji, styling icons
└── style.css                # Styling
```

---

## 👨‍💻 Developed By

**Haim Michaeli**  
[LinkedIn →](https://www.linkedin.com/in/haim-michaeli-b1b75b246/)  
[GitHub →](https://github.com/haimmichaeli90)

---

## 📌 Notes

This project was built to practice interactive DOM manipulation, canvas rendering, and UX logic – a fully browser-native meme creation experience with no backend.

---

## 📃 License

Open-source and free to use for fun and educational purposes.
