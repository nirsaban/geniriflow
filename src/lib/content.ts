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
  products: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    items: {
      name: string;
      description: string;
      icon: string;
      accent: string;
      url?: string;
      cta: string;
    }[];
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
    eyebrow: string;
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
        { label: "What we build", href: "#what-we-build" },
        { label: "How it works", href: "#process" },
        { label: "Why us", href: "#why" },
        { label: "Talk to us", href: "#contact" },
      ],
      cta: "Free audit",
    },
    hero: {
      eyebrow: "Custom business systems, built by hand",
      headlineLead: "The business grew. ",
      headlineAccent: "The systems didn't.",
      subheadline:
        "We build the software that replaces the spreadsheets, the copy-pasting, and the \"did anyone call them back?\" — for businesses that outgrew the tools they started with.",
      primaryCta: { label: "Start with a free audit", href: "#contact" },
      secondaryCta: { label: "Just book a call", href: "#contact" },
    },
    problem: {
      eyebrow: "Sound familiar?",
      headline: "The business is growing. The way it runs hasn't kept up.",
      items: [
        {
          title: "The same work, every day",
          description: "People retyping what a computer could have copied.",
          icon: "update",
        },
        {
          title: "Five apps, no connection",
          description: "What you need is always in the other app.",
          icon: "integration",
        },
        {
          title: "Leads that go cold",
          description: "Someone was supposed to call back. Nobody did.",
          icon: "lead",
        },
        {
          title: "Nobody owns it",
          description: "It gets done because someone remembered, not because it's anyone's job.",
          icon: "shield",
        },
        {
          title: "You have to ask to know",
          description: "Finding out where things stand means chasing three people.",
          icon: "eye",
        },
        {
          title: "The business runs you",
          description: "You're not steering. You're reacting.",
          icon: "dashboard",
        },
      ],
    },
    transformation: {
      eyebrow: "What changes",
      headline: "One place where the work actually lives.",
      text: "We sit with you, find where the hours are really going, and build a system around the way you already work — not around a template someone sold you.",
      beforeLabel: "Before",
      afterLabel: "After",
      before: [
        "Spreadsheets and inboxes",
        "Copy-paste between apps",
        "Leads with no owner",
        "Guessing how things are going",
      ],
      after: [
        "One system",
        "Handoffs that just happen",
        "Every lead has a name on it",
        "You can see it, live",
      ],
    },
    build: {
      eyebrow: "What we build",
      headline: "What we actually build.",
      subheadline:
        "Software written for your business, not configured from a template.",
      items: [
        {
          title: "Business systems",
          description: "One system your team opens in the morning instead of four.",
          icon: "flow",
          accent: "electric",
        },
        {
          title: "Web and mobile apps",
          description: "Real software, written from scratch, running in production.",
          icon: "code",
          accent: "violet",
        },
        {
          title: "AI agents and automations",
          description: "The repetitive part, handled while you sleep.",
          icon: "agent",
          accent: "cyan",
        },
        {
          title: "CRM and lead handling",
          description: "Every lead captured, routed and followed up. No sticky notes.",
          icon: "crm",
          accent: "electric",
        },
        {
          title: "WhatsApp flows",
          description: "Answers, qualifies and books meetings in the app your customers already have open.",
          icon: "whatsapp",
          accent: "cyan",
        },
        {
          title: "Dashboards",
          description: "One screen that tells you where things stand, without asking anyone.",
          icon: "dashboard",
          accent: "violet",
        },
      ],
    },
    products: {
      eyebrow: "Proof, Not Promises",
      headline: "Six systems we built. All of them live.",
      subheadline: "Not mockups. Systems we built end to end, running for real people right now.",
      items: [
        {
          name: "Kesher (geniribot)",
          description: "Answers every WhatsApp lead in seconds, asks the right questions, and books the meeting into your calendar. Even at 2am.",
          icon: "whatsapp",
          accent: "cyan",
          url: "https://wabot.miltech.cloud",
          cta: "Visit site",
        },
        {
          name: "Kursim",
          description: "A course platform that actually stops password sharing: device limits, instant kick, and your revenue stays yours.",
          icon: "shield",
          accent: "electric",
          url: "https://kursim.miltech.cloud",
          cta: "Visit site",
        },
        {
          name: "Amutot",
          description: "Runs an Israeli nonprofit end to end: members, roles, branded pages, donations. It even imports the Excel you already have.",
          icon: "data",
          accent: "violet",
          url: "https://amutot.miltech.cloud/about",
          cta: "Visit site",
        },
        {
          name: "Commons",
          description: "Community management that isn't just another group chat: five role levels, event waitlists, and billing per community.",
          icon: "scale",
          accent: "cyan",
          url: "https://comunix.miltech.cloud/about",
          cta: "Visit site",
        },
        {
          name: "MilTech",
          description: "Keeps a reserve unit organized: shifts, leave requests, service cycles, and one clear picture for the whole department.",
          icon: "lock",
          accent: "electric",
          url: "https://miltech.cloud/about",
          cta: "Visit site",
        },
        {
          name: "Pakahim",
          description: "Built for Israel Railways inspectors who used to dig through an emailed Excel to find their shift. Now they log in and see it.",
          icon: "clock",
          accent: "violet",
          url: "https://pakahim.miltech.cloud/about",
          cta: "Visit site",
        },
      ],
    },
    flow: {
      eyebrow: "What it looks like",
      headline: "One lead, from hello to signed.",
      subheadline:
        "Nobody touches any of this by hand. It's one enquiry moving through the system.",
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
      eyebrow: "Why us",
      headline: "The person who writes the code is the person you talk to.",
      points: [
        "Six years writing software that runs in production",
        "Experience inside real product companies, not only agencies",
        "I ask about your business before I pick a tool",
        "No-code, low-code or written from scratch — whichever is right",
        "From the first conversation to the system your team opens daily",
      ],
      founder: {
        name: "Nir",
        role: "Founder, GeniriFlow",
        bio: "I build the systems myself. I'm the one who sits with you at the start, and the one you call when something needs to change.",
        initials: "N",
      },
    },
    founderStory: {
      eyebrow: "About me",
      headline: "Hi, I'm Nir.",
      paragraphs: [
        "I've spent the last six years writing software that people actually depend on — inside product companies, in production, with real users on the other end.",
        "And I kept noticing the same thing. The businesses that were stuck weren't short on ideas. They were drowning in manual work and tools that didn't talk to each other.",
        "So I started GeniriFlow. I sit with a business, find where the hours are really going, and build the thing that takes it off their hands. Sometimes that's a full system. Sometimes it's a two-day automation. I'll tell you which one you need.",
      ],
      signature: "— Nir, Founder of GeniriFlow",
      cta: { label: "Let's talk", href: "#contact" },
    },
    process: {
      eyebrow: "How it works",
      headline: "How we work.",
      subheadline: "Five steps. You see something working early, not at the end.",
      steps: [
        { title: "Diagnose", description: "We go through your week and find where the hours disappear." },
        { title: "Design", description: "We agree on exactly what gets built, before anything gets built." },
        { title: "Build", description: "I build it, and you watch it come together." },
        { title: "Launch", description: "Your team tries it, we fix what's awkward, then it goes live." },
        { title: "Improve", description: "Things change. We keep it fitting." },
      ],
    },
    audit: {
      eyebrow: "Free audit",
      headline: "Not sure what's worth changing? Start here.",
      text: "Tell us where it hurts — leads, operations, payments, WhatsApp, the spreadsheet everyone complains about — and we'll tell you honestly what's worth building and what isn't.",
      button: "Start with a free audit",
    },
    finalCta: {
      eyebrow: "Let's talk",
      headline: "So, what's the mess?",
      text: "Leave your number. We'll look at how you work today and come back with a straight answer — free, no strings.",
      bullets: [
        "A 30-minute call, no charge, no pitch",
        "A plan for what to build, and in what order",
        "We work with the tools you already pay for",
      ],
      form: {
        name: { label: "Full name", placeholder: "Jane Doe" },
        phone: { label: "Phone", placeholder: "050-000-0000" },
        business: { label: "Business / field", placeholder: "e.g. online store" },
        message: { label: "What's the biggest mess right now?", placeholder: "Tell us in a sentence about the manual work eating your time…" },
        submit: "Send it",
        submitting: "Sending…",
        success: "Got it. We'll be in touch shortly.",
        error: "That didn't go through. Try again, or just email us.",
      },
    },
    footer: {
      tagline: "Custom business systems, built by hand",
      description: "We build the software that replaces the spreadsheets and the copy-pasting, for businesses that outgrew the tools they started with.",
      location: "Tel Aviv",
      exploreTitle: "Explore",
      contactTitle: "Get in touch",
      bookCta: "Start with a free audit",
      rights: "All rights reserved.",
      founderNote: "Built by Nir, personally.",
    },
  },

  /* ----------------------------- HEBREW ----------------------------- */
  he: {
    nav: {
      links: [
        { label: "מה אנחנו בונים", href: "#what-we-build" },
        { label: "איך זה עובד", href: "#process" },
        { label: "למה אנחנו", href: "#why" },
        { label: "דברו איתנו", href: "#contact" },
      ],
      cta: "אבחון חינם",
    },
    hero: {
      eyebrow: "מערכות עסקיות שנבנות ביד",
      headlineLead: "העסק גדל. ",
      headlineAccent: "השיטה נשארה אותו דבר.",
      subheadline:
        "אנחנו בונים את התוכנה שמחליפה את האקסלים, את ההעתק-הדבק ואת ה״מישהו חזר אליהם?״. לעסקים שכבר גדולים מדי בשביל הכלים שהתחילו איתם.",
      primaryCta: { label: "מתחילים באבחון חינם", href: "#contact" },
      secondaryCta: { label: "פשוט לקבוע שיחה", href: "#contact" },
    },
    problem: {
      eyebrow: "מוכר לכם?",
      headline: "העסק גדל. הדרך שבה הוא מתנהל לא התעדכנה.",
      items: [
        {
          title: "אותה עבודה, כל יום",
          description: "אנשים מקלידים מחדש מה שמחשב יכול היה להעתיק.",
          icon: "update",
        },
        {
          title: "חמש אפליקציות, אפס חיבור",
          description: "מה שאתם צריכים תמיד נמצא באפליקציה השנייה.",
          icon: "integration",
        },
        {
          title: "לידים שמתקררים",
          description: "מישהו היה אמור לחזור אליו. אף אחד לא חזר.",
          icon: "lead",
        },
        {
          title: "אין לזה בעלים",
          description: "זה קורה כי מישהו נזכר, לא כי זה התפקיד של מישהו.",
          icon: "shield",
        },
        {
          title: "צריך לשאול כדי לדעת",
          description: "כדי להבין איפה הדברים עומדים צריך לרדוף אחרי שלושה אנשים.",
          icon: "eye",
        },
        {
          title: "העסק מנהל אתכם",
          description: "אתם לא מנווטים. אתם מגיבים.",
          icon: "dashboard",
        },
      ],
    },
    transformation: {
      eyebrow: "מה משתנה",
      headline: "מקום אחד שבו העבודה באמת יושבת.",
      text: "אנחנו יושבים איתכם, מוצאים לאן השעות באמת הולכות, ובונים מערכת סביב הדרך שאתם כבר עובדים בה. לא סביב תבנית שמישהו מכר לכם.",
      beforeLabel: "לפני",
      afterLabel: "אחרי",
      before: [
        "אקסלים ותיבות מייל",
        "העתק-הדבק בין אפליקציות",
        "לידים בלי אחראי",
        "ניחוש איך הדברים הולכים",
      ],
      after: [
        "מערכת אחת",
        "העברות שקורות לבד",
        "לכל ליד יש שם",
        "רואים את זה, בזמן אמת",
      ],
    },
    build: {
      eyebrow: "מה אנחנו בונים",
      headline: "מה אנחנו בונים בפועל.",
      subheadline:
        "תוכנה שנכתבת בשביל העסק שלכם, לא מוגדרת מתוך תבנית.",
      items: [
        {
          title: "מערכות עסקיות",
          description: "מערכת אחת שהצוות פותח בבוקר במקום ארבע.",
          icon: "flow",
          accent: "electric",
        },
        {
          title: "אפליקציות ווב ומובייל",
          description: "תוכנה אמיתית, נכתבת מאפס, רצה בפרודקשן.",
          icon: "code",
          accent: "violet",
        },
        {
          title: "סוכני AI ואוטומציות",
          description: "החלק שחוזר על עצמו, נעשה בזמן שאתם ישנים.",
          icon: "agent",
          accent: "cyan",
        },
        {
          title: "CRM וניהול לידים",
          description: "כל ליד נקלט, מנותב ומקבל מענה. בלי פתקים.",
          icon: "crm",
          accent: "electric",
        },
        {
          title: "זרימות וואטסאפ",
          description: "עונה, מסנן וקובע פגישות באפליקציה שהלקוחות שלכם ממילא פתוחים בה.",
          icon: "whatsapp",
          accent: "cyan",
        },
        {
          title: "דאשבורדים",
          description: "מסך אחד שאומר לכם איפה הדברים עומדים, בלי לשאול אף אחד.",
          icon: "dashboard",
          accent: "violet",
        },
      ],
    },
    products: {
      eyebrow: "הוכחה, לא הבטחות",
      headline: "שש מערכות שבנינו. כולן באוויר.",
      subheadline: "לא הדמיות. מערכות שבנינו מקצה לקצה, ורצות עכשיו אצל אנשים אמיתיים.",
      items: [
        {
          name: "קשר (geniribot)",
          description: "עונה לכל ליד בוואטסאפ תוך שניות, שואל את השאלות הנכונות וקובע פגישה ביומן. גם בשתיים בלילה.",
          icon: "whatsapp",
          accent: "cyan",
          url: "https://wabot.miltech.cloud",
          cta: "לאתר",
        },
        {
          name: "Kursim",
          description: "פלטפורמת קורסים שבאמת עוצרת שיתוף סיסמאות: הגבלת מכשירים, ניתוק מיידי, וההכנסות נשארות שלכם.",
          icon: "shield",
          accent: "electric",
          url: "https://kursim.miltech.cloud",
          cta: "לאתר",
        },
        {
          name: "Amutot",
          description: "מנהלת עמותה מקצה לקצה: חברים, הרשאות, דפים ממותגים ותרומות. אפילו את האקסל הקיים שלכם היא יודעת לייבא.",
          icon: "data",
          accent: "violet",
          url: "https://amutot.miltech.cloud/about",
          cta: "לאתר",
        },
        {
          name: "Commons",
          description: "ניהול קהילה שהוא לא עוד קבוצת וואטסאפ: חמש דרגות הרשאה, רשימות המתנה לאירועים וגבייה לכל קהילה בנפרד.",
          icon: "scale",
          accent: "cyan",
          url: "https://comunix.miltech.cloud/about",
          cta: "לאתר",
        },
        {
          name: "MilTech",
          description: "שומרת על פלוגת מילואים מסודרת: משמרות, בקשות חופשה, מחזורי שירות ותמונה אחת ברורה לכל המסגרת.",
          icon: "lock",
          accent: "electric",
          url: "https://miltech.cloud/about",
          cta: "לאתר",
        },
        {
          name: "Pakahim",
          description: "נבנתה לפקחי רכבת ישראל שחיפשו את עצמם כל בוקר באקסל. עכשיו הם נכנסים ורואים את המשמרת. זהו.",
          icon: "clock",
          accent: "violet",
          url: "https://pakahim.miltech.cloud/about",
          cta: "לאתר",
        },
      ],
    },
    flow: {
      eyebrow: "איך זה נראה",
      headline: "ליד אחד, מ״שלום״ ועד חתימה.",
      subheadline:
        "אף אחד לא נוגע בזה ידנית. זו פנייה אחת שעוברת במערכת.",
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
      eyebrow: "למה אנחנו",
      headline: "מי שכותב את הקוד הוא מי שתדברו איתו.",
      points: [
        "שש שנים של כתיבת תוכנה שרצה בפרודקשן",
        "ניסיון מבפנים בחברות מוצר, לא רק בסוכנויות",
        "אני שואל על העסק לפני שאני בוחר כלי",
        "No-code, low-code או קוד מאפס — מה שנכון",
        "מהשיחה הראשונה ועד המערכת שהצוות פותח כל בוקר",
      ],
      founder: {
        name: "ניר",
        role: "מייסד, GeniriFlow",
        bio: "אני בונה את המערכות בעצמי. אני זה שיושב איתכם בהתחלה, ואני זה שתתקשרו אליו כשצריך לשנות משהו.",
        initials: "נ",
      },
    },
    founderStory: {
      eyebrow: "קצת עליי",
      headline: "היי, אני ניר.",
      paragraphs: [
        "שש שנים אני כותב תוכנה שאנשים באמת תלויים בה — בתוך חברות מוצר, בפרודקשן, עם משתמשים אמיתיים בצד השני.",
        "ושוב ושוב ראיתי את אותו דבר. העסקים שנתקעו לא היו חסרי רעיונות. הם טבעו בעבודה ידנית ובכלים שלא מדברים אחד עם השני.",
        "אז הקמתי את GeniriFlow. אני יושב עם עסק, מוצא לאן השעות באמת הולכות, ובונה את הדבר שמוריד את זה מהם. לפעמים זו מערכת שלמה. לפעמים זו אוטומציה של יומיים. אני אגיד לכם מה מהשניים אתם צריכים.",
      ],
      signature: "— ניר, מייסד GeniriFlow",
      cta: { label: "בואו נדבר", href: "#contact" },
    },
    process: {
      eyebrow: "איך זה עובד",
      headline: "ככה אנחנו עובדים.",
      subheadline: "חמישה שלבים. אתם רואים משהו עובד מוקדם, לא בסוף.",
      steps: [
        { title: "אבחון", description: "עוברים על השבוע שלכם ומוצאים איפה השעות נעלמות." },
        { title: "אפיון", description: "מסכמים בדיוק מה נבנה, לפני שבונים משהו." },
        { title: "פיתוח", description: "אני בונה, ואתם רואים את זה מתהווה." },
        { title: "השקה", description: "הצוות מתנסה, מתקנים מה שמעצבן, ועולים לאוויר." },
        { title: "שיפור", description: "דברים משתנים. אנחנו דואגים שזה ימשיך להתאים." },
      ],
    },
    audit: {
      eyebrow: "אבחון חינם",
      headline: "לא בטוחים מה שווה לשנות? מתחילים מכאן.",
      text: "ספרו לנו איפה כואב — לידים, תפעול, תשלומים, וואטסאפ, האקסל שכולם מתלוננים עליו — ונגיד לכם בכנות מה שווה לבנות ומה לא.",
      button: "מתחילים באבחון חינם",
    },
    finalCta: {
      eyebrow: "בואו נדבר",
      headline: "אז מה הבלגן?",
      text: "השאירו טלפון. נסתכל על איך אתם עובדים היום ונחזור עם תשובה ישרה — בחינם, בלי התחייבות.",
      bullets: [
        "שיחה של 30 דקות, בלי תשלום ובלי מכירות",
        "תוכנית מה לבנות, ובאיזה סדר",
        "עובדים עם הכלים שאתם כבר משלמים עליהם",
      ],
      form: {
        name: { label: "שם מלא", placeholder: "ישראל ישראלי" },
        phone: { label: "טלפון", placeholder: "050-000-0000" },
        business: { label: "שם העסק / תחום", placeholder: "לדוגמה: חנות אונליין" },
        message: { label: "מה הבלגן הכי גדול כרגע?", placeholder: "ספרו לנו במשפט על העבודה הידנית שגוזלת לכם זמן…" },
        submit: "שולחים",
        submitting: "שולח…",
        success: "קיבלנו. נחזור אליכם בקרוב.",
        error: "זה לא נשלח. נסו שוב, או פשוט שלחו לנו מייל.",
      },
    },
    footer: {
      tagline: "מערכות עסקיות שנבנות ביד",
      description: "אנחנו בונים את התוכנה שמחליפה את האקסלים ואת ההעתק-הדבק, לעסקים שכבר גדולים מדי בשביל הכלים שהתחילו איתם.",
      location: "תל אביב",
      exploreTitle: "ניווט",
      contactTitle: "יצירת קשר",
      bookCta: "מתחילים באבחון חינם",
      rights: "כל הזכויות שמורות.",
      founderNote: "נבנה על ידי ניר, אישית.",
    },
  },
};
