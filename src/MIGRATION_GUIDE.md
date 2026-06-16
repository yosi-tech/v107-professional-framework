# V107 Migration Guide — Complete System Documentation

## TABLE OF CONTENTS

| # | Section | Status |
|---|---------|--------|
| 1 | Articles | ✅ DONE |
| 2 | Testimonials | ✅ DONE |
| 3 | Coupons | ✅ DONE |
| 4 | Contact | ✅ DONE |
| 5 | Static Pages | ✅ DONE |
| 6 | Products | 📋 TO BUILD |
| 7 | Payments | 📋 TO BUILD |
| 8 | Email Templates | 📋 TO BUILD |
| 9 | Site Settings | 📋 TO BUILD |
| 10 | Content Items | 📋 TO BUILD |
| 11 | Admin Dashboard — Unified | 📋 TO BUILD |
| 12 | Skipped On Purpose | ⏭️ SKIPPED |
| 13 | Secrets & Automations | 📋 REFERENCE |

---

## 1. ARTICLES ✅ DONE

### Entity: Article
```json
{
  "name": "Article",
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "slug": { "type": "string" },
    "content": { "type": "string", "description": "Full content in Markdown format" },
    "image_url": { "type": "string" },
    "keywords": { "type": "array", "items": { "type": "string" } },
    "status": { "type": "string", "enum": ["draft", "published"], "default": "published" }
  },
  "required": ["title", "slug", "content"]
}
```

### Pages
- **Articles** — List page showing published articles, search/filter by keywords
- **ArticleDetails** — Single article view, renders Markdown content

### Backend Function
- **sendNewArticleEmail** — Scheduled daily 7:00 AM. Finds articles created in last 24h, sends notification email to subscribed users.

### Admin
- Article CRUD in ContentManager tab (create/edit/delete, Markdown editor, keywords, status toggle)

---

## 2. TESTIMONIALS ✅ DONE

### Entity: Testimonial
```json
{
  "name": "Testimonial",
  "type": "object",
  "properties": {
    "quote_he": { "type": "string" },
    "quote_en": { "type": "string" },
    "name": { "type": "string" },
    "title_he": { "type": "string" },
    "title_en": { "type": "string" },
    "stars": { "type": "number" }
  },
  "required": ["quote_he", "name", "title_he", "stars"],
  "rls": { "write": { "created_by": "{{user.email}}" } }
}
```

### Frontend
- **TestimonialsSection** component on Home page — displays testimonial cards with star ratings, bilingual

### Data
- 13 testimonials imported from old system

---

## 3. COUPONS ✅ DONE

### Entity: Coupon
```json
{
  "name": "Coupon",
  "type": "object",
  "properties": {
    "code": { "type": "string" },
    "discount_amount": { "type": "number" },
    "discount_percentage": { "type": "number" },
    "valid_until": { "type": "string", "format": "date-time" },
    "used": { "type": "boolean", "default": false },
    "is_single_use": { "type": "boolean", "default": true },
    "is_user_specific": { "type": "boolean", "default": false },
    "user_email": { "type": "string" },
    "source": { "type": "string", "enum": ["abandonment_survey", "promotion", "referral"] }
  },
  "required": ["code"],
  "rls": {
    "create": { "user_condition": { "role": "admin" } },
    "read": { "$or": [{ "data.user_email": "{{user.email}}" }, { "user_condition": { "role": "admin" } }] },
    "update": { "user_condition": { "role": "admin" } },
    "delete": { "user_condition": { "role": "admin" } }
  }
}
```

### Frontend Usage
- **Payment page** validates coupons: checks code, single-use status, expiry, user-specificity
- **Admin ContentManager** — full CRUD for coupons (code, amounts, percentages, expiry, source)
- **Backend functions** create coupons automatically (sendCompletionNoPurchase creates 100₪ coupon)

---

## 4. CONTACT ✅ DONE

### Entity: ContactInquiry
```json
{
  "name": "ContactInquiry",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string" },
    "message": { "type": "string" },
    "status": { "type": "string", "enum": ["new", "in_progress", "resolved"], "default": "new" },
    "source": { "type": "string", "default": "website_contact_form" }
  },
  "required": ["name", "email", "message"],
  "rls": {
    "read": { "$or": [{ "created_by": "{{user.email}}" }, { "user_condition": { "role": "admin" } }] },
    "write": { "$or": [{ "created_by": "{{user.email}}" }, { "user_condition": { "role": "admin" } }] }
  }
}
```

### Pages
- **Contact** — Contact form page (name, email, phone, message)
- **Layout footer** — Newsletter subscription also creates ContactInquiry with source `newsletter_footer`

---

## 5. STATIC PAGES ✅ DONE

| Page | Description |
|------|-------------|
| **Home** | Landing page with 8 sections: Hero, Social Proof, HowItWorks, ValueCards, PricingCTA, Testimonials, FAQ, Community |
| **About** | "How it works" explainer page |
| **TermsOfService** | Legal terms of service |
| **PrivacyPolicy** | Privacy policy |
| **AccessibilityStatement** | Accessibility statement |
| **CareerPaths** | Career paths visualization |

### Shared Components
- Layout with header/footer, language toggle, mobile menu
- i18n system (LanguageContext, useTranslation, translations file)
- InsightOrb, HeroDashboard, FAQSection, TrustBadges, etc.

---

## 6. PRODUCTS 📋 TO BUILD

### Entity: Product
```json
{
  "name": "Product",
  "type": "object",
  "properties": {
    "name_he": { "type": "string", "description": "שם המוצר בעברית" },
    "name_en": { "type": "string", "description": "שם המוצר באנגלית" },
    "description_he": { "type": "string" },
    "description_en": { "type": "string" },
    "price": { "type": "number", "description": "מחיר בשקלים" },
    "product_type": { "type": "string", "enum": ["full_report", "answers_download", "online_coaching_7days", "booster_track", "other"] },
    "active": { "type": "boolean", "default": true },
    "featured": { "type": "boolean", "default": false },
    "discount_eligible": { "type": "boolean", "default": true },
    "allowed_coupon_codes": { "type": "array", "items": { "type": "string" } },
    "order": { "type": "integer", "default": 0 }
  },
  "required": ["name_he", "name_en", "price", "product_type"]
}
```
No RLS — public read.

### Where Product Is Used

#### Completion Page (pages/Completion.js) — Primary Consumer
The Completion page fetches active products and renders pricing cards:
```js
const data = await base44.entities.Product.filter({ active: true });
const completionProducts = data.filter(p => p.product_type === 'full_report');
```

**Product card logic:**
- Products with `name_he` containing "מואץ" → express delivery (`sortOrder: 3`)
- Products without "מואץ" → standard full report (`sortOrder: 2`, `recommended: true`)
- `answers_download` type → basic tier (`sortOrder: 1`)
- URL-based discount: `?discount=10` applies 10% multiplier
- Each card links to: `/Payment?product={type}&price={calculated}&express={bool}&responseId={id}`

#### Admin ContentManager — Product CRUD
Full CRUD with fields: name_he, name_en, description_he, description_en, price, product_type, active, featured, discount_eligible, allowed_coupon_codes, order.

Quick coupon creation dialog: creates Coupon entity and adds code to product's `allowed_coupon_codes`.

#### Payment Page — Does NOT Read Product Entity
Payment receives price and type via URL params from Completion page. It only reads: Coupon, QuestionnaireResponse, PaymentOrder, GeneratedReport, User.

### Data to Import
Export existing products via `migExportProducts` function or DataExport page.

---

## 7. PAYMENTS 📋 TO BUILD

### Entity: PaymentOrder
```json
{
  "name": "PaymentOrder",
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["pending", "paid", "failed"], "default": "pending" },
    "amount": { "type": "number" },
    "user_email": { "type": "string", "format": "email" },
    "user_name": { "type": "string" },
    "product_type": { "type": "string", "enum": ["full_report", "answers_download", "online_coaching_7days"] },
    "is_express": { "type": "boolean", "default": false },
    "questionnaire_response_id": { "type": "string" },
    "coupon_code": { "type": "string" },
    "coupon_id": { "type": "string" },
    "tranzila_reference": { "type": "string" },
    "confirmation_code": { "type": "string" },
    "raw_data": { "type": "string" }
  },
  "required": ["status", "amount", "user_email", "product_type"]
}
```
No RLS (service role handles writes from webhook).

### Entity: EmailLog
```json
{
  "name": "EmailLog",
  "type": "object",
  "properties": {
    "to_email": { "type": "string" },
    "email_type": { "type": "string", "enum": ["full_report_purchase", "answers_download_purchase", "abandonment_survey", "report_ready", "consultation_request", "questionnaire_completion"] },
    "subject": { "type": "string" },
    "related_user_email": { "type": "string" },
    "related_questionnaire_response_id": { "type": "string" },
    "related_report_id": { "type": "string" },
    "sent_manually": { "type": "boolean", "default": false },
    "language": { "type": "string", "enum": ["he", "en"], "default": "he" }
  },
  "required": ["to_email", "email_type", "subject"],
  "rls": {
    "read": { "user_condition": { "role": "admin" } },
    "write": { "user_condition": { "role": "admin" } }
  }
}
```

### Backend Function: tranzilaCreateHandshake (FULL SOURCE)
**Trigger:** Called from frontend Payment page
**Secrets:** `supplier`, `TranzilaPW`

```js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { sum } = await req.json();
    if (!sum || sum <= 0) return Response.json({ error: 'Invalid sum' }, { status: 400 });
    const roundedSum = Math.round(sum);

    const supplier = Deno.env.get('supplier');
    const TranzilaPW = Deno.env.get('TranzilaPW');
    if (!supplier || !TranzilaPW) return Response.json({ error: 'Missing Tranzila credentials' }, { status: 500 });

    const handshakeUrl = `https://api.tranzila.com/v1/handshake/create?supplier=${supplier}&sum=${roundedSum}&TranzilaPW=${TranzilaPW}`;
    const response = await fetch(handshakeUrl);
    const data = await response.text();

    let thtk = data.trim();
    if (thtk.startsWith('thtk=')) thtk = thtk.substring(5);

    return Response.json({ thtk, supplier, sum: roundedSum });
  } catch (error) {
    return Response.json({ error: 'Failed to create handshake', details: error.message }, { status: 500 });
  }
});
```

### Backend Function: tranzilaNotify (FULL SOURCE — CRITICAL)
**Trigger:** Webhook called by Tranzila after payment attempt
**Auth:** Service role (no user auth — webhook)

```js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.formData();
    const notify = {};
    for (const [key, value] of formData.entries()) notify[key] = value;

    const responseCode = notify["Response"];
    const amount = parseFloat(notify["sum"] || 0);
    const roundedAmount = Math.round(amount);
    const isSuccess = responseCode === "000" || responseCode === "0";

    // Match order by cfield1 (order ID) first, fallback by amount + 30min window
    const orderId = notify["cfield1"] || null;
    let order = null;

    if (orderId) {
      try {
        const exactOrders = await base44.asServiceRole.entities.PaymentOrder.filter({ id: orderId, status: 'pending' }, '-created_date', 1);
        if (exactOrders.length > 0) order = exactOrders[0];
      } catch (e) {}
    }

    if (!order) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const orders = await base44.asServiceRole.entities.PaymentOrder.filter({ status: 'pending', amount: roundedAmount }, '-created_date', 10);
      const recentOrders = orders.filter(o => new Date(o.created_date) >= new Date(thirtyMinutesAgo));
      if (recentOrders.length > 0) order = recentOrders[0];
    }

    if (order) {
      await base44.asServiceRole.entities.PaymentOrder.update(order.id, {
        status: isSuccess ? "paid" : "failed",
        tranzila_reference: notify["TranzilaTK"] || null,
        confirmation_code: notify["ConfirmationCode"] || null,
        raw_data: JSON.stringify(notify)
      });

      if (isSuccess) {
        const userUpdateData = { purchase_date: new Date().toISOString(), payment_amount: order.amount };
        if (order.product_type === 'full_report') { userUpdateData.has_purchased_full_report = true; userUpdateData.express_delivery = order.is_express || false; }
        else if (order.product_type === 'answers_download') userUpdateData.has_purchased_answers_download = true;
        else if (order.product_type === 'online_coaching_7days') userUpdateData.has_purchased_online_coaching = true;

        const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
        if (users.length > 0) await base44.asServiceRole.entities.User.update(users[0].id, userUpdateData);

        if (order.questionnaire_response_id && order.questionnaire_response_id !== 'null' && order.product_type === 'full_report') {
          try {
            const reports = await base44.asServiceRole.entities.GeneratedReport.filter({ questionnaire_response_id: order.questionnaire_response_id }, '-created_date', 1);
            if (reports.length > 0) await base44.asServiceRole.entities.GeneratedReport.update(reports[0].id, { purchased: true });
          } catch (e) {}
        }

        if (order.coupon_id) {
          try { await base44.asServiceRole.entities.Coupon.update(order.coupon_id, { used: true }); } catch (e) {}
        }
      }
    }

    return new Response('OK', { status: 200 }); // ALWAYS 200 for Tranzila
  } catch (error) {
    return new Response('OK', { status: 200 }); // ALWAYS 200
  }
});
```

### Backend Function: sendPaymentConfirmation (FULL SOURCE)
**Trigger:** Entity automation on PaymentOrder UPDATE (status → "paid")

```js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const orderId = body?.event?.entity_id;
    const orderData = body?.data;
    const oldData = body?.old_data;

    if (!orderId) return Response.json({ skipped: true, reason: 'no entity_id' });
    if (orderData?.status !== 'paid' || oldData?.status === 'paid') return Response.json({ skipped: true, reason: 'status not changed to paid' });

    const userEmail = orderData.user_email;
    const userName = orderData.user_name || userEmail;
    const amount = orderData.amount || 0;
    const productType = orderData.product_type;
    if (!userEmail) return Response.json({ skipped: true, reason: 'no user email' });

    // Dedup check
    try {
      const existingLogs = await base44.asServiceRole.entities.EmailLog.filter({ related_report_id: orderId, email_type: 'full_report_purchase' }, '-created_date', 1);
      if (existingLogs.length > 0) return Response.json({ skipped: true, reason: 'already sent' });
    } catch (e) {}

    const language = 'he';
    const appUrl = Deno.env.get('BASE44_APP_URL') || 'https://app.base44.com';
    const productNames = { full_report: 'דוח V107 המלא', answers_download: 'הורדת תשובות השאלון', online_coaching_7days: 'ליווי מקוון – 7 ימים' };
    const productName = productNames[productType] || productType;

    let reportLink = '';
    if (productType === 'full_report' && orderData.questionnaire_response_id) {
      try {
        const reports = await base44.asServiceRole.entities.GeneratedReport.filter({ questionnaire_response_id: orderData.questionnaire_response_id }, '-created_date', 1);
        if (reports.length > 0) reportLink = `${appUrl}/ReportView?reportId=${reports[0].id}`;
      } catch (e) {}
    }

    const subject = `✅ אישור תשלום – ${productName}`;
    const emailBody = `
      <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #FF8F00; font-size: 28px; margin: 0;">107V</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0;">אישור תשלום</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #1a202c; margin-top: 0;">שלום ${userName},</h2>
          <p style="color: #4a5568; font-size: 16px;">התשלום שלך בוצע בהצלחה! 🎉</p>
          <div style="background: #f7fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #718096;">מוצר:</td><td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${productName}</td></tr>
              <tr><td style="padding: 8px 0; color: #718096;">סכום:</td><td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${amount} ₪</td></tr>
              <tr><td style="padding: 8px 0; color: #718096;">מזהה הזמנה:</td><td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${orderId}</td></tr>
            </table>
          </div>
          ${reportLink ? `<div style="text-align: center; margin: 30px 0;"><a href="${reportLink}" style="display: inline-block; background: #FF8F00; color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: bold;">צפה בדוח שלך →</a></div>` : `<p style="color: #4a5568; font-size: 14px; text-align: center;">הדוח שלך יהיה מוכן תוך 24 שעות.</p>`}
          <p style="color: #718096; font-size: 13px; margin-top: 30px; text-align: center;">שאלות? <a href="${appUrl}/Contact" style="color: #FF8F00;">צרו קשר</a></p>
        </div>
        <div style="background: #f7fafc; padding: 15px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 V107. כל הזכויות שמורות.</p>
        </div>
      </div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({ to: userEmail, subject, body: emailBody, from_name: 'V107' });
    await base44.asServiceRole.entities.EmailLog.create({ to_email: userEmail, email_type: 'full_report_purchase', subject, related_user_email: userEmail, related_report_id: orderId, language });

    return Response.json({ success: true, email_sent_to: userEmail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
```

### Frontend: Payment Page (pages/Payment.js)

**Complete flow:**
1. Reads product type, price, express flag, responseId from URL params
2. Coupon validation & application (checks code, expiry, single-use, user-specific)
3. Zero-price flow: if 100% coupon discount → skip Tranzila, mark order as paid directly, update User flags
4. Creates PaymentOrder (status: pending)
5. Calls `tranzilaCreateHandshake` → gets thtk token
6. Renders Tranzila iframe with handshake token
7. Listens for postMessage from iframe (success/error)
8. On success → navigates to /ThankYou

**Tranzila iframe URL format:**
```
https://direct.tranzila.com/{supplier}/iframenew.php?
  sum={amount}&currency=1&cred_type=1&tranmode=A&new_process=1
  &thtk={token}&lang=il
  &cfield1={order_id}  ← CRITICAL: matches payment to order in webhook
  &pdesc={product_name}&contact={user_name}&email={user_email}
```

**TRANZILA WEBHOOK SETUP:** In Tranzila terminal settings, configure "notify URL" → `tranzilaNotify` backend function webhook URL.

### Frontend: Completion Page (pages/Completion.js)
Post-questionnaire page showing product pricing cards:
- Loads active Product entities filtered to `full_report` type
- Applies URL discount (`?discount=10` = 10% off)
- Sorts: answers_download → full_report (recommended) → express
- "Not sure?" section → abandonment email + survey link
- Links to Payment page with URL params

### Frontend: ThankYou Page (pages/ThankYou.js)
Post-payment success:
- Reads User flags: `has_purchased_full_report`, `has_purchased_answers_download`, `express_delivery`
- Full report: delivery timeline (3 or 7 business days), consultation request button
- Answers download: download button + upsell
- Consultation request → Core.SendEmail

### Supporting Components
- **components/payment/MemberCard.jsx** — Visual "credit card" style display (decorative)
- **components/payment/OrderSummary.jsx** — Sidebar with line items, VAT (18%), coupon discount, total, security badge
- **components/checkout/CheckoutProgressBar.jsx** — 4-step: מילוי שאלון → בחירת חבילה → תשלום → סיום

---

## 8. EMAIL TEMPLATES 📋 TO BUILD

### Entity: EmailTemplate
```json
{
  "name": "EmailTemplate",
  "type": "object",
  "properties": {
    "template_type": { "type": "string", "enum": ["abandonment_incomplete", "abandonment_reminder_96h", "abandonment_after_completion", "full_report_purchase", "answers_download_purchase", "online_coaching_purchase", "report_ready", "consultation_request", "questionnaire_completion", "booster_email"] },
    "trigger_event": { "type": "string", "enum": ["manual", "on_navigation_away", "after_96_hours", "after_completion_no_purchase", "on_purchase", "on_report_generation", "on_consultation_request", "on_questionnaire_submit", "daily_booster"] },
    "booster_track": { "type": "string", "enum": ["execution", "digital", "finance", "marketing", "management", "vision"] },
    "booster_day": { "type": "integer", "minimum": 1, "maximum": 7 },
    "name_he": { "type": "string" },
    "name_en": { "type": "string" },
    "subject_he": { "type": "string" },
    "subject_en": { "type": "string" },
    "content_he": { "type": "string", "description": "HTML content in Hebrew" },
    "content_en": { "type": "string", "description": "HTML content in English" },
    "description_he": { "type": "string" },
    "description_en": { "type": "string" },
    "active": { "type": "boolean", "default": true },
    "include_coupon": { "type": "boolean", "default": false },
    "coupon_amount": { "type": "number" }
  },
  "required": ["template_type", "name_he", "name_en", "subject_he", "subject_en", "content_he", "content_en"]
}
```

### IMPORTANT NOTE
Most backend email functions have **HARDCODED HTML templates** in the function code itself, NOT reading from this entity. The EmailTemplate entity is for **admin-editable templates** used via manual send from the admin dashboard.

### Admin UI: EmailTemplatesTab (components/admin/EmailTemplatesTab.jsx)
- Tabbed view: General templates + per-booster-track tabs (execution, digital, finance, marketing, management, vision)
- Each template card shows: name, type badge, trigger event badge, coupon info
- Preview with iframe (HE/EN toggle), replacing placeholders: `{userName}`, `{surveyUrl}`, `{questionnaireUrl}`, `{reportUrl}`, `{purchaseUrl}`, `{couponCode}`
- Edit/delete buttons, "create new" button

### Admin UI: EmailTemplateDialog (components/admin/EmailTemplateDialog.jsx)
- Full editor for creating/editing templates
- Fields: template_type, trigger_event, name (he/en), subject (he/en), content HTML (he/en), description, active toggle, include_coupon toggle, coupon_amount

### How Templates Are Sent (AdminReports.jsx)
```js
const sendManualEmailFromTemplate = async (template, response) => {
  const userEmail = response.personal_info?.email || response.created_by;
  const userName = response.personal_info?.full_name || 'משתמש';
  
  // Auto-create coupon if template.include_coupon
  let couponCode = null;
  if (template.include_coupon) {
    couponCode = `TEMPLATE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    await base44.entities.Coupon.create({ code: couponCode, discount_amount: template.coupon_amount || 50, valid_until: 30_days_from_now, user_email: userEmail, source: 'abandonment_survey' });
  }
  
  // Replace placeholders in HTML content
  let emailHtml = (language === 'he' ? template.content_he : template.content_en)
    .replace(/{userName}/g, userName)
    .replace(/{surveyUrl}/g, surveyUrl)
    .replace(/{questionnaireUrl}/g, questionnaireUrl)
    .replace(/{reportUrl}/g, reportUrl)
    .replace(/{purchaseUrl}/g, purchaseUrl)
    .replace(/{couponCode}/g, couponCode || '');
  
  await Core.SendEmail({ to: userEmail, subject, body: emailHtml });
  await EmailLog.create({ ... });
};
```

### Data to Import
Export existing templates via `migExportEmailTemplates` function.

---

## 9. SITE SETTINGS 📋 TO BUILD

### Entity: SiteSettings
```json
{
  "name": "SiteSettings",
  "type": "object",
  "properties": {
    "setting_key": { "type": "string" },
    "setting_value": { "type": "string" },
    "description": { "type": "string" },
    "active": { "type": "boolean", "default": true }
  },
  "required": ["setting_key", "setting_value"]
}
```
No RLS — public read, admin write.

### Current Status: Barely Used by Frontend
**Important audit finding:** The SiteSettings entity exists and is populated, but **NO public-facing page reads from it**:
- GTM tag (`GTM-N68LLCXP`) is **hardcoded** in the layout
- Accessibility widget (`nagich.co.il`) is **hardcoded** in the layout
- Admin dashboard loads SiteSettings but only for display/management

### Where It Appears
- `AdminReports.jsx` — loads `base44.entities.SiteSettings.list()` on mount
- `DataExport.jsx` — exports SiteSettings as JSON

### Migration Recommendation
Recreate the entity and import data, but be aware the frontend hardcodes what should come from here. Consider connecting the layout to actually read tracking IDs from SiteSettings in the new system.

### Data to Import
Export via `migExportSiteSettings` function.

---

## 10. CONTENT ITEMS 📋 TO BUILD

### Entity: ContentItem
```json
{
  "name": "ContentItem",
  "type": "object",
  "properties": {
    "page": { "type": "string", "enum": ["home", "about", "articles", "terms"] },
    "section": { "type": "string" },
    "content_key": { "type": "string" },
    "content_type": { "type": "string", "enum": ["text", "image", "html"], "default": "text" },
    "content_he": { "type": "string" },
    "content_en": { "type": "string" },
    "description": { "type": "string" },
    "order": { "type": "integer", "default": 0 }
  },
  "required": ["page", "section", "content_key", "content_type"]
}
```

### Current Status: Admin-Only — NOT Used by Public Pages
**Important audit finding:** ContentItem is ONLY used in admin files:
- `components/admin/ContentManager.jsx` — CRUD UI
- `pages/AdminReports.jsx` — loads and passes to ContentManager
- `pages/DataExport.jsx` — exports data

**NO public page** (Home, About, Articles, etc.) reads ContentItem data. All page content is **hardcoded in JSX** or from the translation files.

### Admin UI: ContentManager (components/admin/ContentManager.jsx)
Large tabbed admin component managing 4 entity types:

**Content Items Tab (per page):**
- Pages: home, about, completion, booster, terms
- Sections within pages (hero, stats, benefits, etc.)
- Inline editing with Hebrew/English fields
- Auto-translate via InvokeLLM (Hebrew → English)
- Create/delete content items

**Also manages (in same component):**
- Articles tab — full CRUD
- Products tab — full CRUD
- Coupons tab — full CRUD

### Data to Import
Export via `migExportContentItems` function.

### Migration Recommendation
Recreate the entity and import data for admin management, but the public pages won't use it unless explicitly wired up.

---

## 11. ADMIN DASHBOARD — UNIFIED 📋 TO BUILD

### Overview
The admin dashboard (`pages/AdminReports.jsx`) is a single mega-page with 11 tabs that manages the entire system. It loads ALL data upfront and passes to child components.

### Data Loading (on mount)
```js
const [completedResponses, inProgressResponses, allReports, allUsers, allEmailLogs, 
       allEmailTemplates, allSurveyResponses, allSiteSettings, allBoosterSubscriptions, 
       allContentItems, allPaymentOrders] = await Promise.all([
  QuestionnaireResponse.filter({ status: 'completed' }, '-created_date'),
  QuestionnaireResponse.filter({ status: 'in_progress' }, '-created_date'),
  GeneratedReport.list('-created_date'),
  User.list(),
  EmailLog.list('-created_date'),
  EmailTemplate.list('-created_date'),
  SurveyResponse.list('-created_date'),
  SiteSettings.list(),
  OnlineCoachingSubscription.list('-created_date'),
  ContentItem.list(),
  PaymentOrder.list('-created_date')
]);
```

### Tabs and Components

| Tab | Component | Description |
|-----|-----------|-------------|
| **שאלונים (reports)** | Inline in AdminReports | Questionnaire list with filters, sorting, report generation, email sending, delete |
| **משתמשים** | `UsersTab` | User list with purchase status, email history |
| **נטשו** | `AbandonedTab` | Users who completed but didn't purchase, in-progress users |
| **תשלומים** | `PaymentsTab` | PaymentOrder list with status badges |
| **תבניות מייל** | `EmailTemplatesTab` | Email template management (see §8) |
| **ניהול תוכן** | `ContentManager` | CMS content + Articles + Products + Coupons (see §10) |
| **בוסטרים** | `BoostersTab` | OnlineCoachingSubscription management |
| **סקר** | `SurveyResultsTab` | SurveyResponse results display |
| **ניתוח מתקדם** | `AdvancedAnalyticsTab` | Advanced analytics on reports data |
| **תזמונים** | `ScheduledTasksManager` | View/manage scheduled automations |
| **תנועת אתר** | `SiteAnalyticsTab` | Google Analytics data (via getAnalyticsTraffic function) |

### Key Admin Actions
- **Generate report** — Invokes generateReportV7Pro / generateReportV6ProUltimate / generateReportAutomatic
- **Send report to client** — Bilingual email with branded HTML (hardcoded in AdminReports)
- **Simulate purchase** — Calls `simulatePurchase` backend function
- **Manual booster registration** — Calls `manualBoosterRegistration` backend function
- **Send email from template** — Picks template, replaces placeholders, sends + creates EmailLog
- **Delete questionnaire** — Also deletes related report and email logs

### Admin Dialogs (components/admin/AdminDialogs.jsx)
- `ViewResponseDialog` — View full questionnaire answers
- `ViewEmailsDialog` — View email history for a user
- `LanguageDialog` — Choose language before sending report
- `SimulationDialog` — Simulate purchase form (email, product, express, language)
- `TemplateSelectionDialog` — Pick email template to send
- `BoosterRegistrationDialog` — Manual booster registration

---

## 12. SKIPPED ON PURPOSE ⏭️

The following items exist in the old system but are **intentionally not migrated**:

### 12.1 Simulated Purchases (Entity: SimulatedPurchase)
**Why skipped:** This is an admin audit trail for test purchases via `simulatePurchase`. It's a low-priority logging entity. The function itself is documented in §7 but the entity can be recreated later if needed. Not critical for go-live.

### 12.2 Surveys (Entity: SurveyResponse, Page: Survey)
**Why skipped:** The abandonment survey system (survey page + SurveyResponse entity + sendAbandonmentSurvey function) is a secondary engagement feature. The survey page collects feedback from users who didn't purchase. The automation `sendAbandonmentSurvey` is currently **DISABLED** in the old system. Can be rebuilt later as a Phase 2 feature.

### 12.3 Additional Functions (פונקציות נוספות)
**Why skipped:** The following backend functions are secondary automations, most currently disabled:
- `sendAbandonmentReminder` — Scheduled every 15 min, sends reminder to abandoned questionnaires (10-30 min window). Lower priority, can be added later.
- `sendCompletionNoPurchase` — Scheduled every 6h, sends coupon to completed-no-purchase users. Lower priority, can be added later.
- `sendAbandonmentSurvey` — Currently DISABLED
- `sendSurveyReminders` — Currently DISABLED  
- `markAbandonedQuestionnaires` — Currently DISABLED
- `sendDailyBoosterEmails` — Currently DISABLED
- `sendFlashSale49` — Promotional function, one-time use

These can all be rebuilt as needed after the core system is live.

---

## 13. SECRETS & AUTOMATIONS — REFERENCE

### Secrets Needed
| Secret | Description |
|--------|-------------|
| `supplier` | Tranzila terminal/supplier name |
| `TranzilaPW` | Tranzila terminal password |
| `BASE44_APP_URL` | App public URL (e.g. https://v107.co.il) |
| `ANTHROPIC_API_KEY` | For report generation (Claude) |

### Entity Automations to Create
| Name | Entity | Event | Function | Active |
|------|--------|-------|----------|--------|
| שליחת מייל אישור תשלום | PaymentOrder | update | sendPaymentConfirmation | ✅ |
| שליחת מייל בהשלמת שאלון | QuestionnaireResponse | update | onQuestionnaireCompleted | ✅ |
| יצירת נתיבי קריירה | GeneratedReport | create | autoGenerateCareerPaths | ✅ |

### Scheduled Automations to Create
| Name | Interval | Function | Active |
|------|----------|----------|--------|
| עידוד הרשמה לבוסטר | Every 12 hours | sendBoosterEncouragement | ✅ |
| מיילים על מאמרים חדשים | Daily 7:00 AM | sendNewArticleEmail | ✅ |
| אנונימיזציה 90 יום | Daily 10:00 PM | anonymizeOldQuestionnaireData | ✅ |

### User Custom Fields (written by payment flow)
- `has_purchased_full_report` (boolean)
- `has_purchased_answers_download` (boolean)
- `has_purchased_online_coaching` (boolean)
- `express_delivery` (boolean)
- `purchase_date` (string/ISO)
- `payment_amount` (number)

---

## 14. COMPLETE USER FLOW SUMMARY

```
1. User completes questionnaire → QuestionnaireResponse (status: completed)
   └─ automation: onQuestionnaireCompleted → sends email with purchase CTA

2. Redirect to /Completion?responseId={id}
   └─ Completion page loads Product entity, shows pricing cards

3. User clicks product → /Payment?product=full_report&price=299&responseId={id}

4. Payment page:
   a. Optional coupon → validated against Coupon entity
   b. Accept terms → "Continue to Payment"
   c. Creates PaymentOrder (status: pending)
   d. Calls tranzilaCreateHandshake → gets thtk token
   e. Tranzila iframe renders with thtk + cfield1=orderId
   f. User enters card details
   g. Tranzila POSTs to tranzilaNotify webhook:
      - Updates PaymentOrder → paid/failed
      - Updates User flags (has_purchased_*)
      - Marks GeneratedReport.purchased=true
      - Marks Coupon.used=true
   h. Iframe postMessage → navigate to /ThankYou

5. PaymentOrder automation → sendPaymentConfirmation → branded email

6. Admin generates report → GeneratedReport created
   └─ automation: autoGenerateCareerPaths
``