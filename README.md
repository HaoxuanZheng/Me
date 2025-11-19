# HaoxuaZheng
This is my personal website

Local preview
 - Run a simple static server from the repository root:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser. The site will fetch `data/blog.json` to populate the Blog section.

Files added/updated
 - `index.html` — main personal page
 - `styles.css` — site styles and theme
 - `script.js` — client script to load posts and toggle theme

To customize: edit `index.html` for content and `data/blog.json` for blog posts.

Fun additions
 - Click the `🎉 Surprise me` button in the header to see a random fun fact and confetti.
 - The hero name types itself on load, and the page has a subtle animated background.
