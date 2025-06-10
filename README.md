# YouTube Title Fix!

> Transform clickbait YouTube titles into clear, accurate descriptions using AI

YouTube AI Title Replacer is a Chrome extension that combats clickbait by replacing misleading video titles with AI-generated, accurate descriptions. Know exactly what you're watching before you click.

## 🎯 Problem

- **Clickbait titles** waste your time with vague, sensational language
- **Misleading thumbnails** don't match video content
- **Hard to find quality content** in a sea of attention-grabbing titles
- **Decision fatigue** from trying to guess what videos actually contain

## ✨ Solution

Our extension:

- 📝 **Extracts video transcripts** automatically
- 🤖 **Uses AI (Gemini)** to generate accurate titles
- 🎯 **Replaces clickbait** with clear, descriptive titles
- 🔒 **Privacy-focused** - processes data securely

## 📸 Screenshots

*Coming soon - add screenshots of before/after titles*

## 🛠️ Features

- ✅ **One-click title replacement** - Simple button on each video
- ✅ **AI-powered accuracy** - Uses Google's Gemini AI
- ✅ **Works everywhere** - Homepage, search, recommendations
- ✅ **Original title preservation** - Hover to see original
- ✅ **Smart transcript processing** - Optimized for best results
- ✅ **No background processing** - Only runs when you want it

## 🚀 Installation

### For Users

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the extension folder
5. The extension is now active on YouTube!

### For Developers

```bash
git clone https://github.com/yourusername/youtube-ai-title-replacer.git
cd youtube-ai-title-replacer
```

## ⚙️ Setup

1. **Get API Keys:**

   - [Supadata API](https://supadata.ai/youtube-transcript-api) - For transcript extraction
   - [Google AI Studio](https://makersuite.google.com/app/apikey) - For Gemini AI
2. **Configure the extension:**

   ```bash
   cp config.example.js config.js
   ```
3. **Add your API keys to `config.js`:**

   ```javascript
   const CONFIG = {
       SUPADATA_API_KEY: 'your_supadata_key_here',
       GEMINI_API_KEY: 'your_gemini_key_here'
   };
   ```
4. **Load the extension in Chrome**

## 📖 How to Use

1. **Navigate to YouTube** (any page with videos)
2. **Look for the "AI Title" button** next to video titles
3. **Click the button** on any video you want to analyze
4. **Wait for processing** (usually 2-3 seconds)
5. **See the new title** - hover to view the original

### Tech Stack

- **Frontend:** Vanilla JavaScript (Chrome Extension)
- **APIs:** Supadata (transcripts) + Google Gemini (AI)
- **Architecture:** Client-side processing with API integration

### Key Components

- `manifest.json` - Extension configuration
- `content.js` - Main logic and DOM manipulation
- `config.js` - API key configuration (not tracked)

## 🔒 Privacy & Security

**🔒 Zero data collection** - We don't store, track, or collect any personal information

**✅ Efficient resource usage** - Runs only when needed, no constant background processes or CPU drain


## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📋 Roadmap

- [ ] **Chrome Web Store publication**
- [ ] **Firefox extension support**
- [ ] **Batch processing** for multiple videos
- [ ] **Custom AI prompts** for different title styles
- [ ] **Title history** and undo functionality
- [ ] **User preferences** and settings page

## 🐛 Known Issues

- Some videos may not have transcripts available
- AI-generated titles are limited to transcript content
- Extension requires manual activation per video

---

**Made with ❤️ to fight clickbait and save your time**

*Star ⭐ this repository if you found it helpful!*
