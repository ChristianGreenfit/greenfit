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
      { href: '#partenaires', label: 'Partenaires' },
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
        text: 'Trois salles : Functional, cours collectifs et salle de spinning.',
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
    label: 'Partenaires',
    title: 'Des experts à vos côtés',
    lead:
      'Au sein de GreenFit, nos partenaires vous accompagnent pour la physiothérapie, le Pilates et d’autres disciplines complémentaires un suivi complet, au même endroit.',
    cta: '',
    offers: [
      {
        title: 'Physio Sport & Santé',
        text: 'Cabinet de physiothérapie spécialisé en réhabilitation sportive, au sein de GreenFit.',
        src: '/images/partenaires/physio-sport-sante.png',
        alt: 'Logo Physio Sport & Santé',
        url: 'https://physio-sport-sante.com',
        logo: true,
      },
      {
        title: 'Pilates Studio Anna Lillo',
        text: 'Cours privés et semi-privés de Pilates Reformer, pour renforcer, étirer et retrouver un corps aligné.',
        src: '/images/partenaires/pilates-studio-anna-lillo.png',
        alt: 'Logo Pilates Studio Anna Lillo',
        url: 'https://pilates-studio.ch',
        logo: true,
      },
      {
        title: 'SLA Skin & Laser Atelier',
        text: 'Soins de la peau et traitements laser au sein de GreenFit, pour un accompagnement esthétique au même endroit.',
        src: '/images/partenaires/sla-skin-laser-atelier.png',
        alt: 'Logo SLA Skin & Laser Atelier',
        url: 'https://skinlaseratelier.ch',
        logo: true,
      },
      {
        title: 'Body & Soul by Vera Silva',
        text: 'Massothérapie au sein de GreenFit, pour relâcher les tensions et prendre soin du corps après l’effort.',
        src: '/images/partenaires/body-and-soul-vera-silva.png',
        alt: 'Logo Body & Soul by Vera Silva',
        url: 'https://www.instagram.com/bodyandsoulsilva/',
        logo: true,
      },
      // {
      // title: 'Julia',
      // text: 'Partenaire GreenFit. Nom d’activité, logo et site internet à compléter.',
      // src: '/images/salle/salle4.jpg',
      // alt: 'Julia — partenaire GreenFit',
      // url: '',
      // },
      // {
      // title: 'Inès',
      // text: 'Partenaire GreenFit. Nom de la nouvelle société, logo et site internet à compléter.',
      // src: '/images/salle/salle2.jpg',
      // alt: 'Inès — partenaire GreenFit',
      // url: '',
      // },

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
      // Lundi
      [
        { type: 'caf', start: '09:30', end: '10:30' },
        { type: 'pump', start: '18:30', end: '19:30' },
      ],
      // Mardi
      [
        { type: 'yoga', start: '09:30', end: '11:00' },
        { type: 'fstrength', start: '12:15', end: '13:00' },
        { type: 'attack', start: '18:30', end: '19:30' },
      ],
      // Mercredi
      [
        { type: 'pilates', start: '09:30', end: '10:30' },
        { type: 'functional', start: '18:30', end: '19:15' },
      ],
      // Jeudi
      [
        { type: 'pump', start: '09:30', end: '10:30' },
        { type: 'functional', start: '12:15', end: '13:00' },
        { type: 'pump', start: '18:30', end: '19:30' },
      ],
      // Vendredi
      [],
      // Samedi
      [{ type: 'pump', start: '09:30', end: '10:30' }],
      // Dimanche
      [],
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
        text: 'Contactez la réception ou venez sur place pendant les heures d’ouverture.',
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
      'Pour un essai gratuit, contactez la réception par téléphone ou venez directement sur place pendant les heures d’ouverture.',
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
  },

  footer: {
    tagline:
      'Votre centre de bien-être à Salquenen / Sierre. Plus de 2 000 m² dédiés à la forme, la santé et le rétablissement.',
    columns: [
      {
        title: 'Le centre',
        links: [
          { label: 'À propos', href: '#centre' },
          // Pas encore de section dédiée :
          // { label: 'Nos coachs', href: '#centre' },
          // { label: 'Équipements', href: '#centre' },
          // { label: 'Recrutement', href: '#contact' },
        ],
      },
      {
        title: 'Activités',
        links: [
          { label: 'Cours collectifs', href: '#planning' },
          { label: 'Partenaires', href: '#partenaires' },
          // Pas de page dédiée pour l’instant :
          // { label: 'Musculation', href: '#centre' },
          // { label: 'Coaching', href: '#centre' },
        ],
      },
      {
        title: 'Infos',
        links: [
          { label: 'Tarifs', href: '#tarifs' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    ],
  },
}
