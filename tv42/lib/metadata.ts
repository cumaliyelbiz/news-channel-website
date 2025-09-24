// app/metadata.js

export const metadata = {
    title: "Lorem Ipsum - Başlık",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    keywords: ["lorem", "ipsum", "başlık", "anahtar kelimeler"],
    authors: [{ name: "Lorem Ipsum Ekibi" }],
    creator: "Lorem Ipsum Ekibi",
    publisher: "Lorem Ipsum Ekibi",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://loremipsum.com"),
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      title: "Lorem Ipsum - Başlık",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      url: "https://loremipsum.com",
      locale: "tr_TR",
      siteName: "Lorem Ipsum - Başlık",
      images: [
        {
          url: "https://loremipsum.com/logo.jpg",
          width: 1200,
          height: 630,
          alt: "Lorem Ipsum - Başlık",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Lorem Ipsum - Başlık",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      creator: "@loremipsum",
      images: ["https://loremipsum.com/logo.jpg"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lorem Ipsum",
    "alternateName": "Lorem Ipsum Platformu",
    "url": "https://loremipsum.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://loremipsum.com/image.jpg",
      "width": "512",
      "height": "512"
    },
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "sameAs": [
      "https://twitter.com/loremipsum",
      "https://www.linkedin.com/company/loremipsum",
      "https://www.instagram.com/loremipsum",
      "https://www.facebook.com/loremipsum"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "info@loremipsum.com",
        "availableLanguage": ["Turkish", "English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": "İstanbul",
      "addressRegion": "Ilce",
      "postalCode": "34000",
      "streetAddress": "Sokak Adresi"
    },
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Lorem ipsum hizmeti",
        "description": "Lorem ipsum hizmeti açıklaması"
      }
    },
    "knowsAbout": [
      "Lorem Ipsum",
      "Başlık",
      "Örnek",
      "Hizmetler"
    ],
    "slogan": "Lorem ipsum'un yeni adresi",
    "foundingDate": "2024",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": "1",
      "maxValue": "10"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Turkey"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://loremipsum.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://loremipsum.com",
      "name": "Lorem Ipsum",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["headline", "summary"]
      }
    }
};

export { jsonLd };