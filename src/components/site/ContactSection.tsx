import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/hooks/useProperty";
import { useSiteContent, get } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const { merged: property } = useProperty();
  const { content, lang } = useSiteContent();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: t("site.contact.validation"), variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    });
    setSending(false);
    if (error) {
      toast({ title: t("site.contact.couldNotSend"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("site.contact.sent"), description: t("site.contact.sentDesc") });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container-narrow grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="eyebrow mb-3">{get(content, "contact", "eyebrow", lang)}</p>
          <h2 className="text-4xl md:text-5xl mb-6">{get(content, "contact", "title", lang)}</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            {get(content, "contact", "description", lang)}
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${property.phone}`} className="hover:text-primary">{property.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${property.email}`} className="hover:text-primary">{property.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <a href={`https://wa.me/${property.whatsapp.replace(/\D/g, "")}`} className="hover:text-primary">
                WhatsApp {property.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{property.address}, {property.city}, {property.country}</span>
            </li>
          </ul>
        </div>

        <form className="bg-card rounded-lg p-6 md:p-8 shadow-card space-y-4" onSubmit={submit}>
          <h3 className="font-serif text-2xl">{t("site.contact.sendMessage")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-1.5">{t("site.contact.name")}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-input bg-background"
                placeholder={t("site.contact.namePlaceholder")}
              />
            </div>
            <div>
              <label className="eyebrow block mb-1.5">{t("site.contact.email")}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-input bg-background"
                placeholder={t("site.contact.emailPlaceholder")}
              />
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-1.5">{t("site.contact.subject")}</label>
            <input
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full h-11 px-3 rounded-md border border-input bg-background"
              placeholder={t("site.contact.subjectPlaceholder")}
            />
          </div>
          <div>
            <label className="eyebrow block mb-1.5">{t("site.contact.message")}</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              placeholder={t("site.contact.messagePlaceholder")}
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? t("site.contact.sending") : t("site.contact.sendInquiry")}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
