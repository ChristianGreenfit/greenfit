export const defaultContent = {
  site: {
    name: 'GreenFit',
    logo: '/logo.png',
    seo: {
      title: 'GreenFit — Centre de bien-être à Salquenen / Sierre',
      description:
        'GreenFit, votre centre fitness et bien-être à Salquenen / Sierre. Musculation, cours collectifs, physiothérapie et plus. Ouvert 24 h/24.',
    },
  },

  nav: {
    links: [
      { href: '#centre', label: 'Le centre' },
      { href: '#bien-etre', label: 'Bien-être' },
      { href: '#planning', label: 'Cours collectifs' },
      { href: '#tarifs', label: 'Tarifs' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Contact' },
    ],
    ctaDesktop: "S'inscrire",
    ctaMobile: 'Démarrer',
  },

  hero: {
    titleLines: [
      { text: 'BOUGEZ.', highlight: false },
      { text: 'TRANSPIREZ.', highlight: true },
      { text: 'PROGRESSEZ.', highlight: false },
    ],
    subtitle:
      'Votre centre de bien-être près de chez vous. Forme, santé et récupération réunies dans un espace moderne ouvert 24 h/24.',
    ctaPrimary: { label: "Je veux m'inscrire", href: '#tarifs' },
    ctaSecondary: { label: 'Voir le planning', href: '#planning' },
    stats: [
      { value: '3 200+', label: 'Adhérents actifs' },
      { value: '11', label: 'Cours / semaine' },
      { value: '9', label: 'Coachs diplômés' },
    ],
    video: '/videos/gym.mp4',
    poster: '/images/salle/salle.jpg',
  },

  centre: {
    label: 'Le centre',
    title: 'Bien plus\nqu’un fitness',
    lead:
      'GreenFit vous accueille dans un espace moderne de plus de 2 000 m², ouvert 24 h/24, entièrement dédié à la forme, la santé et le bien-être. Reconnu par les caisses-maladie, notre centre propose une approche globale portée par une équipe de professionnels qualifiés.',
    features: [
      {
        title: 'Plateau musculation',
        text: '600 m² · machines guidées, poids libres, zone cross-training.',
      },
      {
        title: 'Studios collectifs',
        text: 'Deux studios insonorisés pour yoga, cycling et cours toniques.',
      },
      {
        title: 'Espace bien-être',
        text: 'Vestiaires premium, douches, sauna et coin détente.',
      },
      {
        title: 'Coaching sur-mesure',
        text: 'Bilan offert et suivi avec nos coachs diplômés d’État.',
      },
    ],
    metrics: [
      { value: '2 000 m²', label: 'Espace total' },
      { value: '24 h/24', label: 'Ouvert en continu' },
      { value: 'Reconnu', label: 'Caisses-maladie' },
    ],
    photos: [
      { src: '/images/salle/salle.jpg', alt: 'Plateau musculation GreenFit' },
      { src: '/images/salle/salle2.jpg', alt: 'Espace cardio GreenFit' },
      { src: '/images/salle/salle3.jpg', alt: 'Studio cours collectifs GreenFit' },
      { src: '/images/salle/salle4.jpg', alt: 'Espace bien-être GreenFit' },
    ],
  },

  bienEtre: {
    label: 'Bien-être',
    title: 'Une approche globale de votre santé',
    lead:
      'En collaboration avec nos partenaires, profitez de l’expertise de physiothérapeutes, d’une naturopathe et d’une spécialiste du Pilates Reformer pour un accompagnement complet et personnalisé.',
    cta: 'Prendre rendez-vous',
    offers: [
      {
        title: 'Physiothérapie',
        text: 'L’expertise de physiothérapeutes partenaires pour la rééducation, la prévention et le suivi.',
        src: '/images/salle/salle5.jpg',
        alt: 'Cabinet de physiothérapie GreenFit',
      },
      {
        title: 'Pilates Reformer',
        text: 'Une spécialiste du Pilates Reformer pour renforcer, étirer et retrouver un corps aligné.',
        src: '/images/salle/pilates-reformer.jpg',
        alt: 'Studio Pilates Reformer GreenFit',
      },
      {
        title: 'Naturopathie',
        text: 'Une naturopathe partenaire pour un accompagnement personnalisé de votre vitalité.',
        src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        alt: 'Consultation naturopathie GreenFit',
      },
    ],
  },

  planning: {
    eyebrow: 'Cours collectifs',
    title: 'Planning de la semaine',
    subtitle:
      'Plus de 7 disciplines encadrées par nos coachs. Filtrez par activité et réservez votre place en quelques clics.',
    emptyMessage: 'Aucun cours pour ce filtre ce jour-là.',
    note:
      'Réservez vos cours en un clin d’œil — téléchargez notre application pour une expérience fluide.',
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
      { key: 'all', label: 'Tout' },
      { key: 'pump', label: 'Body Pump' },
      { key: 'yoga', label: 'Yoga' },
      { key: 'pilates', label: 'Pilates' },
      { key: 'functional', label: 'Functional' },
      { key: 'attack', label: 'Body Attack' },
      { key: 'caf', label: 'CAF' },
      { key: 'fstrength', label: 'F. Strength' },
    ],
    slots: [
      { key: 'morning', label: 'Matin' },
      { key: 'midday', label: 'Midi' },
      { key: 'evening', label: 'Soir' },
    ],
    schedule: [
      {
        morning: { type: 'caf', start: '09:30', end: '10:30' },
        midday: null,
        evening: { type: 'pump', start: '18:30', end: '19:30' },
      },
      {
        morning: { type: 'yoga', start: '09:30', end: '11:00' },
        midday: { type: 'fstrength', start: '12:15', end: '13:00' },
        evening: { type: 'attack', start: '18:30', end: '19:30' },
      },
      {
        morning: { type: 'pilates', start: '09:30', end: '10:30' },
        midday: null,
        evening: { type: 'functional', start: '18:30', end: '19:15' },
      },
      {
        morning: { type: 'pump', start: '09:30', end: '10:30' },
        midday: { type: 'functional', start: '12:15', end: '13:00' },
        evening: { type: 'pump', start: '18:30', end: '19:30' },
      },
      { morning: null, midday: null, evening: null },
      {
        morning: { type: 'pump', start: '09:30', end: '10:30' },
        midday: null,
        evening: null,
      },
      { morning: null, midday: null, evening: null },
    ],
  },

  tarifs: {
    eyebrow: 'Tarifs',
    title: 'Choisissez votre abonnement',
    titleHighlight: 'abonnement',
    features: [
      'Accès 24 h/24, 7 jours sur 7',
      'Plateau musculation & cardio',
      'Cours collectifs illimités',
      'Vestiaires, douches & sauna',
      'Reconnu par les caisses-maladie',
    ],
    plans: [
      {
        name: '3 mois',
        price: 369,
        months: 3,
        tagline: 'Pour tester en toute liberté',
        cta: 'Choisir 3 mois',
        featured: false,
      },
      {
        name: '6 mois',
        price: 499,
        months: 6,
        tagline: 'Un bon équilibre',
        cta: 'Choisir 6 mois',
        featured: false,
      },
      {
        name: '12 mois',
        price: 850,
        months: 12,
        tagline: 'Le plus avantageux',
        cta: 'Choisir 12 mois',
        featured: true,
      },
    ],
    addons: [
      {
        id: 'programme-inbody',
        label: 'Programme personnalisé / Inbody analyse corporelle',
        price: 60,
      },
      {
        id: 'test-condition',
        label: 'Test condition, programme personnalisé et Inbody analyse corporelle',
        price: 115,
      },
      {
        id: 'nutrition',
        label: 'Nutrition (4 séances) avec Inbody analyse corporelle',
        price: 390,
      },
      {
        id: 'linge-casier',
        label: 'Linge / location casier',
        price: 150,
      },
    ],
    extras: [
      {
        title: 'Tarifs réduits',
        text: 'AVS, étudiant et AI : −10 % sur les abonnements et entrées fitness.',
        icon: 'users',
      },
      {
        title: 'Caisses-maladie',
        text: 'Votre caisse-maladie prend en charge une partie de votre abonnement.',
        icon: 'pulse',
      },
      {
        title: '3 jours d’essai offerts',
        text: 'Venez découvrir le centre librement, sans engagement.',
        icon: 'spark',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Vous avez une question ?',
    titleHighlight: 'une question ?',
    intro:
      'On a rassemblé les réponses aux questions les plus fréquentes. Vous ne trouvez pas ce que vous cherchez ?',
    cta: 'Contactez-nous',
    items: [
      {
        q: 'Pourquoi GreenFit ?',
        a: 'Chez GreenFit, vous n’êtes pas un simple client. Nous sommes des passionnés qui prennent soin de chaque visiteur, avec des installations récentes et un cadre reconnu pour son ambiance agréable.',
      },
      {
        q: 'Est-ce que je peux changer de formule ?',
        a: 'Oui. Vous pouvez adapter votre abonnement en fonction de votre profil et de vos besoins.',
      },
      {
        q: 'Quand puis-je venir ?',
        a: 'L’espace fitness reste accessible 24 h/24, 7 j/7 pour les adhérents. La réception est ouverte du lundi au jeudi de 8h30 à 13h30 et de 16h30 à 21h00, le vendredi jusqu’à 19h00, le samedi de 9h00 à 12h00, et fermée le dimanche. Les jours fériés officiels : réception fermée et pas de cours collectifs.',
      },
      {
        q: 'Je veux devenir coach sportif',
        a: 'Vous êtes un professionnel ? Nous aussi. N’hésitez pas à nous transmettre votre candidature — nous sommes toujours à la recherche de nouveaux collaborateurs motivés.',
      },
      {
        q: 'En fin de contrat, comment ça se passe ?',
        a: 'Le contrat est automatiquement reconduit pour la même période, dans les mêmes conditions. Un mois avant la date de fin, nous vous informons par écrit ou directement au centre afin que vous confirmiez ou non votre prolongation. Si vous ne souhaitez pas reconduire, merci de nous en informer par courrier au minimum 30 jours avant la date de fin de contrat.',
      },
      {
        q: 'Je suis intéressé, mais je n’ai jamais pratiqué de fitness…',
        a: 'Rassurez-vous, tout le monde a bien commencé un jour. Dès votre accueil, nous prenons le temps d’échanger avec vous et de vous présenter nos coachs. Si vous le souhaitez, nous évaluons votre condition et mettons en place un programme personnalisé selon vos objectifs. Nous sommes là pour vous accompagner.',
      },
      {
        q: 'Combien de séances pour voir des résultats ?',
        a: 'Nous vous conseillons 2 à 3 séances par semaine pour observer des progrès. Les premiers jours peuvent être exigeants, mais rapidement l’entraînement devient une véritable habitude — voire une addiction !',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'On se rencontre bientôt ?',
    titleHighlight: 'bientôt ?',
    intro:
      '3 jours d’essai gratuits, une visite du centre ou une simple question — notre équipe vous répond sous 24 h.',
    phone: '027 565 41 31',
    phoneHref: 'tel:+41275654131',
    email: 'info@green-fit.ch',
    addressLine1: 'Industriestrasse 16',
    addressLine2: '3970 Salquenen / Sierre',
    mapsUrl: 'https://maps.google.com/?q=Industriestrasse+16,+3970+Salquenen',
    receptionHours: [
      { days: 'Lundi – jeudi', hours: '8h30 – 13h30 / 16h30 – 21h00' },
      { days: 'Vendredi', hours: '8h30 – 13h30 / 16h30 – 19h00' },
      { days: 'Samedi', hours: '9h00 – 12h00' },
      { days: 'Dimanche', hours: 'Fermé' },
    ],
    hoursNote:
      'Fitness adhérents : 24 h/24 · Jours fériés : réception fermée, pas de cours collectifs.',
    formTitle: 'Demande d’essai gratuit',
    formSubtitle: 'Sans engagement',
    successTitle: 'Message envoyé',
    successMessage:
      'Notre équipe vous recontacte très vite pour planifier votre essai de 3 jours.',
  },

  footer: {
    tagline:
      'Votre centre de bien-être à Salquenen / Sierre. Plus de 2 000 m² dédiés à la forme, la santé et le rétablissement.',
    columns: [
      {
        title: 'Le centre',
        links: ['À propos', 'Nos coachs', 'Équipements', 'Recrutement'],
      },
      {
        title: 'Activités',
        links: ['Cours collectifs', 'Bien-être', 'Musculation', 'Coaching'],
      },
      {
        title: 'Infos',
        links: ['Tarifs', 'FAQ', 'Contact'],
      },
    ],
  },
}
