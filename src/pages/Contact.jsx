import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, CheckCircle, Loader2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await base44.entities.ContactInquiry.create({ ...form, source: "website_contact_form" });
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="pt-24 min-h-screen bg-slate-50" dir="rtl">
      <section className="max-w-3xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">צור קשר</h1>
          <p className="text-lg text-slate-500">יש לך שאלה? נשמח לעזור. מלא את הטופס ונחזור אליך בהקדם.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <a href="mailto:support@v107.co.il" className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF8F00]/30 transition-all">
            <div className="w-12 h-12 bg-[#FF8F00]/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#FF8F00]" />
            </div>
            <div>
              <p className="text-sm text-slate-500">אימייל</p>
              <p className="font-bold text-slate-800">support@v107.co.il</p>
            </div>
          </a>
          <a href="tel:0552134848" className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF8F00]/30 transition-all">
            <div className="w-12 h-12 bg-[#FF8F00]/10 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#FF8F00]" />
            </div>
            <div>
              <p className="text-sm text-slate-500">טלפון</p>
              <p className="font-bold text-slate-800">055-2134848</p>
            </div>
          </a>
        </div>

        <Card className="shadow-sm border border-slate-100">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">ההודעה נשלחה!</h3>
                <p className="text-slate-500">נחזור אליך בהקדם האפשרי.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">שם מלא *</Label>
                    <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ישראל ישראלי" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">אימייל *</Label>
                    <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="israel@example.com" required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">טלפון (אופציונלי)</Label>
                  <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05X-XXXXXXX" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">הודעה *</Label>
                  <Textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="כתוב את שאלתך כאן..." rows={5} required className="mt-1" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF8F00] hover:bg-[#e67e00] text-white font-bold py-3 text-lg rounded-full">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "שלח הודעה"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}