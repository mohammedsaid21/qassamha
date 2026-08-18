# قسّمها — خطة الـ 24 ساعة 🚀

> **الهدف:** تطبيق تقسيم مصاريف المجموعات — Tier 3 Chingu Solo Project
> **Stack:** React/Vite + Tailwind (client) | Express + Prisma + Postgres/Neon (server)
> **التسليم:** نموذج Airtable + Discord DMs مفتوحة

**طريقة الاستخدام:** كل ما تخلص ساعة، علّم `[x] وحط الوقت الفعلي. الوقت بيحسب.

---

## ✅ المرحلة 1 — الأساس (ساعات 1–4)

- [ ] **ساعة 1 — الهيكل**
  - ريبو GitHub جديد: `qassamha` (public)
  - `client/` — `npm create vite@latest` (React)
  - `server/` — `npm init` + express + cors + dotenv
  - حساب Neon + DB جديد + `.env`
  - ```bash
    git init && git add . && git commit -m "init: project scaffold (client + server)"
    ```

- [ ] **ساعة 2 — الداتابيس**
  - Prisma schema:
    - `User` (id, email, password, name)
    - `Group` (id, name, ownerId)
    - `Member` (id, groupId, userId, joinedAt)
    - `Expense` (id, groupId, payerId, amount, description, date)
    - `ExpenseSplit` (id, expenseId, memberId, share)
  - `npx prisma migrate dev`
  - Commit: `add prisma schema and initial migration`

- [ ] **ساعة 3 — Auth**
  - `POST /api/auth/register` — bcrypt للتشفير
  - `POST /api/auth/login` — يرجّع JWT
  - Commit: `add user registration and login endpoints`

- [ ] **ساعة 4 — حماية المسارات**
  - middleware يقرأ `Authorization: Bearer`
  - `GET /api/auth/me`
  - تجربة كل شي بـ REST client (Thunder Client / Postman)
  - Commit: `add jwt auth middleware and me endpoint`

## ✅ المرحلة 2 — قلب التطبيق (ساعات 5–9)

- [ ] **ساعة 5 — المجموعات**
  - `POST /api/groups` / `GET /api/groups` (مجموعاتي) / `GET /api/groups/:id`
  - Commit: `add groups crud endpoints`

- [ ] **ساعة 6 — الأعضاء**
  - إضافة عضو بالإيميل / حذف عضو
  - منع حذف صاحب المجموعة
  - Commit: `add group members endpoints`

- [ ] **ساعة 7 — المصاريف**
  - `POST /api/groups/:id/expenses` (payer + amount + على مين)
  - `DELETE /api/expenses/:id`
  - التوزيع: بالتساوي (MVP) — لاحقاً بالنِسَب
  - Commit: `add expenses crud with split logic`

- [ ] **ساعة 8 — الأرصدة**
  - `GET /api/groups/:id/balances` — رصيد صافي لكل عضو
  - الحسبة: (دفع) − (عليه) لكل مصروف
  - Commit: `add group balance calculation endpoint`

- [ ] **ساعة 9 — ⭐ الخوارزمية**
  - `GET /api/groups/:id/settlements`
  - Greedy min-cash-flow: رتّب الدائنين تنازلي، المدينين تصاعدي، طابق الأكبر بالأكبر، recurse
  - النتيجة: `[{ from, to, amount }]`
  - Commit: `add debt settlement algorithm (min transfers)`

## ✅ المرحلة 3 — الواجهة (ساعات 10–17)

- [ ] **ساعة 10 — تجهيز الكلينت**
  - Tailwind + react-router + axios
  - axios interceptor يضيف الـ token
  - `dir="rtl"` + خط عربي (Rubik / Cairo)
  - Commit: `setup client: tailwind, router, api client`

- [ ] **ساعة 11 — الدخول**
  - صفحتا Login / Register + حفظ token
  - ProtectedRoute component
  - Commit: `add auth pages`

- [ ] **ساعة 12 — المجموعات**
  - قائمة مجموعاتي + إنشاء مجموعة (modal بسيط)
  - Commit: `add groups list and create page`

- [ ] **ساعة 13 — صفحة المجموعة**
  - قائمة المصاريف + نموذج إضافة (مين دفع، كم، على مين، وصف)
  - Commit: `add group detail with expenses`

- [ ] **ساعة 14 — الأرصدة**
  - كروت: كل عضو ورصيده (أخضر = له، أحمر = عليه)
  - Commit: `add balances view`

- [ ] **ساعة 15 — التسوية**
  - "الفلان يدفع للعلان ٥٠ شيكل" — نتيجة الخوارزمية بشكل واضح
  - Commit: `add settlement view`

- [ ] **ساعة 16 — التنقيط**
  - Empty states / toasts للأخطاء / تنسيق أرقام عربي
  - Commit: `add empty states and ux polish`

- [ ] **ساعة 17 — جولة إصلاح**
  - **صفر console errors** — بيفحصوها!
  - Commit: `fix ui bugs and console warnings`

## ✅ المرحلة 4 — التسليم (ساعات 18–24)

- [ ] **ساعة 18 — سيرفر لايف**
  - Render: خدمة جديدة من الريبو، root = `server/`
  - متغيرات البيئة: DATABASE_URL, JWT_SECRET
  - Commit: `add render deployment config`

- [ ] **ساعة 19 — واجهة لايف**
  - Vercel من نفس الريبو، root = `client/`
  - `VITE_API_URL` على رابط Render
  - Commit: `configure vercel deployment`

- [ ] **ساعة 20 — README**
  - اسم + وصف + صور من التطبيق
  - Features / Tech stack / How to run / Test account
  - Commit: `write readme with setup docs`

- [ ] **ساعة 21 — بيانات تجريبية**
  - `prisma/seed.ts` — مجموعة فيها 4 أعضاء و6 مصاريف
  - حساب demo: `demo@qassamha.app / Demo1234!`
  - Commit: `add seed data and demo account`

- [ ] **ساعة 22 — فحص شامل**
  - تجربة التطبيق اللive من الصفر: تسجيل → مجموعة → مصاريف → تسوية
  - Commit: `final fixes from live testing`

- [ ] **ساعة 23 — التقديم**
  - نموذج Airtable: رابط الريبو + رابط التطبيق + بيانات demo
  - التأكد إنه DMs مفتوحة على Discord

- [ ] **ساعة 24 — احتياط** 🔧

---

## 🔗 مرجع سريع — الـ Endpoints

```
POST   /api/auth/register        إنشاء حساب
POST   /api/auth/login           دخول → JWT
GET    /api/auth/me              بياناتي
POST   /api/groups               مجموعة جديدة
GET    /api/groups               مجموعاتي
GET    /api/groups/:id           تفاصيل مجموعة
POST   /api/groups/:id/members   إضافة عضو
DELETE /api/groups/:id/members/:memberId  حذف عضو
POST   /api/groups/:id/expenses  مصروف جديد
DELETE /api/expenses/:id         حذف مصروف
GET    /api/groups/:id/balances  أرصدة الأعضاء
GET    /api/groups/:id/settlements  خطة التسوية ⭐
```

## 📋 تشيك ليست التسليم النهائي

- [ ] الريبو public فيه README محترم
- [ ] التطبيق شغال على الرابط
- [ ] بيانات دخول تجريبية شغالة
- [ ] صفر console errors
- [ ] FE و BE منفصلين — DB من الـ BE فقط
- [ ] Auth من تأليفي + API خاص بالتطبيق (مافي Firebase لحاله)
- [ ] النموذج مفروز

## ⚠️ القواعد الذهبية

1. الترتيب مقدس — ولا صفحة قبل endpoint شغال
2. Commit صغير = شي واحد بس
3. ما ترفع شي نصف شغال
4. علامة تبويب Console نقية دايماً
5. نَم شوية بالمنتصف
