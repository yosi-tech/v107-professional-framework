# V107 Migration Guide — Core Business Entities & Backend Logic

## OVERVIEW
This document describes the 5 requested entities, their relationships to other tables, and ALL backend functions + automations that operate on them. Use this as a prompt/spec for rebuilding in a new Base44 app.

---

## 1. ENTITY SCHEMAS (copy as-is to entities/*.json)

### 1.1 Product
```json
{
  "name": "Product",
  "type": "object",
  "properties": {
    "name_he": { "type": "string", "description": "שם המוצר בעברית" },
    "name_en": { "type": "string", "description": "שם המוצר באנגלית" },
    "description_he": { "type": "string", "description": "תיאור המוצר בעברית" },
    "description_en": { "type": "string", "description": "תיאור המוצר באנגלית" },
    "price": { "type": "number", "description": "מחיר המוצר בשקלים" },
    "product_type": { "type": "string", "enum": ["full_report", "answers_download", "online_coaching_7days", "booster_track", "other"], "description": "סוג המוצר" },
    "active": { "type": "boolean", "default": true },
    "featured": { "type": "boolean", "default": false },
    "discount_eligible": { "type": "boolean", "default": true },
    "allowed_coupon_codes": { "type": "array", "items": { "type": "string" }, "description": "קודי קופון מותרים למוצר זה (אם ריק - כל הקופונים מותרים)" },
    "order": { "type": "integer", "default": 0 }
  },
  "required": ["name_he", "name_en", "price", "product_type"]
}
```
**Relations:** Product.product_type is the key that links to PaymentOrder.product_type and SimulatedPurchase.product_type. Products are READ by the Payment page to show prices and by admin to manage catalog. No RLS — public read.

---

### 1.2 SiteSettings
```json
{
  "name": "SiteSettings",
  "type": "object",
  "properties": {
    "setting_key": { "type": "string", "description": "מפתח ההגדרה (למשל: facebook_pixel, google_analytics)" },
    "setting_value": { "type": "string", "description": "ערך ההגדרה" },
    "description": { "type": "string" },
    "active": { "type": "boolean", "default": true }
  },
  "required": ["setting_key", "setting_value"]
}
```
**Relations:** Standalone key-value store. Used by frontend components to dynamically load tracking codes, feature flags, etc. No foreign keys. No RLS — public read, admin write.

---

### 1.3 EmailTemplate
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
    "content_he": { "type": "string", "description": "תוכן HTML של המייל בעברית" },
    "content_en": { "type": "string", "description": "תוכן HTML של המייל באנגלית" },
    "description_he": { "type": "string" },
    "description_en": { "type": "string" },
    "active": { "type": "boolean", "default": true },
    "include_coupon": { "type": "boolean", "default": false },
    "coupon_amount": { "type": "number" }
  },
  "required": ["template_type", "name_he", "name_en", "subject_he", "subject_en", "content_he", "content_en"]
}
```
**Relations:** EmailTemplate.template_type maps to EmailLog.email_type. Templates are managed by admins in the admin dashboard and consumed by backend email functions. NOTE: Currently most email functions have HARDCODED HTML templates in the function code itself, NOT reading from this entity. This entity is for admin-editable templates (future use / admin UI).

---

### 1.4 EmailLog
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
**Relations:**
- `related_user_email` → User.email (soft FK)
- `related_questionnaire_response_id` → QuestionnaireResponse.id (soft FK)
- `related_report_id` → GeneratedReport.id OR PaymentOrder.id (soft FK, used inconsistently)
- `email_type` → corresponds to EmailTemplate.template_type

**Purpose:** Deduplication. Every email-sending function checks EmailLog BEFORE sending to avoid sending the same email twice. Admin-only read/write.

---

### 1.5 PaymentOrder
```json
{
  "name": "PaymentOrder",
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["pending", "paid", "failed"], "default": "pending" },
    "amount": { "type": "number", "description": "סכום התשלום בשקלים" },
    "user_email": { "type": "string", "format": "email" },
    "user_name": { "type": "string" },
    "product_type": { "type": "string", "enum": ["full_report", "answers_download", "online_coaching_7days"] },
    "is_express": { "type": "boolean", "default": false },
    "questionnaire_response_id": { "type": "string" },
    "coupon_code": { "type": "string" },
    "coupon_id": { "type": "string" },
    "tranzila_reference": { "type": "string", "description": "TranzilaTK from payment gateway" },
    "confirmation_code": { "type": "string" },
    "raw_data": { "type": "string", "description": "Raw JSON from Tranzila notification" }
  },
  "required": ["status", "amount", "user_email", "product_type"]
}
```
**Relations:**
- `user_email` → User.email (soft FK)
- `questionnaire_response_id` → QuestionnaireResponse.id (soft FK)
- `coupon_id` → Coupon.id (soft FK)
- `product_type` → Product.product_type (semantic link)
- When status → "paid": triggers automation → updates User flags, marks GeneratedReport.purchased=true, marks Coupon.used=true
- No RLS (service role handles all writes from payment webhook)

---

## 2. RELATED ENTITIES (must also exist)

### 2.1 Coupon
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

### 2.2 QuestionnaireResponse (referenced by PaymentOrder, EmailLog, GeneratedReport)
- Has 107 questions (q1-q107), personal_info object, status (in_progress/completed/abandoned)
- Full schema available in data export

### 2.3 GeneratedReport (referenced by PaymentOrder confirmation flow)
- Contains domain_scores, executive_summary, action_plan, archetype, recommended_booster_track
- Marked `purchased=true` when PaymentOrder becomes "paid"

### 2.4 OnlineCoachingSubscription (created on online_coaching_7days purchase)
- 30-day daily email program
- Created automatically when product_type="online_coaching_7days" is paid

### 2.5 SimulatedPurchase (admin testing)
- Records admin-initiated test purchases (simulatePurchase function)

### 2.6 User (built-in, custom fields used)
- Custom fields written by payment flow: `has_purchased_full_report`, `has_purchased_answers_download`, `has_purchased_online_coaching`, `express_delivery`, `purchase_date`, `payment_amount`

---

## 3. BACKEND FUNCTIONS (recreate these)

### 3.1 tranzilaCreateHandshake — Payment Initiation
**Trigger:** Called from frontend Payment page
**Secrets needed:** `supplier`, `TranzilaPW`
**Logic:**
1. Authenticate user
2. Takes `{ sum }` from request body
3. Calls Tranzila API: `https://api.tranzila.com/v1/handshake/create?supplier=${supplier}&sum=${roundedSum}&TranzilaPW=${TranzilaPW}`
4. Extracts `thtk` (Transaction Handshake Token) from response
5. Returns `{ thtk, supplier, sum }` to frontend

### 3.2 tranzilaNotify — Payment Webhook (CRITICAL)
**Trigger:** Webhook called by Tranzila after payment attempt
**Auth:** Service role (no user auth — this is a webhook)
**Logic:**
1. Receives form data from Tranzila
2. Checks `Response` field: "000" or "0" = success
3. Matches to PaymentOrder: first by `cfield1` (order ID), fallback by amount + recent pending orders (30 min window)
4. On success:
   - Updates PaymentOrder → status="paid", stores tranzila_reference, confirmation_code, raw_data
   - Updates User: sets `has_purchased_full_report`/`has_purchased_answers_download`/`has_purchased_online_coaching`, `purchase_date`, `payment_amount`
   - If full_report: marks GeneratedReport.purchased=true
   - If coupon used: marks Coupon.used=true
5. On failure: Updates PaymentOrder → status="failed"
6. Always returns HTTP 200 (Tranzila requirement)

### 3.3 sendPaymentConfirmation — Post-Payment Email
**Trigger:** Entity automation on PaymentOrder UPDATE (when status changes to "paid")
**Logic:**
1. Checks old_data.status !== 'paid' && data.status === 'paid'
2. Checks EmailLog for duplicate prevention
3. Sends branded HTML confirmation email (bilingual HE/EN)
4. If full_report: includes link to report view
5. Creates EmailLog record

### 3.4 simulatePurchase — Admin Test Purchase
**Trigger:** Called from admin dashboard
**Auth:** Admin only
**Logic:**
1. Takes `{ userEmail, productType, price, expressDelivery, language }`
2. Updates User with purchase flags (same as real payment)
3. Sends confirmation email based on product type
4. If online_coaching_7days: creates OnlineCoachingSubscription
5. Creates SimulatedPurchase record for audit trail
6. Creates EmailLog record

### 3.5 sendAbandonmentReminder — Quick Reminder (10-30 min)
**Trigger:** Scheduled automation, every 15 minutes
**Logic:**
1. Finds QuestionnaireResponse with status="abandoned", updated 10-30 min ago
2. Checks EmailLog — skip if already sent `abandonment_incomplete` for this response
3. Sends encouraging email with link to continue questionnaire
4. Creates EmailLog record

### 3.6 sendAbandonmentSurvey — 96h Abandonment Survey
**Trigger:** Scheduled automation, every 6 hours (currently DISABLED)
**Logic:**
1. Finds QuestionnaireResponse with status in_progress/abandoned, updated >96h ago
2. Checks EmailLog, checks if user later completed another questionnaire
3. Sends email with survey link and 50₪ coupon offer
4. Creates EmailLog record

### 3.7 sendCompletionNoPurchase — Post-Completion Coupon
**Trigger:** Scheduled automation, every 6 hours
**Logic:**
1. Finds completed questionnaires from 24-48 hours ago
2. Checks no paid PaymentOrder exists for this user+questionnaire
3. Creates 100₪ Coupon (valid 30 days)
4. Sends email with coupon code and purchase link
5. Creates EmailLog record

### 3.8 sendReportReadyWithSurvey — Report Delivery Email
**Trigger:** Entity automation on GeneratedReport CREATE (currently DISABLED)
**Logic:**
1. Receives report data from automation payload
2. Checks EmailLog for duplicate
3. Sends email with link to view report + invitation to fill feedback survey (6 questions → 100% discount coupon "MEKORAVIM")
4. Creates EmailLog record

### 3.9 onQuestionnaireCompleted — Post-Questionnaire Email
**Trigger:** Entity automation on QuestionnaireResponse UPDATE (when status → "completed")
**Logic:** Sends immediate confirmation email after questionnaire completion

---

## 4. AUTOMATIONS TO RECREATE

### Entity Automations (event-driven):
| Name | Entity | Event | Function | Active |
|------|--------|-------|----------|--------|
| שליחת מייל אישור תשלום | PaymentOrder | update | sendPaymentConfirmation | ✅ |
| שליחת מייל אוטומטי בהשלמת שאלון | QuestionnaireResponse | update | onQuestionnaireCompleted | ✅ |
| שליחת מייל דוח מוכן + הזמנה לסקר | GeneratedReport | create | sendReportReadyWithSurvey | ❌ |
| יצירת נתיבי קריירה אוטומטית | GeneratedReport | create | autoGenerateCareerPaths | ✅ |

### Scheduled Automations (cron-style):
| Name | Interval | Function | Active |
|------|----------|----------|--------|
| עידוד להשלמת שאלון | Every 15 min | sendAbandonmentReminder | ✅ |
| מיילים לאחר סיום ללא רכישה | Every 6 hours | sendCompletionNoPurchase | ✅ |
| עידוד הרשמה לבוסטר | Every 12 hours | sendBoosterEncouragement | ✅ |
| מיילי נטישה לאחר 96 שעות | Every 6 hours | sendAbandonmentSurvey | ❌ |
| תזכורות סקר נטישה | Every 12 hours | sendSurveyReminders | ❌ |
| סימון שאלונים נטושים | Every 30 min | markAbandonedQuestionnaires | ❌ |
| שליחת מיילי בוסטר יומיים | Daily 7:00 AM | sendDailyBoosterEmails | ❌ |
| שליחת מיילים על מאמרים חדשים | Daily 7:00 AM | sendNewArticleEmail | ✅ |
| Anonymize Old Data (90 days) | Daily 10:00 PM | anonymizeOldQuestionnaireData | ✅ |

---

## 5. SECRETS NEEDED
| Secret Name | Description |
|-------------|-------------|
| `supplier` | Tranzila terminal/supplier name |
| `TranzilaPW` | Tranzila terminal password |
| `BASE44_APP_URL` | App public URL (e.g. https://v107.co.il) |
| `ANTHROPIC_API_KEY` | For report generation (Claude) |

---

## 6. DATA FLOW DIAGRAM

```
User fills Questionnaire → QuestionnaireResponse (status: in_progress → completed)
  ├─ automation: onQuestionnaireCompleted → sends email
  ├─ if abandoned 10-30 min: sendAbandonmentReminder → EmailLog
  ├─ if abandoned 96h: sendAbandonmentSurvey → EmailLog + Coupon
  └─ if completed, no purchase 24-48h: sendCompletionNoPurchase → EmailLog + Coupon

User clicks Purchase → Payment page reads Product prices
  ├─ Frontend creates PaymentOrder (status: pending)
  ├─ Frontend calls tranzilaCreateHandshake → gets token
  ├─ Tranzila iframe processes card
  └─ Tranzila calls tranzilaNotify webhook:
      ├─ Updates PaymentOrder → paid/failed
      ├─ Updates User flags (has_purchased_*)
      ├─ Marks GeneratedReport.purchased = true
      ├─ Marks Coupon.used = true
      └─ automation: sendPaymentConfirmation → EmailLog

Admin generates report → GeneratedReport created
  ├─ automation: autoGenerateCareerPaths
  └─ automation: sendReportReadyWithSurvey → EmailLog (disabled)

Admin simulates purchase → simulatePurchase function
  ├─ Updates User, sends email, creates SimulatedPurchase
  └─ If coaching: creates OnlineCoachingSubscription
```

---

## 7. PROMPT FOR NEW APP

> Create a V107-compatible system with these entities: Product, SiteSettings, EmailTemplate, EmailLog, PaymentOrder, Coupon, QuestionnaireResponse, GeneratedReport, OnlineCoachingSubscription, SimulatedPurchase. 
>
> The payment flow uses Tranzila (Israeli payment gateway): create a handshake function (needs `supplier` and `TranzilaPW` secrets), and a webhook handler (`tranzilaNotify`) that receives form-data POSTs and updates PaymentOrder status. On successful payment, update User custom fields and mark related reports/coupons.
>
> Build an email deduplication system using EmailLog — every email function checks EmailLog before sending. Create scheduled automations for abandonment reminders (15 min), post-completion coupons (6h), and booster encouragement (12h). Create entity automations for payment confirmation (PaymentOrder update) and questionnaire completion (QuestionnaireResponse update).
>
> All emails are bilingual (Hebrew/English) with branded HTML templates. The system supports express delivery for full reports. Coupons can be single-use or multi-use, user-specific or general.

---

## 8. FRONTEND — PAYMENT PAGE (pages/Payment.js)

This is the complete Tranzila payment integration frontend. It handles:
- Product selection from URL params
- Coupon validation & application
- Zero-price flow (100% coupon skips Tranzila)
- PaymentOrder creation
- Tranzila handshake + iframe embedding
- postMessage listener for payment result

```jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { tranzilaCreateHandshake } from "@/functions/tranzilaCreateHandshake";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, CheckCircle, Loader2, FileText, Star, Clock, Zap, X, Tag, Lock } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const language = 'he'; // or from i18n context

  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [isExpress, setIsExpress] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [handshakeData, setHandshakeData] = useState(null);
  const [isLoadingHandshake, setIsLoadingHandshake] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setProduct(params.get('product'));
    const priceFromUrl = Number(params.get('price')) || 0;
    setPrice(priceFromUrl);
    setOriginalPrice(priceFromUrl);
    setIsExpress(params.get('express') === 'true');
    const urlResponseId = params.get('responseId') || params.get('responseid');
    setResponseId(urlResponseId && urlResponseId !== 'null' ? urlResponseId : null);
    checkUserStatus();
  }, [location.search]);

  // Auto-find responseId from user's latest completed questionnaire
  useEffect(() => {
    const fetchResponseId = async () => {
      if (responseId || !user) return;
      try {
        const responses = await base44.entities.QuestionnaireResponse.filter(
          { created_by: user.email, status: 'completed' }, '-updated_date', 1
        );
        if (responses.length > 0) setResponseId(responses[0].id);
      } catch (e) {}
    };
    fetchResponseId();
  }, [user, responseId]);

  const checkUserStatus = async () => {
    try { setUser(await base44.auth.me()); } catch (e) {}
  };

  // ── COUPON LOGIC ──
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError('');
    try {
      const coupons = await base44.entities.Coupon.filter({ code: couponCode.trim() });
      if (coupons.length === 0) { setCouponError('קוד קופון לא תקין'); setIsCheckingCoupon(false); return; }
      const coupon = coupons[0];
      const isSingleUse = coupon.is_single_use !== false;
      if (isSingleUse && coupon.used) { setCouponError('קוד הקופון כבר נוצל'); setIsCheckingCoupon(false); return; }
      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) { setCouponError('קוד הקופון פג תוקף'); setIsCheckingCoupon(false); return; }
      if (coupon.is_user_specific && user && coupon.user_email && coupon.user_email !== user.email) { setCouponError('קוד הקופון לא תקף עבור המשתמש הזה'); setIsCheckingCoupon(false); return; }
      let discount = coupon.discount_amount || Math.round(originalPrice * (coupon.discount_percentage / 100));
      setPrice(Math.max(0, originalPrice - discount));
      setAppliedCoupon(coupon);
    } catch (e) { setCouponError('שגיאה בבדיקת הקופון'); }
    setIsCheckingCoupon(false);
  };

  const removeCoupon = () => { setPrice(originalPrice); setAppliedCoupon(null); setCouponCode(''); };

  // ── PAYMENT INITIATION ──
  const initializePayment = async () => {
    if (!termsAccepted || !user) return;
    setIsLoadingHandshake(true);
    try {
      // 1. Create PaymentOrder
      const orderData = {
        status: price === 0 ? 'paid' : 'pending',
        amount: price,
        user_email: user.email,
        user_name: user.full_name || '',
        product_type: product,
        is_express: isExpress,
        questionnaire_response_id: responseId || null,
        coupon_code: appliedCoupon?.code || null,
        coupon_id: appliedCoupon?.id || null
      };
      const createdOrder = await base44.entities.PaymentOrder.create(orderData);
      setCurrentOrderId(createdOrder.id);

      // 2. If price is 0 (100% coupon), skip Tranzila
      if (price === 0) {
        const userUpdateData = { purchase_date: new Date().toISOString(), payment_amount: 0 };
        if (product === 'full_report') { userUpdateData.has_purchased_full_report = true; userUpdateData.express_delivery = isExpress; }
        else if (product === 'answers_download') { userUpdateData.has_purchased_answers_download = true; }
        else if (product === 'online_coaching_7days') { userUpdateData.has_purchased_online_coaching = true; }
        await base44.auth.updateMe(userUpdateData);
        if (appliedCoupon?.is_single_use !== false) await base44.entities.Coupon.update(appliedCoupon.id, { used: true });
        if (responseId && product === 'full_report') {
          try {
            const reports = await base44.entities.GeneratedReport.filter({ questionnaire_response_id: responseId }, '-created_date', 1);
            if (reports.length > 0) await base44.entities.GeneratedReport.update(reports[0].id, { purchased: true });
          } catch (e) {}
        }
        setIsLoadingHandshake(false);
        navigate("/ThankYou");
        return;
      }

      // 3. Get Tranzila handshake token
      const { data } = await tranzilaCreateHandshake({ sum: price });
      setHandshakeData(data);
    } catch (e) {
      alert('שגיאה ביצירת תשלום. נסה שוב.');
    }
    setIsLoadingHandshake(false);
  };

  // ── LISTEN FOR TRANZILA IFRAME POSTMESSAGE ──
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.iframe_message === 'success') {
        setIsProcessing(false);
        navigate("/ThankYou");
      } else if (event.data?.iframe_message === 'error') {
        setIsProcessing(false);
        alert('התשלום נכשל. נסה שוב.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ── TRANZILA IFRAME (rendered after handshake) ──
  // CRITICAL: The iframe URL format:
  // https://direct.tranzila.com/{supplier}/iframenew.php?
  //   sum={amount}&currency=1&cred_type=1&tranmode=A&new_process=1
  //   &thtk={handshake_token}
  //   &lang=il (or us for English)
  //   &buttonLabel={encoded_text}
  //   &trBgColor=f7fafc&trTextColor=1a202c&trButtonColor=2563eb
  //   &pdesc={product_description}
  //   &contact={user_name}
  //   &email={user_email}
  //   &cfield1={order_id}  ← CRITICAL: this is how tranzilaNotify matches the payment to the order!

  const iframeSrc = handshakeData ? 
    `https://direct.tranzila.com/${handshakeData.supplier}/iframenew.php?sum=${handshakeData.sum}&currency=1&cred_type=1&tranmode=A&new_process=1&thtk=${handshakeData.thtk}&lang=${language === 'he' ? 'il' : 'us'}&buttonLabel=${encodeURIComponent('שלם עכשיו')}&trBgColor=f7fafc&trTextColor=1a202c&trButtonColor=2563eb&pdesc=${encodeURIComponent(product || '')}&contact=${encodeURIComponent(user?.full_name || '')}&email=${encodeURIComponent(user?.email || '')}&cfield1=${encodeURIComponent(currentOrderId)}` 
    : '';

  return (
    <div dir="rtl">
      {/* Before handshake: show coupon input + terms checkbox + "Continue to Payment" button */}
      {/* After handshake: show Tranzila iframe */}
      {handshakeData && (
        <iframe
          title="Tranzila Payment"
          allowpaymentrequest="true"
          src={iframeSrc}
          style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
        />
      )}
    </div>
  );
}
```

### KEY TRANZILA IFRAME PARAMETERS:
| Parameter | Value | Description |
|-----------|-------|-------------|
| `sum` | from handshake | Payment amount in ILS |
| `currency` | `1` | ILS (Israeli Shekel) |
| `cred_type` | `1` | Regular credit card |
| `tranmode` | `A` | Authorization mode |
| `new_process` | `1` | Use new Tranzila process |
| `thtk` | from handshake | Transaction Handshake Token |
| `lang` | `il` or `us` | Hebrew or English |
| `cfield1` | order ID | **CRITICAL** — PaymentOrder.id sent to webhook for matching |
| `pdesc` | product name | Product description shown in Tranzila |
| `contact` | user name | Customer name |
| `email` | user email | Customer email |

### TRANZILA WEBHOOK SETUP:
In Tranzila's terminal settings, configure the "notify URL" to point to the `tranzilaNotify` backend function's webhook URL. Tranzila POSTs form-data to this URL after every payment attempt.

---

## 9. FRONTEND — COMPLETION PAGE (pages/Completion.js)

Post-questionnaire page that shows product cards and links to Payment. Key logic:
- Loads active products from Product entity (filtered to `full_report` type)
- Applies URL-based discount (`?discount=10` = 10% off)
- Sorts products: answers_download → full_report (recommended) → express full_report
- "Not sure?" section sends abandonment email + survey link
- Links to Payment page with URL params: `?product={type}&price={amount}&express={true/false}&responseId={id}`

---

## 10. FRONTEND — THANK YOU PAGE (pages/ThankYou.js)

Post-payment success page. Key logic:
- Reads user flags: `has_purchased_full_report`, `has_purchased_answers_download`, `express_delivery`
- Full report: shows delivery timeline (3 or 7 business days), consultation request button
- Answers download: shows download button + upsell to full report
- Consultation request sends email via `Core.SendEmail`

---

## 11. FRONTEND — SUPPORTING COMPONENTS

### components/payment/MemberCard.jsx
Visual "credit card" style display showing user name + plan name. Decorative only.

### components/payment/OrderSummary.jsx
Sticky sidebar with:
- Product line item + original price
- Express delivery (if applicable)
- Booster access (included)
- Coupon discount line (if applied)
- VAT calculation (18% — prices are VAT-inclusive, breakdown shows `price / 1.18`)
- Total
- Security badge + card logos

### components/checkout/CheckoutProgressBar.jsx
4-step progress bar: מילוי שאלון → בחירת חבילה → תשלום → סיום
Steps: `questionnaire` → `choose` → `payment` → `done`

---

## 12. COMPLETE USER FLOW SUMMARY

```
1. User completes questionnaire → QuestionnaireResponse (status: completed)
2. Redirect to /Completion?responseId={id}
   └─ Completion page loads Product entity, shows pricing cards
3. User clicks product → navigates to /Payment?product=full_report&price=299&responseId={id}
4. Payment page:
   a. User optionally enters coupon → validated against Coupon entity
   b. User accepts terms → clicks "Continue to Payment"
   c. Frontend creates PaymentOrder (status: pending)
   d. Frontend calls tranzilaCreateHandshake backend function → gets thtk token
   e. Tranzila iframe renders with thtk + cfield1=orderId
   f. User enters card details in iframe
   g. Tranzila processes payment
   h. Tranzila POSTs to tranzilaNotify webhook:
      - Matches order by cfield1 (order ID) or fallback by amount
      - Updates PaymentOrder → paid/failed
      - Updates User flags
      - Marks GeneratedReport.purchased=true
      - Marks Coupon.used=true
   i. Tranzila iframe sends postMessage → frontend navigates to /ThankYou
5. PaymentOrder automation fires → sendPaymentConfirmation → sends email
``