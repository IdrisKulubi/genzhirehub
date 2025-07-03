
# 📄 `requirements.md`

**Project Name:** GenzHireHub
**Purpose:** Connect Strathmore students with job opportunities through a centralized platform for students and recruiters.

---

## ✅ 1. Functional Requirements

### 👩‍🎓 Student Features

* [ ] Register and log in using university email
* [ ] Create/edit profile (bio, course, year, interests, LinkedIn, etc.)
* [ ] Upload or paste CV
* [ ] Join waitlist for app launch
* [ ] View dashboard (applications, status)
* [ ] Optional: join a student Telegram group via link

### 🏢 Employer Features

* [ ] Register and log in as company
* [ ] Create company profile (logo, website, sector)
* [ ] Post internship or job openings
* [ ] View list of applicants per post
* [ ] View filtered student profiles by skill, course, year
* [ ] Download applicant CVs

### 📬 Notifications (Phase 2)

* [ ] Email notifications to students when new jobs match interests
* [ ] Notify companies when they receive applicants

---

## 🧠 2. AI Features (Phase 3 – Later)

* [ ] Resume generation from LinkedIn or bio
* [ ] AI-generated cover letter based on job post
* [ ] Smart matching: recommend students to employers
* [ ] Interview question prep tool

---

## 🖼️ 3. Pages & Routes

### Public

* `/` — Landing page (hero, how it works, waitlist form)
* `/login` — Auth page (student or company)
* `/register` — Select type (student/company)
* `/terms` — Privacy and terms

### Student Dashboard

* `/student/dashboard` — Overview
* `/student/profile` — Edit profile & upload CV
* `/student/jobs` — View job listings
* `/student/applications` — Track applications

### Company Dashboard

* `/company/dashboard` — Overview
* `/company/profile` — Company info
* `/company/post-job` — New job form
* `/company/jobs` — All posted jobs
* `/company/applicants/:jobId` — View applicants

---

## 🧱 4. Database Schema (Drizzle + Neon)

### Users Table

```ts
id: uuid (PK)  
email: string  
passwordHash: string  
role: 'student' | 'company'  
createdAt: timestamp
```

### Students Table

```ts
userId: uuid (FK)  
fullName: string  
course: string  
yearOfStudy: string  
skills: string[]  
linkedinUrl: string  
cvUrl: string  
bio: text
```

### Companies Table

```ts
userId: uuid (FK)  
companyName: string  
logoUrl: string  
website: string  
industry: string  
description: text
```

### Jobs Table

```ts
id: uuid (PK)  
companyId: uuid (FK)  
title: string  
description: text  
location: string  
type: 'internship' | 'part-time' | 'full-time'  
tags: string[]  
createdAt: timestamp  
deadline: date
```

### Applications Table

```ts
id: uuid (PK)  
jobId: uuid (FK)  
studentId: uuid (FK)  
coverLetter: text  
status: 'pending' | 'reviewed' | 'interview' | 'rejected'  
createdAt: timestamp
```

---

## 🔐 5. Auth & Access Control

* [ ] JWT-based auth 
* [ ] Role-based routing: students can't access company dashboards and vice versa
* [ ] Middleware for protected routes

---

## ✨ 6. UI/UX & Tech

* [ ] **Framework:** Next.js 14 (App Router)
* [ ] **Styling:** Tailwind CSS + shadcn/ui
* [ ] **ORM:** Drizzle ORM (PostgreSQL - Neon)
* [ ] **Forms:** React Hook Form + Zod
* [ ] **File Uploads:** Cloudflare R2
* [ ] **SEO:** Add meta tags for visibility
* [ ] **Hosting:** Vercel

---

## 🧪 7. Testing

* [ ] Unit test for forms and validation
* [ ] Integration test for API routes
* [ ] End-to-end test (optional): Playwright or Cypress

---

## 🚀 8. Launch Plan

* [ ] Soft launch: 50-100 students + 5 companies
* [ ] Feedback collection form
* [ ] Add analytics: PostHog or Vercel Analytics
* [ ] Track signups, job posts, applications

---

## 📱 9. Mobile App (Post-validation)

* Expo app using same backend
* Push notifications for new jobs
* Reuse most of the logic
* Focus on fast job browsing and 1-click apply

---
