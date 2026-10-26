<div align="center">

# ORBITA
**Minimalist Touch-Sensor Lamp — Interactive Product Showcase**

[![Status](https://img.shields.io/badge/Status-Production_Soon-orange?style=flat-square)]()
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)]()
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)]()
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-ff69b4?style=flat-square)]()

*An editorial, motion-driven web experience showcasing the industrial design, ambient lighting states, and tactile controls of the Orbita lamp.*

[**Live Preview (Coming Soon)**](#)

</div>

---

## Overview

**Orbita** is an interactive product showcase built to translate the physical warmth and precision of a minimalist touch-sensor lamp into the browser. The experience guides users through the lamp's form factor, ambient light transitions, hardware specifications, and tactile switch mechanics through choreographed scroll animations and fluid layout transitions.

## Credits

* **UI/UX & Design Direction:** Qoreebullah (Qoreeb) Abubakar — [@QoreebA](https://x.com/QoreebA)
* **Creative Development:** Saurabh Thapliyal — [@sauroww](https://x.com/sauroww)

---

## Key Features & Motion Architecture

* **GSAP + Lenis Ticker Synchronization:** Smooth inertial scrolling powered by `lenis`, driven directly by `gsap.ticker` with `lagSmoothing(0)` for zero-jitter `ScrollTrigger` scrubbing.
* **Sequenced Preloader Handoff:** Custom `<Preloader />` sequence that coordinates initial asset readiness (`isReady`) before triggering entrance animations in `<Header />` and `<Landing />`.
* **Interactive Lighting & Tactile Sections:** Dedicated narrative modules exploring ambient mood (`<Atmos />`), industrial build (`<Des />`, `<Features />`), visual fidelity (`<Upscale />`), and touch-sensor interaction (`<Switch />`).
* **Scoped Modular Styling:** Built with CSS/SCSS Modules for clean, collision-free component styling and responsive fluid layouts.

---

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Animation:** [GSAP](https://gsap.com/) (`ScrollTrigger`)
* **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
* **Styling:** CSS / SCSS Modules
* **Deployment:** [Vercel](https://vercel.com/)

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── page.tsx          # Root scroll orchestration (Lenis + GSAP ticker)
│   │   ├── page.module.css   # Main layout styles
│   │   └── layout.tsx        # Root layout & typography config
│   └── components/
│       ├── Preloader/        # Initial loading sequence & state handoff
│       ├── Header/           # Navigation bar (synced with preloader state)
│       ├── Landing/          # Hero section & primary lamp reveal
│       ├── Des/              # Design philosophy & editorial breakdown
│       ├── Atmos/            # Ambient lighting & mood showcase
│       ├── Features/         # Hardware specs & build details
│       ├── Upscale/          # High-resolution detail & material showcase
│       ├── Switch/           # Interactive touch-sensor toggle showcase
│       └── Footer/           # Closing CTA & credits
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/saur0w/orbita.git](https://github.com/saur0w/orbita.git)
cd orbita
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project locally.

---

## License

All rights reserved. Design by [Qoreebullah Abubakar](https://x.com/QoreebA) and code by [Saurabh Thapliyal](https://x.com/sauroww).
