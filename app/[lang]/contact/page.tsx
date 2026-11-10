import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { hasLocale } from "@/lib/i18n";
import { ContactForm, CopyButton } from "@/components/site/contact-form";
import { LinkedinIcon } from "@/components/site/icons";
import { Reveal } from "@/components/site/reveal";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.contact.title, description: dict.contact.intro };
}

// Contact — desain v1.0 (FigCraft "Contact — Desktop 1440"). Nomor HP sengaja tidak ditampilkan (K-20).
export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;

  return (
    <section className="px-4 pt-32 pb-20 sm:px-6 md:pt-40">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <h1 className="animate-rise font-heading text-[clamp(3rem,10vw,9.5rem)] leading-[0.95] font-bold tracking-tight uppercase">
          <span className="block">{t.lead}</span>
          <span className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="text-primary">{t.accent}</span>
            <span className="max-w-xs font-sans text-[17px] leading-relaxed font-normal tracking-normal text-muted-foreground normal-case">
              {t.intro}
            </span>
          </span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <Reveal>
            <ContactForm to={profile.contact.email} labels={t} />
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-[32px] bg-primary p-7 text-primary-foreground">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase opacity-90">
                <Mail className="size-4" aria-hidden /> {t.emailCard}
              </p>
              <a href={`mailto:${profile.contact.email}`} className="font-heading text-[22px] font-medium break-all underline-offset-4 outline-none hover:underline focus-visible:underline">
                {profile.contact.email}
              </a>
              <CopyButton text={profile.contact.email} label={t.copy} copiedLabel={t.copied} />
            </div>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-[32px] bg-card p-7 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-subtle uppercase">
                <LinkedinIcon className="size-4" /> {t.linkedinCard}
              </span>
              <span className="flex items-center gap-2 font-heading text-[22px] font-medium">
                in/rahulghulam
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </a>
            <div className="flex flex-col gap-2 rounded-[32px] bg-card p-7">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-subtle uppercase">
                <MapPin className="size-4" aria-hidden /> {t.basedCard}
              </p>
              <p className="font-heading text-[22px] font-medium">{t.basedValue}</p>
              <p className="text-sm text-muted-foreground">{t.replyTime}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
