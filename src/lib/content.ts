/**
 * Central, BILINGUAL content source for the GeniriFlow landing page.
 *
 * Everything the UI renders lives in `CONTENT[lang]`. Components read it via
 * `useContent()` (see lib/i18n.tsx). Default language is English (LTR);
 * Hebrew is RTL. To add/adjust copy, edit here only.
 *
 * Positioning: GeniriFlow is a premium technology-solutions brand that designs
 * and builds smart business systems & custom software. AI + automation are part
 * of the solution; the promise is order, control, efficiency and growth.
 */

export type Lang = "en" | "he";

/** Non-localized brand constants. */
export const BRAND = {
  name: "GeniriFlow",
  email: "nirsa11@gmail.com",
  phone: "053-289-8849",
  phoneHref: "tel:+972532898849",
  whatsapp: "972532898849",
} as const;

/** Hero reveal frame-sequence config (canvas, scroll-driven). */
export const HERO_FRAMES = {
  path: "/frames/geniriflow-reveal",
  count: 240,
  pad: 4,
  ext: "jpg",
  poster: "/frames/geniriflow-reveal/frame_0240.jpg",
} as const;

/** Second reveal sequence — banner at the top of the Example Business Flow. */
export const FLOW_FRAMES = {
  path: "/frames2/geniriflow-reveal",
  count: 240,
  pad: 4,
  ext: "jpg",
  poster: "/frames2/geniriflow-reveal/frame_0240.jpg",
} as const;

interface SectionContent {
  nav: { links: { label: string; href: string }[]; cta: string };
  hero: {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  problem: {
    eyebrow: string;
    headline: string;
    items: { title: string; description: string; icon: string }[];
  };
  transformation: {
    eyebrow: string;
    headline: string;
    text: string;
    before: string[];
    after: string[];
    beforeLabel: string;
    afterLabel: string;
  };
  build: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    items: { title: string; description: string; icon: string; accent: string }[];
  };
  flow: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    steps: string[];
  };
  why: {
    eyebrow: string;
    headline: string;
    points: string[];
    founder: { name: string; role: string; bio: string; initials: string };
  };
  founderStory: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    signature: string;
    cta: { label: string; href: string };
  };
  process: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    steps: { title: string; description: string }[];
  };
  audit: {
    eyebrow: string;
    headline: string;
    text: string;
    button: string;
  };
  finalCta: {
    headline: string;
    text: string;
    bullets: string[];
    form: {
      name: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      business: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
  footer: {
    tagline: string;
    description: string;
    location: string;
    exploreTitle: string;
    contactTitle: string;
    bookCta: string;
    rights: string;
    founderNote: string;
  };
}

export const CONTENT: Record<Lang, SectionContent> = {
  /* ----------------------------- ENGLISH ----------------------------- */
  en: {
    nav: {
      links: [
        { label: "What We Build", href: "#what-we-build" },
        { label: "How It Works", href: "#process" },
        { label: "Why GeniriFlow", href: "#why" },
        { label: "Contact", href: "#contact" },
      ],
      cta: "Smart Business Audit",
    },
    hero: {
      eyebrow: "Smart Business Systems & Custom Software",
      headlineLead: "Turn Business Chaos Into a ",
      headlineAccent: "Smart Operating System",
      subheadline:
        "GeniriFlow designs and builds custom business systems, AI-powered workflows, automations, dashboards, and software solutions that help businesses save time, gain control, and grow faster.",
      primaryCta: { label: "Start With a Smart Business Audit", href: "#contact" },
      secondaryCta: { label: "Book a Strategy Call", href: "#contact" },
    },
    problem: {
      eyebrow: "The Problem",
      headline: "Your business is growing, but the operation behind it is messy.",
      items: [
        {
          title: "Manual repetitive work",
          description: "Your team burns hours on tasks software should handle.",
          icon: "update",
        },
        {
          title: "Scattered tools",
          description: "Data lives in five disconnected apps that don't talk.",
          icon: "integration",
        },
        {
          title: "Leaking leads",
          description: "Opportunities slip away with no follow-up in time.",
          icon: "lead",
        },
        {
          title: "No clear ownership",
          description: "Nobody's sure who's responsible for what, or when.",
          icon: "shield",
        },
        {
          title: "No real-time visibility",
          description: "You can't see what's happening without chasing people.",
          icon: "eye",
        },
        {
          title: "No operational control",
          description: "The business runs you, instead of you running it.",
          icon: "dashboard",
        },
      ],
    },
    transformation: {
      eyebrow: "The Shift",
      headline: "From scattered tools to one connected business system.",
      text: "We map your business pain, design the right workflow, and build a tailored system that connects your tools, data, people and processes into one clear operating flow.",
      beforeLabel: "Before",
      afterLabel: "After",
      before: [
        "Spreadsheets & inboxes",
        "Copy-paste between apps",
        "Lost leads & context",
        "Guesswork & blind spots",
      ],
      after: [
        "One connected system",
        "Automated handoffs",
        "Every lead tracked",
        "Real-time control",
      ],
    },
    build: {
      eyebrow: "What We Build",
      headline: "The building blocks of a smart operation.",
      subheadline:
        "From custom software to AI and automation — designed around your business, not a template.",
      items: [
        {
          title: "Smart Business Systems",
          description: "Tailored operating systems that connect your whole business into one flow.",
          icon: "flow",
          accent: "electric",
        },
        {
          title: "Custom Web & Mobile Apps",
          description: "Production-grade software built from scratch for your exact needs.",
          icon: "code",
          accent: "violet",
        },
        {
          title: "AI Agents & Automations",
          description: "Agents and workflows that handle repetitive work and take action 24/7.",
          icon: "agent",
          accent: "cyan",
        },
        {
          title: "CRM & Lead Management",
          description: "Pipelines that capture, score and route every lead automatically.",
          icon: "crm",
          accent: "electric",
        },
        {
          title: "WhatsApp & Communication Flows",
          description: "Conversational flows that follow up, qualify and support around the clock.",
          icon: "whatsapp",
          accent: "cyan",
        },
        {
          title: "Dashboards & Operational Control",
          description: "Real-time visibility and tools that put you back in control.",
          icon: "dashboard",
          accent: "violet",
        },
      ],
    },
    flow: {
      eyebrow: "Example Business Flow",
      headline: "One lead. One connected journey.",
      subheadline:
        "A single enquiry, handled end-to-end across your whole system — automatically.",
      steps: [
        "Lead captured",
        "Lead warmed up",
        "AI qualification",
        "CRM updated",
        "Follow-up sent",
        "Meeting booked",
        "Sales call documented",
        "Contract generated",
        "Customer onboarding",
      ],
    },
    why: {
      eyebrow: "Why GeniriFlow",
      headline: "Built by a developer who understands real business systems.",
      points: [
        "6+ years of end-to-end software development",
        "Real product-company experience",
        "Business-first, not tool-first thinking",
        "No-code, low-code and full custom code",
        "From idea and diagnosis to production-ready systems",
      ],
      founder: {
        name: "Nir",
        role: "Founder & Builder, GeniriFlow",
        bio: "I design and build the systems myself — from the first diagnosis of your business pain to a production-ready system your team relies on every day. Product-company experience, end-to-end, with the right mix of no-code, low-code and custom software.",
        initials: "N",
      },
    },
    founderStory: {
      eyebrow: "The Human Behind the Screen",
      headline: "Hi, I'm Nir.",
      paragraphs: [
        "For the past 6+ years I've built software end-to-end — from the first line of code to systems running in production inside real product companies.",
        "And I kept seeing the same thing: great businesses held back not by their ideas, but by messy, manual operations and tools that don't talk to each other.",
        "So I started GeniriFlow to do what I love most — sit with a business, find where the chaos actually lives, and build the smart system that turns it into calm, automated growth. No-code, low-code or full custom — whatever the problem really needs.",
      ],
      signature: "— Nir, Founder of GeniriFlow",
      cta: { label: "Let's talk", href: "#contact" },
    },
    process: {
      eyebrow: "The Process",
      headline: "A clear path from chaos to control.",
      subheadline: "A proven process that de-risks the work and ships value fast.",
      steps: [
        { title: "Diagnose", description: "We map your operation and find where the mess and the opportunity are." },
        { title: "Design", description: "We design the right workflow, system architecture and guardrails." },
        { title: "Build", description: "We build and connect everything into one reliable system." },
        { title: "Launch", description: "We test, get your sign-off, and roll out with confidence." },
        { title: "Improve", description: "We monitor, refine and expand as your business grows." },
      ],
    },
    audit: {
      eyebrow: "Smart Business Audit",
      headline: "Start with a smart diagnosis of your business process.",
      text: "Tell us where the mess is — leads, operations, payments, WhatsApp, CRM, dashboards or manual work — and we'll help you understand what can be automated or rebuilt.",
      button: "Start With a Smart Business Audit",
    },
    finalCta: {
      headline: "Ready to build your operating system?",
      text: "Leave your details and we'll get back to you with a free smart business audit — no obligation.",
      bullets: [
        "Free 30-min diagnosis call, no commitment",
        "A tailored automation & systems plan",
        "We work with the tools you already have",
      ],
      form: {
        name: { label: "Full name", placeholder: "Jane Doe" },
        phone: { label: "Phone", placeholder: "050-000-0000" },
        business: { label: "Business / field", placeholder: "e.g. online store" },
        message: { label: "What's the biggest mess right now?", placeholder: "Tell us in a sentence about the manual work eating your time…" },
        submit: "Send — let's start",
        submitting: "Sending…",
        success: "Thanks! We've got your details and will be in touch shortly.",
        error: "Oops, something went wrong. Please try again or email us.",
      },
    },
    footer: {
      tagline: "Smart Business Systems & Custom Software",
      description: "We turn scattered, manual and messy operations into organized, automated, growth-ready operating systems.",
      location: "Tel Aviv",
      exploreTitle: "Explore",
      contactTitle: "Get in touch",
      bookCta: "Start with a smart business audit",
      rights: "All rights reserved.",
      founderNote: "Built by Nir — founder & developer.",
    },
  },

  /* ----------------------------- HEBREW ----------------------------- */
  he: {
    nav: {
      links: [
        { label: "מה אנחנו בונים", href: "#what-we-build" },
        { label: "איך זה עובד", href: "#process" },
        { label: "למה GeniriFlow", href: "#why" },
        { label: "צור קשר", href: "#contact" },
      ],
      cta: "אבחון עסקי חכם",
    },
    hero: {
      eyebrow: "מערכות עסקיות חכמות ותוכנה מותאמת אישית",
      headlineLead: "הופכים כאוס עסקי ל",
      headlineAccent: "מערכת עבודה חכמה",
      subheadline:
        "GeniriFlow מאפיינת ובונה מערכות עסקיות, אוטומציות, תהליכי AI, דאשבורדים ותוכנה מותאמת אישית — כדי לחסוך זמן, לייצר סדר, לתת שליטה ולעזור לעסק לצמוח מהר יותר.",
      primaryCta: { label: "התחל עם שאלון אפיון חכם", href: "#contact" },
      secondaryCta: { label: "קבע שיחת ייעוץ", href: "#contact" },
    },
    problem: {
      eyebrow: "הבעיה",
      headline: "העסק גדל, אבל מאחורי הקלעים התפעול מבולגן.",
      items: [
        {
          title: "עבודה ידנית חוזרת",
          description: "הצוות מבזבז שעות על משימות שתוכנה אמורה לעשות.",
          icon: "update",
        },
        {
          title: "כלים מפוזרים",
          description: "הדאטה יושבת בחמש אפליקציות מנותקות שלא מדברות.",
          icon: "integration",
        },
        {
          title: "לידים שנופלים בין הכיסאות",
          description: "הזדמנויות אובדות כי אף אחד לא חזר בזמן.",
          icon: "lead",
        },
        {
          title: "אין אחריות ברורה",
          description: "לא ברור מי אחראי על מה, ומתי.",
          icon: "shield",
        },
        {
          title: "אין תמונת מצב בזמן אמת",
          description: "אי אפשר לראות מה קורה בלי לרדוף אחרי אנשים.",
          icon: "eye",
        },
        {
          title: "אין שליטה תפעולית",
          description: "העסק מנהל אתכם, במקום שאתם תנהלו אותו.",
          icon: "dashboard",
        },
      ],
    },
    transformation: {
      eyebrow: "השינוי",
      headline: "מכלים מפוזרים למערכת עסקית אחת מחוברת.",
      text: "אנחנו מאפיינים את הכאב העסקי, מתכננים את זרימת העבודה הנכונה, ובונים מערכת מותאמת שמחברת כלים, דאטה, אנשים ותהליכים לזרימת עבודה אחת ברורה.",
      beforeLabel: "לפני",
      afterLabel: "אחרי",
      before: [
        "גיליונות ותיבות מייל",
        "העתק-הדבק בין אפליקציות",
        "לידים והקשר שאובדים",
        "ניחושים ונקודות עיוורות",
      ],
      after: [
        "מערכת אחת מחוברת",
        "העברות אוטומטיות",
        "כל ליד במעקב",
        "שליטה בזמן אמת",
      ],
    },
    build: {
      eyebrow: "מה אנחנו בונים",
      headline: "אבני הבניין של תפעול חכם.",
      subheadline:
        "מתוכנה מותאמת אישית ועד AI ואוטומציה — מעוצב סביב העסק שלכם, לא לפי תבנית.",
      items: [
        {
          title: "מערכות עסקיות חכמות",
          description: "מערכות הפעלה מותאמות שמחברות את כל העסק לזרימה אחת.",
          icon: "flow",
          accent: "electric",
        },
        {
          title: "אפליקציות Web ו-Mobile בהתאמה אישית",
          description: "תוכנה ברמת פרודקשן, נבנית מאפס בדיוק לצרכים שלכם.",
          icon: "code",
          accent: "violet",
        },
        {
          title: "AI Agents ואוטומציות",
          description: "סוכנים ותהליכים שמבצעים את העבודה החוזרת ופועלים 24/7.",
          icon: "agent",
          accent: "cyan",
        },
        {
          title: "CRM וניהול לידים",
          description: "פייפליין שלוכד, מדרג ומנתב כל ליד אוטומטית.",
          icon: "crm",
          accent: "electric",
        },
        {
          title: "זרימות וואטסאפ ותקשורת",
          description: "תהליכי שיחה שעוקבים, מסננים ותומכים מסביב לשעון.",
          icon: "whatsapp",
          accent: "cyan",
        },
        {
          title: "דאשבורדים ושליטה תפעולית",
          description: "שקיפות בזמן אמת וכלים שמחזירים לכם את השליטה.",
          icon: "dashboard",
          accent: "violet",
        },
      ],
    },
    flow: {
      eyebrow: "דוגמה לזרימה עסקית",
      headline: "ליד אחד. מסע לקוח אחד מחובר.",
      subheadline:
        "פנייה אחת, מטופלת מקצה לקצה לאורך כל המערכת — אוטומטית.",
      steps: [
        "ליד נכנס",
        "חימום ליד",
        "סינון חכם",
        "עדכון CRM",
        "פולואפ אוטומטי",
        "קביעת פגישה",
        "תיעוד שיחת מכירה",
        "יצירת חוזה",
        "קליטת לקוח",
      ],
    },
    why: {
      eyebrow: "למה GeniriFlow",
      headline: "נבנה על ידי מפתח שמבין מערכות עסקיות אמיתיות.",
      points: [
        "מעל 6 שנות ניסיון בפיתוח מקצה לקצה",
        "ניסיון אמיתי בחברות מוצר",
        "חשיבה עסקית לפני בחירת כלים",
        "שילוב של no-code, low-code ופיתוח קוד מלא",
        "מאפיון וכאב ועד מערכת שעובדת בפרודקשן",
      ],
      founder: {
        name: "ניר",
        role: "מייסד ובונה, GeniriFlow",
        bio: "אני מתכנן ובונה את המערכות בעצמי — מהאבחון הראשון של הכאב העסקי ועד מערכת מוכנה לפרודקשן שהצוות שלכם נשען עליה כל יום. ניסיון בחברות מוצר, מקצה לקצה, עם השילוב הנכון של no-code, low-code ותוכנה מותאמת.",
        initials: "נ",
      },
    },
    founderStory: {
      eyebrow: "האדם שמאחורי המסך",
      headline: "היי, אני ניר.",
      paragraphs: [
        "במשך יותר מ-6 שנים אני בונה תוכנה מקצה לקצה — משורת הקוד הראשונה ועד מערכות שרצות בפרודקשן בתוך חברות מוצר אמיתיות.",
        "ושוב ושוב ראיתי את אותו הדבר: עסקים מצוינים שנתקעים לא בגלל הרעיון, אלא בגלל תפעול ידני ומבולגן וכלים שלא מדברים אחד עם השני.",
        "אז הקמתי את GeniriFlow כדי לעשות את מה שאני הכי אוהב — לשבת עם עסק, להבין איפה הכאוס באמת יושב, ולבנות את המערכת החכמה שהופכת אותו לצמיחה רגועה ואוטומטית. No-code, low-code או קוד מלא — מה שהבעיה באמת צריכה.",
      ],
      signature: "— ניר, מייסד GeniriFlow",
      cta: { label: "בוא נדבר", href: "#contact" },
    },
    process: {
      eyebrow: "התהליך",
      headline: "מסלול ברור מכאוס לשליטה.",
      subheadline: "תהליך מוכח שמוריד את הסיכון ומביא ערך מהר.",
      steps: [
        { title: "אבחון", description: "ממפים את התפעול ומאתרים איפה הבלגן ואיפה ההזדמנות." },
        { title: "אפיון ותכנון", description: "מתכננים את זרימת העבודה, ארכיטקטורת המערכת ומנגנוני הבקרה." },
        { title: "פיתוח", description: "בונים ומחברים הכל למערכת אחת אמינה." },
        { title: "השקה", description: "בודקים, מקבלים את האישור שלכם, ומשיקים בביטחון." },
        { title: "שיפור מתמשך", description: "מנטרים, משפרים ומרחיבים ככל שהעסק גדל." },
      ],
    },
    audit: {
      eyebrow: "אבחון עסקי חכם",
      headline: "מתחילים באבחון חכם של התהליך העסקי שלך.",
      text: "ספר לנו איפה הבלאגן — לידים, תפעול, תשלומים, וואטסאפ, CRM, דאשבורדים או עבודה ידנית — ונעזור להבין מה אפשר להפוך למערכת חכמה.",
      button: "התחל עם שאלון אפיון חכם",
    },
    finalCta: {
      headline: "מוכנים לבנות את מערכת העבודה שלכם?",
      text: "השאירו פרטים ונחזור אליכם עם אבחון עסקי חכם — חינם וללא התחייבות.",
      bullets: [
        "שיחת אבחון של 30 דק׳, ללא עלות וללא התחייבות",
        "תוכנית מערכות ואוטומציה מותאמת אישית",
        "נעבוד עם הכלים שכבר יש לכם",
      ],
      form: {
        name: { label: "שם מלא", placeholder: "ישראל ישראלי" },
        phone: { label: "טלפון", placeholder: "050-000-0000" },
        business: { label: "שם העסק / תחום", placeholder: "לדוגמה: חנות אונליין" },
        message: { label: "מה הבלגן הכי גדול כרגע?", placeholder: "ספרו לנו במשפט על העבודה הידנית שגוזלת לכם זמן…" },
        submit: "שליחה — בואו נתחיל",
        submitting: "שולח…",
        success: "תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.",
        error: "אופס, משהו השתבש. נסו שוב או שלחו לנו מייל.",
      },
    },
    footer: {
      tagline: "מערכות עסקיות חכמות ותוכנה מותאמת אישית",
      description: "אנחנו הופכים תפעול מפוזר, ידני ומבולגן למערכות עבודה מסודרות, אוטומטיות ומוכנות לצמיחה.",
      location: "תל אביב",
      exploreTitle: "ניווט",
      contactTitle: "יצירת קשר",
      bookCta: "התחילו עם אבחון עסקי חכם",
      rights: "כל הזכויות שמורות.",
      founderNote: "נבנה על ידי ניר — מייסד ומפתח.",
    },
  },
};
