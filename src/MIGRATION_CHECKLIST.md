# 📋 V107 Migration Checklist — מהישנה לחדשה

## סטטוס כללי: 🟡 בתהליך

---

## 1. 📰 מאמרים (Articles) ✅ הושלם
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: Article | ✅ הושלם | Schema + data |
| Page: Articles | ✅ הושלם | רשימת מאמרים |
| Page: ArticleDetails | ✅ הושלם | מאמר בודד |
| Function: sendNewArticleEmail | ✅ הושלם | |
| תיעוד במיגרציה | ✅ הושלם | §1 |

---

## 2. ⭐ עדויות (Testimonials) ✅ הושלם
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: Testimonial | ✅ הושלם | Schema נוצר |
| Data: 13 עדויות | ✅ הושלם | יובאו |
| Component: TestimonialsSection | ✅ הושלם | בדף הבית |
| תיעוד במיגרציה | ✅ הושלם | §2 |

---

## 3. 🎟️ קופונים (Coupons) ✅ הושלם
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: Coupon | ✅ הושלם | Schema + RLS |
| Frontend: Payment validation | ✅ הושלם | |
| Admin: ContentManager CRUD | ✅ הושלם | |
| תיעוד במיגרציה | ✅ הושלם | §3 |

---

## 4. 📩 פניות (Contact) ✅ הושלם
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: ContactInquiry | ✅ הושלם | Schema + RLS |
| Page: Contact | ✅ הושלם | טופס צור קשר |
| Layout: Newsletter | ✅ הושלם | בפוטר |
| תיעוד במיגרציה | ✅ הושלם | §4 |

---

## 5. 📄 דפים סטטיים ✅ הושלם
| חלק | סטטוס | הערות |
|------|--------|-------|
| Page: Home | ✅ הושלם | 8 סקציות |
| Page: About | ✅ הושלם | |
| Page: TermsOfService | ✅ הושלם | |
| Page: PrivacyPolicy | ✅ הושלם | |
| Page: AccessibilityStatement | ✅ הושלם | |
| Page: CareerPaths | ✅ הושלם | |
| Layout + i18n | ✅ הושלם | |
| תיעוד במיגרציה | ✅ הושלם | §5 |

---

## 6. 🏷️ מוצרים (Products) 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: Product | ⬜ טרם התחיל | Schema מתועד ב-§6 |
| Data: מוצרים | ⬜ טרם התחיל | ייצוא דרך migExportProducts |
| Page: Completion | ⬜ טרם התחיל | קורא Product entity |
| Admin: ContentManager CRUD | ⬜ טרם התחיל | כולל קופונים מהירים |
| תיעוד במיגרציה | ✅ הושלם | §6 |

---

## 7. 💳 תשלומים (Payments) 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: PaymentOrder | ⬜ טרם התחיל | Schema מתועד ב-§7 |
| Entity: EmailLog | ⬜ טרם התחיל | Schema מתועד ב-§7 |
| Function: tranzilaCreateHandshake | ⬜ טרם התחיל | קוד מלא ב-§7 |
| Function: tranzilaNotify | ⬜ טרם התחיל | קוד מלא ב-§7 |
| Function: sendPaymentConfirmation | ⬜ טרם התחיל | קוד מלא ב-§7 |
| Page: Payment | ⬜ טרם התחיל | תיעוד מלא ב-§7 |
| Page: ThankYou | ⬜ טרם התחיל | |
| Components: MemberCard, OrderSummary, CheckoutProgressBar | ⬜ טרם התחיל | |
| Automation: PaymentOrder update → sendPaymentConfirmation | ⬜ טרם התחיל | |
| תיעוד במיגרציה | ✅ הושלם | §7 |

---

## 8. 📧 תבניות מייל (Email Templates) 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: EmailTemplate | ⬜ טרם התחיל | Schema מתועד ב-§8 |
| Data: תבניות | ⬜ טרם התחיל | ייצוא דרך migExportEmailTemplates |
| Component: EmailTemplatesTab | ⬜ טרם התחיל | תיעוד ב-§8 |
| Component: EmailTemplateDialog | ⬜ טרם התחיל | |
| תיעוד במיגרציה | ✅ הושלם | §8 |

---

## 9. ⚙️ הגדרות אתר (Site Settings) 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: SiteSettings | ⬜ טרם התחיל | Schema מתועד ב-§9 |
| Data: הגדרות | ⬜ טרם התחיל | ייצוא דרך migExportSiteSettings |
| **שימו לב:** הפרונטנד לא קורא מהאנטיטי | ⚠️ | GTM ונגישות מוטמעים קשיח בלייאאוט |
| תיעוד במיגרציה | ✅ הושלם | §9 |

---

## 10. 📝 תוכן דינמי (Content Items) 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| Entity: ContentItem | ⬜ טרם התחיל | Schema מתועד ב-§10 |
| Data: תוכן | ⬜ טרם התחיל | ייצוא דרך migExportContentItems |
| Admin: ContentManager | ⬜ טרם התחיל | תיעוד ב-§10 |
| **שימו לב:** דפי הפרונטנד לא קוראים מהאנטיטי | ⚠️ | התוכן הקשיח ב-JSX |
| תיעוד במיגרציה | ✅ הושלם | §10 |

---

## 11. 🖥️ דף אדמין — איחוד 📋 לבנייה
| חלק | סטטוס | הערות |
|------|--------|-------|
| AdminReports.jsx (11 טאבים) | ⬜ טרם התחיל | תיעוד מלא ב-§11 |
| UsersTab | ⬜ טרם התחיל | |
| AbandonedTab | ⬜ טרם התחיל | |
| PaymentsTab | ⬜ טרם התחיל | |
| EmailTemplatesTab | ⬜ טרם התחיל | |
| ContentManager | ⬜ טרם התחיל | |
| BoostersTab | ⬜ טרם התחיל | |
| SurveyResultsTab | ⬜ טרם התחיל | |
| AdvancedAnalyticsTab | ⬜ טרם התחיל | |
| ScheduledTasksManager | ⬜ טרם התחיל | |
| SiteAnalyticsTab | ⬜ טרם התחיל | |
| AdminDialogs (6 דיאלוגים) | ⬜ טרם התחיל | |
| תיעוד במיגרציה | ✅ הושלם | §11 |

---

## 12. ⏭️ דולגו בכוונה (SKIPPED)
| חלק | סיבה | הערות |
|------|-------|-------|
| Entity: SimulatedPurchase | עדיפות נמוכה | אנטיטי לוגים לרכישות מדומות, לא קריטי |
| Entity: SurveyResponse + Page: Survey | פיצ'ר משני | סקר נטישה, האוטומציה כבויה במערכת הישנה |
| Function: sendAbandonmentReminder | עדיפות נמוכה | תזכורת כל 15 דק', ניתן להוסיף אח"כ |
| Function: sendCompletionNoPurchase | עדיפות נמוכה | מייל קופון אחרי סיום, ניתן להוסיף אח"כ |
| Function: sendAbandonmentSurvey | כבוי | כבוי במערכת הישנה |
| Function: sendSurveyReminders | כבוי | כבוי במערכת הישנה |
| Function: markAbandonedQuestionnaires | כבוי | כבוי במערכת הישנה |
| Function: sendDailyBoosterEmails | כבוי | כבוי במערכת הישנה |
| Function: sendFlashSale49 | חד-פעמי | פונקציה פרומושנלית חד-פעמית |
| תיעוד במיגרציה | ✅ הושלם | §12 |

---

### סימונים:
- ⬜ טרם התחיל
- 🟡 בתהליך
- ✅ הושלם
- ⏭️ דולג בכוונה
- ⚠️ אזהרה / שימו לב