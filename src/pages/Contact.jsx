import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await base44.entities.ContactInquiry.create({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: "",
      message: `${form.subject}\n\n${form.message}`,
      source: "website_contact_form"
    });
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="relative pt-24 pb-32" dir="rtl">
      {/* Hero */}
      <section className="relative pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-7xl font-extrabold tracking-tighter text-slate-900 mb-6">כתבו לנו</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            אנחנו כאן כדי לענות על כל שאלה ולעזור לכם לבנות את מסלול הקריירה המדויק ביותר עבורכם באמצעות AI.
          </p>
        </div>
        <div className="absolute top-0 right-0 -z-10 opacity-10 translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] bg-[#FF8F00] rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-8 pb-32">
        <div className="bg-white p-8 md:p-14 relative overflow-hidden rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
          <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-[#FF8F00] to-[#FFB347] h-1.5"></div>

          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">ההודעה נשלחה!</h3>
              <p className="text-slate-500">נחזור אליך בהקדם האפשרי.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-500 mr-1">שם</label>
                <input
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF8F00]/40 focus:bg-white transition-all outline-none"
                  placeholder="הזינו שם פרטי"
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-500 mr-1">שם משפחה</label>
                <input
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF8F00]/40 focus:bg-white transition-all outline-none"
                  placeholder="הזינו שם משפחה"
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-500 mr-1">כותרת</label>
                <input
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF8F00]/40 focus:bg-white transition-all outline-none"
                  placeholder="נושא ההודעה"
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-500 mr-1">תוכן המייל</label>
                <textarea
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF8F00]/40 focus:bg-white transition-all outline-none"
                  placeholder="איך נוכל לעזור?"
                  rows="5"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-tr from-[#FF8F00] to-[#FFB347] text-white text-lg font-bold py-5 rounded-2xl shadow-xl shadow-[#FF8F00]/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : "שלח הודעה"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="absolute -left-20 top-40 w-64 h-64 bg-[#FF8F00]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -right-20 bottom-0 w-80 h-80 bg-[#FF8F00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight text-slate-900 relative inline-block">
              <span className="relative z-10">הצוות שלנו</span>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF8F00]/20 rounded-full blur-xl"></div>
            </h2>
            <div className="w-24 h-1.5 bg-[#FF8F00] mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "יוסי אלון", role: "בעלים ומייסד", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC613OU3Qh5NA4gS-tn86H7wexIYrKpyyWt5aRJtIC8Gf9hDFa93gftXUEBZLemAOAWy8eK6liiCQ8or7qJcjdbnA7sCnKgHl3N1rf_Lm2i-R8sI1whvZ1dEWnbBUnl-SbVcJIJviFdqZku8Js02_0jLbaPJ5EenfvxB4BejnXJDC1Tw7f7yBBFyEzLhUo7yZQiY4BCI05oilR_9OAoOhAnHp1QdOk-XgU1SrGejJnQYCVJX33_zeguFNFEERBzOXZ0ZSZWxNCqyIwp" },
              { name: "ליה ליין", role: 'סמנכ"לית שיווק ומכירות', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZCKdsE2wWnjet72v6dDv6Igb5DzMCn_66nm1lUPqH4fTiB7hp-BnUSXYWSAuP6rQx6S_JUOH-UPHk7T5d6UH0pc2wDkykz_VwtfjHObzeCHeEYHrtt6a_LJOHDWHYoE-_DjpHtKZVz3UXxmaveuFwdOdmq8pfAPquFryCk9SA9QmfF9vsoiLTiBHJfFGWz4pyp9q7n1fq6K0DVc7vTheC0upbyyGIS8FWbvXHJ_82RdxWJAmeUoK4Nk8RvgvEodFdgzDEUeJyTcto" },
              { name: "גיא פרנסס", role: "ראש מחלקת מערכות מידע", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8jCMgGqacR0CT8ZWnLHRZQry-ugri3f0H266IbIFvgRXUqhgtFr3hv_hBGe5MNYpOSUtWV41YVgkvMtdsYX3VOeCMbKQyevZ8E95sAiYyJJmWnrQ0AJxOCJr00zHru-35K8_3UfIUn7eEzZ-xiIlaqeGGCriS734mieX8V3YlzNPY2e-39uE49cAya7wdwWuZy8U837-2ZPCTQNQST4UixWx5zKvJQUxKlxXYUkAP6BEgvZLFr5GUMqGhOhXYRCyzA3BvH14l1Tcd" },
            ].map(({ name, role, img }) => (
              <div key={name} className="flex flex-col items-center group">
                <div className="relative w-48 h-48 mb-8">
                  <div className="absolute inset-0 bg-[#FF8F00]/10 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={img} alt={name} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
                  <p className="text-[#FF8F00] font-medium">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="max-w-7xl mx-auto px-8 py-32 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">עקבו אחרינו במדיה החברתית</h2>
        <div className="flex justify-center gap-12">
          {[
            { label: "Instagram", icon: "📷" },
            { label: "Facebook", icon: "👥" },
            { label: "LinkedIn", icon: "💼" },
          ].map(({ label, icon }) => (
            <a key={label} className="flex flex-col items-center group" href="#">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#FF8F00] group-hover:bg-[#FF8F00] group-hover:text-white transition-all duration-300 shadow-sm text-2xl">
                {icon}
              </div>
              <span className="mt-3 font-semibold text-slate-500">{label}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}