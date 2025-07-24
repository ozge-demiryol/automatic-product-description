# UI/UX Design Guidelines for AI Product Description Generator

## 🌐 Framework
- **Frontend Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icon Library:** Lucide Icons (https://lucide.dev/icons)  
  > ✅ Açık kaynak, sade, modern, figma uyumlu.

---

## 🎨 Color Palette

| Color Usage      | HEX Code   | Tailwind Token  |
|------------------|------------|-----------------|
| Primary Blue     | #2563EB    | `blue-600`      |
| Primary Hover    | #1D4ED8    | `blue-700`      |
| Light Background | #EFF6FF    | `blue-50`       |
| Gray Text        | #6B7280    | `gray-500`      |
| Border Gray      | #D1D5DB    | `gray-300`      |
| Success Green    | #10B981    | `green-500`     |
| Error Red        | #EF4444    | `red-500`       |
| White            | #FFFFFF    | `white`         |
| Dark Text        | #111827    | `gray-900`      |

> Use Tailwind tokens to maintain design consistency.

---

## ✍️ Typography

| Element           | Font       | Weight | Size (px) | Tailwind Class |
|------------------|------------|--------|-----------|----------------|
| Headline (H1)     | Inter / Poppins | 600    | 24px      | `text-2xl font-semibold` |
| Subheadline (H2)  | Inter / Poppins | 500    | 20px      | `text-xl font-medium`    |
| Body Text         | Inter / Poppins | 400    | 16px      | `text-base`              |
| Small Caption     | Inter / Poppins | 400    | 14px      | `text-sm`                |
| Button Text       | Inter / Poppins | 500    | 16px      | `text-base font-medium`  |

---

## 🧱 Components & States

### 🔘 Button (Primary)
```html
<button class="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition">
  Açıklama Oluştur
</button>

States: hover, disabled, loading
Use disabled:opacity-50 and cursor-not-allowed.

✏️ Input Field
html
Copy
Edit
<div class="flex flex-col gap-1">
  <label for="productName" class="text-sm text-gray-600">Ürün Adı</label>
  <input id="productName" type="text"
    class="border border-gray-300 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2 text-gray-900"
    placeholder="Örn: Lüks Deri Cüzdan" />
</div>
States: focus, error, disabled

📤 Dropdown / Select
html
Copy
Edit
<select class="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
  <option value="samimi">Samimi</option>
  <option value="profesyonel">Profesyonel</option>
  <option value="lüks">Lüks</option>
</select>
🧠 AI Output Card
html
Copy
Edit
<div class="bg-blue-50 p-4 rounded-xl shadow-sm">
  <h2 class="text-gray-900 font-medium text-base mb-2">Ürün Açıklaması</h2>
  <p class="text-gray-800 text-sm leading-relaxed">
    Gerçek deriden üretilmiş bu cüzdan, zarafeti ve işlevselliği bir arada sunar...
  </p>
  <div class="mt-3 flex justify-between items-center">
    <span class="text-green-500 text-xs font-medium">SEO Skoru: 87/100</span>
    <button class="text-blue-600 text-sm hover:underline">Kopyala</button>
  </div>
</div>
🔔 Toast Notification
html
Copy
Edit
<div class="fixed bottom-4 right-4 bg-green-500 text-white text-sm px-4 py-2 rounded shadow">
  Açıklama kopyalandı!
</div>
Show for 3 seconds. Use animate-fade-in-out (with Framer Motion or Tailwind animation utilities).

🧾 Popup / Modal
html
Copy
Edit
<div class="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Başarı!</h3>
  <p class="text-sm text-gray-600 mb-4">Ürün açıklamanız başarıyla oluşturuldu.</p>
  <div class="flex justify-end gap-2">
    <button class="text-gray-500 hover:underline">Kapat</button>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Yeni Oluştur</button>
  </div>
</div>
🧭 Layout Guidelines
Max container width: max-w-3xl mx-auto px-4

Spacing: Use gap-4, mb-6, and space-y-4 for clear grouping

Mobile First: Stack form fields vertically on small screens

Form Structure:

Ürün Adı

Kategori (dropdown)

Kısa Açıklama

Tonlama Seçimi

CTA Buton → AI Output Card → SEO skoru + kopyala

✅ Accessibility & Best Practices
Use aria-label for inputs/buttons where needed

Ensure color contrast > WCAG AA level (4.5:1)

Font sizes: min 14px, no placeholder-only inputs

Prefer button over clickable div for actions

Loading state: use skeleton or spinner

📦 Recommended Packages
Purpose	Package
Icons	lucide-react
Headless UI	@headlessui/react
Form Handling	react-hook-form
Toasts	sonner or react-hot-toast
Animation (optional)	framer-motion

📝 Sample Page Structure (Next.js App Router)
bash
Copy
Edit
/app
  /page.tsx               ← Ana açıklama üretici arayüzü
  /components/
    Button.tsx
    Input.tsx
    OutputCard.tsx
    Modal.tsx
  /styles/
    globals.css           ← Tailwind base + inter font
