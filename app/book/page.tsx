import HeroReferral from "@/components/Frontend/Referral/Hero";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agendar Sesión | Alex Zapata',
  description: 'Reserva tu sesión personalizada con Alex Zapata. Descubre tu tipo de personalidad, desarrolla autoconocimiento y transforma tu vida con coaching profesional.',
  keywords: ['Alex Zapata', 'coaching personal', 'terapia', 'desarrollo personal', 'autoconocimiento'],
  openGraph: {
    title: 'Agendar Sesión con Alex Zapata',
    description: 'Transforma tu vida con sesiones personalizadas con Alex Zapata',
    type: 'website',
    locale: 'es_ES',
    url: '/book',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendar Sesión con Alex Zapata',
    description: 'Descubre tu potencial con coaching personal y autoconocimiento con Alex Zapata',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  }
}


export default function Book() {
  return (
    <section className="w-auto mx-auto  bg-gray-50 max-md:pt-2">
      <HeroReferral />
    </section>
  );
}
