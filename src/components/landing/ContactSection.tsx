"use client";

import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import { TranslateFn } from "@/lib/constants/landing";

type ContactSectionProps = {
  tLanding: TranslateFn;
};

export function ContactSection({ tLanding }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Log form data for now
    console.log("=== Contact Form Data ===");
    console.log("Name:", formData.name);
    console.log("Email:", formData.email);
    console.log("Subject:", formData.subject);
    console.log("Message:", formData.message);
    console.log("Full Data Object:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      labelKey: "contact.info.address.label",
      valueKey: "contact.info.address.value",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      labelKey: "contact.info.phone.label",
      valueKey: "contact.info.phone.value",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      labelKey: "contact.info.email.label",
      valueKey: "contact.info.email.value",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      labelKey: "contact.info.hours.label",
      valueKey: "contact.info.hours.value",
    },
  ];

  return (
    <section id="contact" className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021621] via-[#0A2540] to-[#0A1628]" />
      <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-sky-500/5 blur-3xl rounded-full" />
      <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-emerald-500/5 blur-3xl rounded-full" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-wider text-sky-300 backdrop-blur mb-4">
            {tLanding("contact.pill")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {tLanding("contact.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            {tLanding("contact.description")}
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {tLanding("contact.infoTitle")}
              </h3>

              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-0.5">
                        {tLanding(info.labelKey)}
                      </p>
                      <p className="text-base text-white">
                        {tLanding(info.valueKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="mt-8 rounded-xl overflow-hidden border border-white/10 aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1993.7!2d30.086926!3d-1.9426518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca79cc53624d1%3A0xc6a7b897d72df836!2sQt%20Global%20Software%20Ltd!5e0!3m2!1sen!2srw!4v1706387000000!5m2!1sen!2srw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="QT Global Software Ltd Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {tLanding("contact.formTitle")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-slate-300 mb-2"
                    >
                      {tLanding("contact.form.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 px-4 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition"
                      placeholder={tLanding("contact.form.namePlaceholder")}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-slate-300 mb-2"
                    >
                      {tLanding("contact.form.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 px-4 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition"
                      placeholder={tLanding("contact.form.emailPlaceholder")}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    {tLanding("contact.form.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full h-11 sm:h-12 px-4 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition"
                    placeholder={tLanding("contact.form.subjectPlaceholder")}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    {tLanding("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition resize-none"
                    placeholder={tLanding("contact.form.messagePlaceholder")}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-lg bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {tLanding("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {tLanding("contact.form.submit")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
