export const defaultContentDe = {
  site: {
    name: 'GreenFit',
    logo: '/logo.png',
    seo: {
      title: 'GreenFit — Wellness- und Fitnesscenter in Salgesch / Siders',
      description:
        'GreenFit, Ihr Fitness- und Wellnesscenter in Salgesch / Siders. Krafttraining, Gruppenkurse, Physiotherapie und mehr. 24 Stunden geöffnet.',
    },
  },

  nav: {
    links: [
      { href: '#centre', label: 'Das Center' },
      { href: '#partenaires', label: 'Partner' },
      { href: '#planning', label: 'Gruppenkurse' },
      { href: '#tarifs', label: 'Preise' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Kontakt' },
    ],
    ctaDesktop: 'Anmelden',
    ctaMobile: 'Starten',
  },

  hero: {
    titleLines: [
      { text: 'BEWEGEN.', highlight: false },
      { text: 'SCHWITZEN.', highlight: true },
      { text: 'FORTSCHREITEN.', highlight: false },
    ],
    subtitle:
      'Ihr Wellnesscenter in der Nähe. Fitness, Gesundheit und Regeneration in einem modernen Raum, 24 Stunden geöffnet.',
    ctaPrimary: { label: 'Ich will mich anmelden', href: '#tarifs' },
    ctaSecondary: { label: 'Kursplan ansehen', href: '#planning' },
    stats: [
      { value: '3 200+', label: 'Aktive Mitglieder' },
      { value: '11', label: 'Kurse / Woche' },
      { value: '9', label: 'Diplomierte Coaches' },
    ],
    video: '/videos/gym.mp4',
    poster: '/images/salle/salle.jpg',
  },

  centre: {
    label: 'Das Center',
    title: 'Viel mehr\nals ein Fitness',
    lead:
      'GreenFit empfängt Sie in einem modernen Raum von über 2 000 m², 24 Stunden geöffnet, ganz der Fitness, Gesundheit und dem Wohlbefinden gewidmet. Von den Krankenkassen anerkannt, bietet unser Center einen ganzheitlichen Ansatz mit einem Team qualifizierter Fachpersonen.',
    features: [
      {
        title: 'Krafttrainingsfläche',
        text: '600 m² · geführte Geräte, freie Gewichte, Cross-Training-Zone.',
      },
      {
        title: 'Gruppenkurs-Studios',
        text: 'Drei Räume: Functional, Gruppenkurse und Spinning-Saal.',
      },
      {
        title: 'Wellnessbereich',
        text: 'Premium-Garderoben, Duschen, Sauna und Relaxzone.',
      },
      {
        title: 'Coaching nach Mass',
        text: 'Kostenlose Standortbestimmung und Begleitung durch diplomierte Coaches.',
      },
    ],
    metrics: [
      { value: '2 000 m²', label: 'Gesamtfläche' },
      { value: '24 Std.', label: 'Durchgehend geöffnet' },
      { value: 'Anerkannt', label: 'Krankenkassen' },
    ],
    photos: [
      { src: '/images/salle/salle.jpg', alt: 'Krafttrainingsfläche GreenFit' },
      { src: '/images/salle/salle2.jpg', alt: 'Cardio-Bereich GreenFit' },
      { src: '/images/salle/salle3.jpg', alt: 'Gruppenkurs-Studio GreenFit' },
      { src: '/images/salle/salle4.jpg', alt: 'Wellnessbereich GreenFit' },
    ],
  },

  bienEtre: {
    label: 'Partner',
    title: 'Experten an Ihrer Seite',
    lead:
      'In GreenFit begleiten Sie unsere Partner für Physiotherapie, Pilates und weitere ergänzende Disziplinen — eine komplette Betreuung am selben Ort.',
    cta: '',
    offers: [
      {
        title: 'Physio Sport & Santé',
        text: 'Physiotherapie-Praxis mit Schwerpunkt Sportrehabilitation, in GreenFit.',
        src: '/images/partenaires/physio-sport-sante.png',
        alt: 'Logo Physio Sport & Santé',
        url: 'https://physio-sport-sante.com',
        logo: true,
      },
      {
        title: 'Pilates Studio Anna Lillo',
        text: 'Private und halbprivate Reformer-Pilates-Stunden, um zu kräftigen, zu dehnen und den Körper auszurichten.',
        src: '/images/partenaires/pilates-studio-anna-lillo.png',
        alt: 'Logo Pilates Studio Anna Lillo',
        url: 'https://pilates-studio.ch',
        logo: true,
      },
      {
        title: 'SLA Skin & Laser Atelier',
        text: 'Hautpflege und Laserbehandlungen in GreenFit, für ästhetische Begleitung am selben Ort.',
        src: '/images/partenaires/sla-skin-laser-atelier.png',
        alt: 'Logo SLA Skin & Laser Atelier',
        url: 'https://skinlaseratelier.ch',
        logo: true,
      },
      {
        title: 'Body & Soul by Vera Silva',
        text: 'Massage-Therapie in GreenFit, um Verspannungen zu lösen und den Körper nach dem Training zu pflegen.',
        src: '/images/partenaires/body-and-soul-vera-silva.png',
        alt: 'Logo Body & Soul by Vera Silva',
        url: 'https://www.instagram.com/bodyandsoulsilva/',
        logo: true,
        logoLarge: true,
      },
      {
        title: 'J. Lang Beauty & Care',
        text: 'Beauty- und Pflegebehandlungen in GreenFit, für Haut und Aussehen.',
        src: '/images/partenaires/j-lang-beauty-care.png',
        alt: 'Logo J. Lang Beauty & Care',
        url: 'https://share.google/p2RYEaAlQBbfyfgYA',
        logo: true,
        logoLarge: true,
      },
    ],
  },

  planning: {
    eyebrow: 'Gruppenkurse',
    title: 'Wochenplan',
    subtitle:
      'Mehr als 7 Disziplinen mit unseren Coaches. Filtern Sie nach Aktivität und reservieren Sie Ihren Platz in wenigen Klicks.',
    emptyMessage: 'Kein Kurs für diesen Filter an diesem Tag.',
    note:
      'Reservieren Sie Ihre Kurse im Handumdrehen — laden Sie unsere App für ein flüssiges Erlebnis.',
    types: {
      caf: { label: 'CAF', tone: 'green', icon: 'pulse' },
      pump: { label: 'Body Pump', tone: 'purple', icon: 'strength' },
      yoga: { label: 'Yoga', tone: 'green', icon: 'person' },
      fstrength: { label: 'F. Strength', tone: 'slate', icon: 'strength' },
      attack: { label: 'Body Attack', tone: 'purple', icon: 'pulse' },
      pilates: { label: 'Pilates', tone: 'green', icon: 'wellness' },
      functional: { label: 'Functional', tone: 'slate', icon: 'spark' },
    },
    categories: [
      { key: 'all', label: 'Alle' },
      { key: 'pump', label: 'Body Pump' },
      { key: 'yoga', label: 'Yoga' },
      { key: 'pilates', label: 'Pilates' },
      { key: 'functional', label: 'Functional' },
      { key: 'attack', label: 'Body Attack' },
      { key: 'caf', label: 'CAF' },
      { key: 'fstrength', label: 'F. Strength' },
    ],
    slots: [
      { key: 'morning', label: 'Morgen' },
      { key: 'midday', label: 'Mittag' },
      { key: 'evening', label: 'Abend' },
    ],
    schedule: [],
  },

  tarifs: {
    eyebrow: 'Preise',
    title: 'Wählen Sie Ihr Abo',
    titleHighlight: 'Abo',
    features: [
      'Zugang 24 Stunden, 7 Tage die Woche',
      'Kraft- und Cardio-Bereich',
      'Unbegrenzte Gruppenkurse',
      'Garderoben, Duschen & Sauna',
      'Von den Krankenkassen anerkannt',
    ],
    plans: [
      {
        name: '3 Monate',
        price: 369,
        months: 3,
        tagline: 'Frei testen',
        cta: '3 Monate wählen',
        featured: false,
      },
      {
        name: '6 Monate',
        price: 499,
        months: 6,
        tagline: 'Ein gutes Gleichgewicht',
        cta: '6 Monate wählen',
        featured: false,
      },
      {
        name: '12 Monate',
        price: 850,
        months: 12,
        tagline: 'Am vorteilhaftesten',
        cta: '12 Monate wählen',
        featured: true,
      },
    ],
    addons: [
      {
        id: 'programme-inbody',
        label: 'Persönliches Programm / Inbody-Körperanalyse',
        price: 60,
      },
      {
        id: 'test-condition',
        label: 'Konditionstest, persönliches Programm und Inbody-Körperanalyse',
        price: 115,
      },
      {
        id: 'nutrition',
        label: 'Ernährung (4 Sitzungen) mit Inbody-Körperanalyse',
        price: 390,
      },
      {
        id: 'linge-casier',
        label: 'Wäsche / Schliessfachmiete',
        price: 150,
      },
    ],
    extras: [
      {
        title: 'Reduzierte Tarife',
        text: 'AHV, Studierende und IV: −10 % auf Abos und Fitness-Eintritte.',
        icon: 'users',
      },
      {
        title: 'Krankenkassen',
        text: 'Ihre Krankenkasse übernimmt einen Teil Ihres Abos.',
        icon: 'pulse',
      },
      {
        title: '3 Probetage geschenkt',
        text: 'Kontaktieren Sie die Rezeption oder kommen Sie während der Öffnungszeiten vorbei.',
        icon: 'spark',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Haben Sie eine Frage?',
    titleHighlight: 'eine Frage?',
    intro:
      'Hier finden Sie die häufigsten Antworten. Sie finden nicht, was Sie suchen?',
    cta: 'Kontaktieren Sie uns',
    items: [
      {
        q: 'Warum GreenFit?',
        a: 'Bei GreenFit sind Sie nicht einfach Kundin oder Kunde. Wir sind Passionierte, die sich um jede Person kümmern, mit modernen Anlagen und einem Rahmen, der für seine angenehme Atmosphäre bekannt ist.',
      },
      {
        q: 'Kann ich die Formel wechseln?',
        a: 'Ja. Sie können Ihr Abo an Ihr Profil und Ihre Bedürfnisse anpassen.',
      },
      {
        q: 'Wann kann ich kommen?',
        a: 'Der Fitnessbereich bleibt für Mitglieder 24 Stunden, 7 Tage die Woche zugänglich. Die Rezeption ist montags bis donnerstags von 8:30 bis 13:30 und von 16:30 bis 21:00 Uhr geöffnet, freitags bis 19:00 Uhr, samstags von 9:00 bis 12:00 Uhr und sonntags geschlossen. An offiziellen Feiertagen: Rezeption geschlossen und keine Gruppenkurse.',
      },
      {
        q: 'Ich möchte Fitnesscoach werden',
        a: 'Sie sind Profi? Wir auch. Senden Sie uns gerne Ihre Bewerbung — wir suchen immer motivierte neue Mitarbeitende.',
      },
      {
        q: 'Was passiert am Ende des Vertrags?',
        a: 'Der Vertrag wird automatisch für denselben Zeitraum zu denselben Bedingungen verlängert. Einen Monat vor Ablauf informieren wir Sie schriftlich oder direkt im Center, damit Sie die Verlängerung bestätigen oder ablehnen. Wenn Sie nicht verlängern möchten, teilen Sie uns dies bitte per Brief mindestens 30 Tage vor Vertragsende mit.',
      },
      {
        q: 'Ich bin interessiert, habe aber noch nie Fitness gemacht…',
        a: 'Keine Sorge, alle haben einmal angefangen. Beim Empfang nehmen wir uns Zeit für Sie und stellen Ihnen unsere Coaches vor. Auf Wunsch beurteilen wir Ihre Kondition und erstellen ein persönliches Programm nach Ihren Zielen. Wir sind für Sie da.',
      },
      {
        q: 'Wie viele Trainings, um Resultate zu sehen?',
        a: 'Wir empfehlen 2 bis 3 Einheiten pro Woche, um Fortschritte zu sehen. Die ersten Tage können fordernd sein, aber schnell wird das Training zur Gewohnheit — vielleicht sogar zur Leidenschaft!',
      },
    ],
  },

  contact: {
    eyebrow: 'Kontakt',
    title: 'Sehen wir uns bald?',
    titleHighlight: 'bald?',
    intro:
      'Für ein gratis Probeabo kontaktieren Sie die Rezeption telefonisch oder kommen Sie während der Öffnungszeiten vorbei.',
    phone: '027 565 41 31',
    phoneHref: 'tel:+41275654131',
    email: 'info@green-fit.ch',
    addressLine1: 'Industriestrasse 16',
    addressLine2: '3970 Salgesch / Siders',
    mapsUrl: 'https://maps.google.com/?q=Industriestrasse+16,+3970+Salquenen',
    receptionHours: [
      { days: 'Montag – Donnerstag', hours: '8:30 – 13:30 / 16:30 – 21:00' },
      { days: 'Freitag', hours: '8:30 – 13:30 / 16:30 – 19:00' },
      { days: 'Samstag', hours: '9:00 – 12:00' },
      { days: 'Sonntag', hours: 'Geschlossen' },
    ],
    hoursNote:
      'Fitness für Mitglieder: 24 Std. · Feiertage: Rezeption geschlossen, keine Gruppenkurse.',
  },

  footer: {
    tagline:
      'Ihr Wellnesscenter in Salgesch / Siders. Über 2 000 m² für Fitness, Gesundheit und Regeneration.',
    columns: [
      {
        title: 'Das Center',
        links: [{ label: 'Über uns', href: '#centre' }],
      },
      {
        title: 'Aktivitäten',
        links: [
          { label: 'Gruppenkurse', href: '#planning' },
          { label: 'Partner', href: '#partenaires' },
        ],
      },
      {
        title: 'Infos',
        links: [
          { label: 'Preise', href: '#tarifs' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Kontakt', href: '#contact' },
        ],
      },
    ],
  },
}
