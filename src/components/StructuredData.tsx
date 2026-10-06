import React from 'react';

export default function StructuredData() {
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': 'https://pandoravisuals.studio/#business',
    name: 'Pandora Visuals',
    alternateName: ['Pandora Vizuals', 'Pandora Visuals Studio'],
    description:
      'Pandora Visuals is a premier creative media production studio specializing in viral social media reels, children’s milestone birthday photography & cake smash sessions, adult milestone celebrations, commercial brand campaigns, and digital marketing.',
    url: 'https://pandoravisuals.studio',
    logo: 'https://pandoravisuals.studio/images/pandora-logo.svg',
    image: 'https://pandoravisuals.studio/images/portrait_2160x3840.webp',
    telephone: '+91 63098 97003',
    email: 'satpandora@gmail.com',
    priceRange: '$$$',
    currenciesAccepted: 'INR, USD',
    paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.385044,
      longitude: 78.486671,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Hyderabad',
      },
      {
        '@type': 'State',
        name: 'Telangana',
      },
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Worldwide',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/pandoravizuals',
      'https://www.youtube.com/@PandoraVizuals',
      'https://www.facebook.com/profile.php?id=61595026984781',
    ],
    knowsAbout: [
      'Cinematic Videography',
      'Viral Reels Production',
      'Kids 1st Birthday Photography',
      'Cake Smash Photography',
      'Milestone Adult Celebrations',
      'Commercial Lookbooks',
      'Digital Marketing Creatives',
      '4K Video Editing',
      'Color Grading',
      'Sound Design',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Production Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Viral Reels Suite',
            description:
              'High-energy 4K vertical short-form reels with custom sound design and motion grading for social platforms.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kids 1st Birthday & Cake Smash',
            description:
              'Joyful, unscripted documentation of milestone first birthdays with studio lighting, cake smash setups, and family portraits.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Milestone Adult Gala & Soirée',
            description:
              'Cinematic low-light event photography and recap film coverage for 18th, 21st, 30th, 50th birthdays and luxury anniversaries.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Funnel Digital Marketing',
            description:
              'Paid ad creative suites, performance social media content, and visual testing engineered to scale conversions.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Monthly Social Video Retainer',
            description:
              'Dedicated monthly visual production delivering 8-12 bespoke vertical videos, trend capitalization, and brand identity synchronization.',
          },
        },
      ],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://pandoravisuals.studio/#website',
    url: 'https://pandoravisuals.studio',
    name: 'Pandora Visuals',
    publisher: {
      '@id': 'https://pandoravisuals.studio/#business',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Pandora Visuals specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pandora Visuals specializes in viral 4K short-form reels, milestone children birthday & cake smash photography, luxury adult celebrations (18th, 21st, 30th, 50th), commercial editorial lookbooks, and monthly video marketing retainers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Pandora Visuals located, and do you travel for shoots?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pandora Visuals is based in Hyderabad, Telangana, India. We shoot on location and in studio across India, and travel worldwide for destination events and commercial video productions.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I book a shoot or inquire about pricing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can book directly by calling +91 63098 97003, emailing satpandora@gmail.com, tapping our direct WhatsApp chat icon on the website, or exploring our services page at pandoravisuals.studio/shop.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the delivery turnaround time for video edits and photos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard short-form reels and initial photo selections are delivered within 48 to 72 hours. Comprehensive documentary edits, retouched galleries, and master 4K color-graded films are delivered within 7 to 14 days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer monthly video retainers for businesses and creators?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our Monthly Social Video Retainer provides 8 to 12 bespoke vertical videos per month including concept scripting, shoot execution, sound design, and rapid 72-hour turnaround.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
