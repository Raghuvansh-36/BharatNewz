# 📰 BharatNewz

BharatNewz is a premium, modern, and highly responsive news aggregator web application tailored for real-time news in India. Designed with a gorgeous glassmorphic UI, it fetches top headlines across multiple categories directly from the **GNews API** using a secure proxy to deliver a premium user experience without clutter.

---

## 🚀 Live Demo

The application is configured to deploy directly to GitHub Pages. You can view the live site here:
🔗 **[BharatNewz Live Web App](https://Raghuvansh-36.github.io/BharatNewz)**

---

## ✨ Features

- **🌐 Live Categorized Feeds**: Access real-time headlines across multiple categories:
  - `General (Home)`
  - `Business`
  - `Entertainment`
  - `Health`
  - `Science`
  - `Sports`
  - `Technology`
- **♾️ Seamless Infinite Scrolling**: Integrated with `react-infinite-scroll-component` to automatically load articles as the user scrolls, avoiding clunky pagination.
- **🎨 Premium Glassmorphic UI**: Built using modern CSS design principles featuring:
  - Translucent card backgrounds (`backdrop-filter`) with custom neon/neon-accent borders.
  - Floating ambient background orbs with subtle hover-scale keyframe animations.
  - Custom scrollbars styled to complement the dark theme.
- **⚡ Interactive Loading Progress**: Real-time request progress tracking with `react-top-loading-bar` using a custom gradient transition (`#4f9eff` to `#a78bfa`).
- **🛡️ CORS Proxy Protection**: Integrated with `corsproxy.io` to guarantee reliability and bypass common CORS blocks during API calls.
- **⏳ Dynamic Time Formatting**: Converts publication dates to standard Indian Standard Time (IST) for easy readability.
- **🖼️ Smart Image Fallback**: Gracefully detects missing or broken image assets and switches to a premium branded placeholder.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React.js (v19)](https://react.dev/)
- **Routing**: [React Router DOM (v6)](https://reactrouter.com/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) (layout grid) + Vanilla CSS (Glassmorphism & animations)
- **API Provider**: [GNews API](https://gnews.io/)
- **Progressive Loader**: [React Top Loading Bar](https://github.com/lucasplus/react-top-loading-bar)
- **Scroll Engine**: [React Infinite Scroll Component](https://github.com/danbove/react-infinite-scroll-component)

---

## 💎 Pros & Advantages

1. **Aesthetics & Micro-interactions**: The custom dark-glass UI feels premium, using rich HSL-curated color gradients instead of generic solid colors.
2. **Optimized Layout Grid**: Cards are designed to be equal height dynamically, preventing erratic visual gaps and maintaining layout cohesion.
3. **No Page Reloads**: Uses client-side single-page routing for fast navigation between news sections.
4. **Optimized Content Density**: Grid layout automatically adjusts to `12`, `6`, or `4` columns on mobile, tablet, and desktop viewports respectively.

---

## 📦 Setup & Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Make sure you have **Node.js** (v16.x or newer recommended) and **npm** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/Raghuvansh-36/BharatNewz.git
cd BharatNewz
```

### 2. Install Dependencies

Run the following command to download and install project dependencies:

```bash
npm install
```

### 3. Setup Environment Variables

Create a file named `.env.local` in the root of the project (same directory as `package.json`) and add your GNews API key:

```env
REACT_APP_NEWS_API=your_gnews_api_key_here
```

> **Note**: You can sign up and get a free API key at [GNews API](https://gnews.io/).

### 4. Run the Development Server

Launch the local development environment:

```bash
npm start
```

This runs the app in development mode. Open **[http://localhost:3000](http://localhost:3000)** in your browser to view it.

### 5. Build for Production

To generate an optimized build for production, run:

```bash
npm run build
```

This compiles React into static files in the `build` folder, ready to be hosted on any web server.

### 6. Deployment (GitHub Pages)

The project includes pre-configured scripts for deploying to GitHub Pages. Run:

```bash
npm run deploy
```

This runs the build and publishes the static files directly to your configured GitHub repository.
