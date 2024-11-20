import HeroReferral from "@/components/Frontend/Referral/Hero";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agendar Terapia de BioEnneagrama | Coaching Personal',
  description: 'Reserva tu sesión personalizada de BioEnneagrama. Descubre tu tipo de personalidad, desarrolla autoconocimiento y transforma tu vida con coaching profesional.',
  keywords: ['BioEnneagrama', 'coaching personal', 'terapia', 'desarrollo personal', 'autoconocimiento'],
  openGraph: {
    title: 'Agendar Terapia de BioEnneagrama',
    description: 'Transforma tu vida con sesiones personalizadas de BioEnneagrama',
    type: 'website',
    locale: 'es_ES',
    url: '/book',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendar Terapia de BioEnneagrama',
    description: 'Descubre tu potencial con coaching personal de BioEnneagrama',
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
