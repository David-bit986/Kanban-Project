# TaskSync - Learning Next.js & Modern UI

## English (EN)
### Project Goal
The objective of this project is to build a highly interactive Kanban dashboard featuring dynamic project management, real-time task tracking, and authentication with github,email and password.

### Learning Journey
This project represents my journey in mastering **Next.js 16** and advanced frontend patterns. Key areas of exploration include:
- **Advanced State & Interactivity**: Implementing complex drag-and-drop logic across multiple containers.
- **Server Actions & Persistence**: Understanding the power of Next.js Server Actions to manage database mutations without external APIs.
- **Modern Auth Patterns**: Deep-diving into Better Auth and its integration with Prisma.
- **Real-Time Synchronization**: Implementing a robust polling mechanism to ensure the Kanban board updates instantly across all shared sessions without manual refreshes.
- **AI-Assisted Development**: Using **Google Antigravity** to accelerate my understanding of complex UI architectures, state synchronization patterns, and modern web best practices. My focus was leveraging AI to implement a scalable **Kanban logic** and a professional-grade **design system**.

### Tech Stack
- **Framework**: Next.js 16 with TypeScript
- **Authentication**: Better Auth
- **Database**: Prisma ORM with PostgreSQL/SQLite
- **Styling**: Tailwind CSS 4 & Framer Motion
- **Icons**: Lucide React

### Live Deployment
**View the app live**: [https://kanban-project-main.vercel.app/](https://kanban-project-main.vercel.app/)

### Critical Issue Resolved
During development, I discovered a critical **500 Server Error** when users joined a board via invite code.
- **The Problem**: The app attempted to initialize default categories (To Do, In Progress, Done) for new members using hardcoded IDs. Since these IDs already existed for the owner, Prisma threw a `P2002` unique constraint violation.
- **The Solution**: Refactored the entire task/category system to be **project-centric** rather than **user-centric**. Now, all members of a project share the same categories and tasks, preventing duplicate creation and enabling true real-time collaboration.

### Local Setup
To run this project on your own machine:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/David-bit986/Kanban-Project.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open the app**: Go to https://kanban-project-5yxm.vercel.app/ in your browser.

---

## Română (RO)
### Scopul Proiectului
Obiectivul acestui proiect este de a construi un dashboard Kanban interactiv care include gestionarea dinamică a proiectelor, urmărirea sarcinilor în timp real și autentificare cu github,email si parola.


### Procesul de Învățare
Acest proiect reprezintă parcursul meu în stăpânirea **Next.js 16** și a tiparelor avansate de frontend. Zonele cheie de explorare includ:
- **Stare și Interactivitate Avansată**: Implementarea logicii complexe de drag-and-drop între mai multe containere.
- **Server Actions și Persistență**: Înțelegerea puterii Server Actions din Next.js pentru a gestiona mutațiile în baza de date fără API-uri externe.
- **Tipare Moderne de Auth**: Explorarea în profunzime a Better Auth și integrarea acestuia cu Prisma.
- **Sincronizare în Timp Real**: Implementarea unui mecanism de polling robust pentru a asigura actualizarea instantanee a bordului Kanban în toate sesiunile partajate, fără reîmprospătare manuală.
- **Dezvoltare Asistată de AI**: Utilizarea **Google Antigravity** pentru a accelera înțelegerea arhitecturilor UI complexe, a tiparelor de sincronizare a stării și a celor mai bune practici web. Focusul meu a fost folosirea AI-ului pentru a implementa o **logică Kanban** scalabilă și un **sistem de design** profesional.

### Stiva Tehnologică
- **Framework**: Next.js 16 cu TypeScript
- **Autentificare**: Better Auth
- **Bază de Date**: Prisma ORM cu PostgreSQL/SQLite
- **Stilizare**: Tailwind CSS 4 & Framer Motion
- **Iconițe**: Lucide React

### Deploy (Lansare)
Poți vizualiza aplicația aici: https://kanban-project-main.vercel.app

### Problemă Critică Rezolvată
În timpul dezvoltării, am descoperit o eroare critică **500 Server Error** atunci când utilizatorii se alăturau unui proiect prin cod de invitație.
- **Problema**: Aplicația încerca să inițializeze categorii implicite (To Do, In Progress, Done) pentru noii membri folosind ID-uri fixe. Deoarece aceste ID-uri existau deja pentru proprietar, Prisma genera o eroare de constrângere unică `P2002`.
- **Soluția**: Am refăcut întregul sistem de sarcini și categorii pentru a fi **centrat pe proiect** în loc de **centrat pe utilizator**. Acum, toți membrii unui proiect partajează aceleași categorii și sarcini, prevenind duplicarea și permițând o colaborare reală în timp real.

### Configurare Locală
Pentru a rula acest proiect pe propria mașină:
1. **Clonează repository-ul**:
   ```bash
   git clone https://github.com/David-bit986/Kanban-Project.git
   ```
2. **Instalează dependențele**:
   ```bash
   npm install
   ```
3. **Pornește serverul de dezvoltare**:
   ```bash
   npm run dev
   ```
4. **Deschide aplicația**: Mergi la [http://localhost:3000](http://localhost:3000) în browser.

---

Built with ❤️ using Antigravity AI.
