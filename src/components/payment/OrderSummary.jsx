import React from "react";
import { ShieldCheck, Clock, Tag, Zap } from "lucide-react";

export default function OrderSummary({
  language,
  productTitle,
  originalPrice,
  price,
  appliedCoupon,
  isExpress,
  deliveryText,
}) {
  const vatRate = 0.18;
  const priceBeforeVat = Math.round((price / (1 + vatRate)) * 100) / 100;
  const vatAmount = Math.round((price - priceBeforeVat) * 100) / 100;

  return (
    <div className="sticky top-32 space-y-6">
      {/* Order Summary Card */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-border/50">
        <h3 className="text-lg font-bold mb-6">
          {language === 'he' ? 'סיכום הזמנה' : 'Order Summary'}
        </h3>
        <div className="space-y-4">
          {/* Product */}
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-muted-foreground">{productTitle}</span>
            <span className="font-bold">{originalPrice}₪</span>
          </div>

          {/* Express */}
          {isExpress && (
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                {language === 'he' ? 'אספקה מואצת' : 'Express Delivery'}
              </span>
              <span className="text-primary font-medium">
                {language === 'he' ? 'כלול' : 'Included'}
              </span>
            </div>
          )}

          {/* Booster */}
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-muted-foreground">
              {language === 'he' ? 'גישה ל-Booster' : 'Booster Access'}
            </span>
            <span className="text-primary font-medium">
              {language === 'he' ? 'כלול' : 'Included'}
            </span>
          </div>

          {/* Coupon discount */}
          {appliedCoupon && (
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-green-600 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {language === 'he' ? 'הנחת קופון' : 'Coupon Discount'}
              </span>
              <span className="text-green-600 font-bold">-{originalPrice - price}₪</span>
            </div>
          )}

          {/* VAT */}
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-muted-foreground">
              {language === 'he' ? 'מע״מ (18%)' : 'VAT (18%)'}
            </span>
            <span className="font-bold">{vatAmount.toFixed(2)}₪</span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-black">
              {language === 'he' ? 'סה״כ לתשלום' : 'Total'}
            </span>
            <span className="text-2xl font-black text-primary">{price}₪</span>
          </div>

          {/* Delivery */}
          {deliveryText && (
            <div className="text-sm text-muted-foreground pt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {deliveryText}
            </div>
          )}
        </div>
      </section>

      {/* Security Badge */}
      <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
        <div className="flex gap-4">
          <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h4 className="font-bold text-primary mb-1">
              {language === 'he' ? 'רכישה בטוחה ב-100%' : '100% Secure Purchase'}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'he'
                ? 'הפרטים שלך מוצפנים בפרוטוקול SSL המתקדם ביותר. אנחנו לא שומרים את פרטי הכרטיס במערכת שלנו.'
                : 'Your details are encrypted with the most advanced SSL protocol. We do not store your card details in our system.'}
            </p>
          </div>
        </div>
      </section>

      {/* Card Logos */}
      <div className="flex justify-center gap-6 opacity-40 grayscale">
        <img className="h-6" alt="Visa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm5vnadbMNTKAA4m4qiDtO9vLzSwuC-avbRS6JmMp3d9KDr96QNKqyy7bwsGy9p9tUOzzaePU5s8z_dH6k9MG8KHQK5Fdms9rs09IOGzSoDewYm0Rd4xGfRWE9u_Pr1iwhH6EQ8r9KvAO8014oaZOaN35IuJyNIuhCVZcAHT65-KFR_0ZM0E-9K473ONpWGgFhDORHmoc1nsLCM930Y-8gVIKFr8tp8-K1c4_elm64W2hD2TB83XWA6zhEOER7MZZbyX681Fu8Xall" />
        <img className="h-6" alt="Mastercard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD84QwyApHn0BmLzhctnwL6JO7vM5zxlN8047nX23GLCke_FC2wYzMjFwylTmbKG8JByt-wNdScmz-GOVjKUwSPJRf0SWm4-QRWz41ArJB1d5sqizdLNGHc9Q0N5-BWjFDSIaibWsE9L_7U7I2W_HhhJqpTRQQh-T7-X2h_OM6hIILDDuRqbs-gvtaNXZlEe7Rg4BG7qmmmJxumWm1AJN64RKrNrApECTpT7OjV_AuQe90RpAM4w3rGCIbmYcS-gl1LgFk52yuncX5p" />
        <img className="h-6" alt="Amex" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaXZFOJ8z-Sr9K7ZKMr3SemDmQ1HozIAwy9QU-dXs3FwBQnxYfEsZUcaKU1PfZxOHVvrgE4IO5y0Jy07BH9_bWCx_v6W2gij_jsj5CdaqInGXFICeilaO0FufJqKIxmPdJjViPpJJYaNt-F2biUAhpUKZHz58DlRFug4SCsz8MSTPrejFAsERgvETKLN74qYqJ_5uGpay0af1Lbv513Mohn_7ut_ZZOwpT9TYqzOo_-0cJNMCNpNn7wCLVSKrjRyoUUmhlXnfUlDO-" />
      </div>
    </div>
  );
}