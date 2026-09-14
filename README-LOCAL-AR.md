# تشغيل موقع منولي على جهازك

هذه الحزمة تحتوي على كود الموقع الكامل، الصور، أسئلة الاستبيان، صفحة النتائج، وملفات قاعدة البيانات المحلية.

## المتطلبات

- Node.js بالإصدار `22.13.0` أو أحدث.
- اتصال بالإنترنت في أول مرة فقط لتنزيل الحزم البرمجية.

## التشغيل

1. فك ضغط الملف وافتح Terminal داخل مجلد `manoly-website-local`.
2. فعّل pnpm وثبّت الحزم:

```bash
corepack enable
pnpm install
```

3. انسخ ملف `.env.example` باسم `.env`. كلمة سر صفحة النتائج مضبوطة على `0116`. غيّر قيمة `RESULTS_SESSION_SECRET` إلى نص طويل وعشوائي قبل التشغيل.
4. ابنِ الموقع:

```bash
pnpm run build
```

5. جهّز قاعدة البيانات المحلية مرة واحدة، بالترتيب:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_workable_loki.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_modern_bishop.sql
```

6. شغّل الموقع:

```bash
pnpm run dev
```

افتح الرابط الذي يظهر في Terminal، وغالبًا يكون `http://localhost:5173`.

## الاستخدام

- الاستبيان: الصفحة الرئيسية.
- النتائج: `/answers`
- كلمة سر النتائج: `0116`
- الإجابات تحفظ داخل قاعدة D1 محلية في مجلد `.wrangler` على جهازك.

لإيقاف الموقع اضغط `Ctrl + C` داخل Terminal.
