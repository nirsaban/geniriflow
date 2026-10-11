// The production screenplay as structured data.
// Every scene is an ordered list of items: spoken lines (rendered by the TTS
// pipeline) and silent action beats (fixed durations). The timeline builder
// lays them out back-to-back, so all timing is deterministic and derived from
// the real length of each generated voice clip.
//
// `tr` is a stress-marked phonetic transliteration used to drive the Hebrew
// voice synthesiser (unvocalised Hebrew is ambiguous for TTS):
//   '  stress on the following vowel     x  ח/כ      sh  ש      r  ר
//   y  י consonant                        ts צ       -   joins a prefix
//   repeated vowels are held longer ("sab'aaan")

export type Who =
  | 'nir'
  | 'roee'
  | 'marom'
  | 'narr'
  | 'girl'
  | 'girl2'
  | 'guard'
  | 'manager'
  | 'both';

export type Mood =
  | 'normal'
  | 'shout'
  | 'scream'
  | 'whisper'
  | 'solemn'
  | 'flirt'
  | 'sing'
  | 'sarcastic'
  | 'panic';

export type SfxName =
  | 'gong'
  | 'knock'
  | 'snore'
  | 'scratch'
  | 'flush'
  | 'squeak'
  | 'siren'
  | 'alarm'
  | 'register'
  | 'registerScream'
  | 'steps'
  | 'crickets'
  | 'slam'
  | 'pop'
  | 'whoosh'
  | 'splash'
  | 'thunder'
  | 'ding'
  | 'boing'
  | 'sting'
  | 'choir'
  | 'giggle'
  | 'click'
  | 'smash'
  | 'tick'
  | 'doorbell'
  | 'bonk'
  | 'scream3'
  | 'heli'
  | 'sparkle'
  | 'spray';

export type MusicName =
  | 'theme'
  | 'drive'
  | 'beach'
  | 'club'
  | 'heroic'
  | 'lounge'
  | 'ceremony'
  | 'ending'
  | 'tension';

export type AmbienceName = 'waves' | 'rain' | 'engine' | 'clubRoom' | 'night' | 'pool';

export interface SfxCue {
  s: SfxName;
  at?: number; // seconds from the item start
  vol?: number;
}

interface ItemBase {
  id: string;
  sfx?: SfxCue[];
}

export interface LineItem extends ItemBase {
  kind: 'line';
  who: Who;
  he: string;
  tr: string;
  mood?: Mood;
  /** silence (s) after the line before the next item */
  post?: number;
}

export interface BeatItem extends ItemBase {
  kind: 'beat';
  dur: number;
  label: string;
}

export type Item = LineItem | BeatItem;

export interface MusicCue {
  track: MusicName;
  vol: number;
  from?: string; // item id where music starts (default scene start)
  to?: string; // item id where music stops (default scene end)
}

export interface Scene {
  id: string;
  n: number;
  title: string;
  location: string;
  music?: MusicCue[];
  ambience?: { track: AmbienceName; vol: number }[];
  /** minutes shown on the "time since last plate ceremony" clock */
  timer: { start: number; end: number; resetAt?: string };
  items: Item[];
}

const L = (
  id: string,
  who: Who,
  he: string,
  tr: string,
  opts: { mood?: Mood; post?: number; sfx?: SfxCue[] } = {},
): LineItem => ({ id, kind: 'line', who, he, tr, ...opts });

const B = (id: string, dur: number, label: string, sfx?: SfxCue[]): BeatItem => ({
  id,
  kind: 'beat',
  dur,
  label,
  sfx,
});

export const FILM_TITLE = 'אילת 2026 — שלושה מטומטמים, אפס נייר טואלט';

export const SCENES: Scene[] = [
  {
    id: 's01',
    n: 1,
    title: 'הפלישה',
    location: 'דירה של ניר — 2:00 בלילה',
    ambience: [{ track: 'night', vol: 0.25 }],
    music: [{ track: 'theme', vol: 0.55, from: 's01_title' }],
    timer: { start: 0, end: 0 },
    items: [
      B('s01_sleep', 1.4, 'Dark apartment, Nir snoring', [{ s: 'snore' }]),
      B('s01_bang', 1.2, 'BAM BAM BAM on the door', [{ s: 'knock' }]),
      L('s01_l1', 'roee', 'סבןןן! יא בן זונה, פתח!', "sab'aaan! ya ben z'ona, pt'ax!", { mood: 'shout', sfx: [{ s: 'knock', at: 0.9, vol: 0.6 }] }),
      L('s01_l2', 'nir', 'מה קרה?! מלחמה?!', "ma kar'a?! milxam'a?!", { mood: 'panic' }),
      L('s01_l3', 'marom', 'יותר גרוע. אנחנו נוסעים לאילת!', "yot'er gar'ua. an'axnu nos'im le-eyl'at!", { mood: 'shout' }),
      L('s01_l4', 'nir', 'השעה שתיים בלילה, יא חולי נפש!', "ha-sha'a shtaym ba-l'ayla, ya xol'ey n'efesh!", { mood: 'shout' }),
      L('s01_l5', 'roee', 'אחי, אנחנו כבר עם התיקים!', "'axi, an'axnu kv'ar im ha-tik'im!"),
      L('s01_l6', 'nir', 'אני עובד מחר!', "an'i ov'ed max'ar!", { mood: 'shout' }),
      L('s01_l7', 'marom', 'יש לך מחשב, לא?', "yesh lex'a maxsh'ev, l'o?", { mood: 'sarcastic', post: 0.2 }),
      B('s01_freeze', 0.5, 'FREEZE FRAME', [{ s: 'scratch' }]),
      L('s01_n1', 'narr', 'וככה התחיל סופ״ש שהיה צריך להיגמר בצו הרחקה.', "ve-x'axa hitx'il s'ofash she-hay'a tsar'ix le-hig'amer be-ts'av harxak'a.", { post: 0.3 }),
      B('s01_title', 3.2, 'TITLE CARD', [{ s: 'sting' }]),
    ],
  },
  {
    id: 's02',
    n: 2,
    title: 'הנסיעה',
    location: 'כביש 90 — בוקר',
    ambience: [{ track: 'engine', vol: 0.35 }],
    music: [{ track: 'drive', vol: 0.4 }],
    timer: { start: 0, end: 0 },
    items: [
      B('s02_drive', 1.3, 'Car speeds through the desert', [{ s: 'whoosh' }]),
      L('s02_sing', 'roee', 'אילת, אילת, לה לה לה!', "eyl'at, eyl'at, la la l'aaa!", { mood: 'sing' }),
      L('s02_l1', 'manager', 'ניר, אתה איתנו?', "n'ir, at'a it'anu?"),
      L('s02_l2', 'nir', 'כן, ברור, אני עובד מהבית.', "ken, bar'ur, an'i ov'ed me-ha-b'ayit."),
      L('s02_l3', 'roee', 'אילתתת! יא בני זונות!', "eyl'aaat! ya bn'ey zon'ot!", { mood: 'scream' }),
      B('s02_mute', 0.6, 'Nir slams mute', [{ s: 'click' }]),
      L('s02_l4', 'nir', 'אני אהרוג אתכם.', "an'i eh'erog etx'em.", { mood: 'whisper', post: 0.3 }),
      L('s02_n1', 'narr', 'שלוש שעות עבודה, אפס שורות קוד, ומאה אחוז סיכוי לפיטורים.', "shal'osh sha'ot avod'a, 'efes shur'ot k'od, u-m'ea ax'uz sik'uy le-pitur'im.", { post: 0.4 }),
    ],
  },
  {
    id: 's03',
    n: 3,
    title: 'הדירה',
    location: 'דירה באילת — צהריים',
    music: [{ track: 'theme', vol: 0.3, to: 's03_slam' }],
    timer: { start: 92, end: 117 },
    items: [
      B('s03_enter', 1.8, 'Door kicks open, suitcases fly, bottles pop', [
        { s: 'slam', vol: 0.6 },
        { s: 'whoosh', at: 0.4 },
        { s: 'bonk', at: 0.9 },
        { s: 'pop', at: 1.3 },
        { s: 'pop', at: 1.6 },
      ]),
      L('s03_l1', 'marom', 'מה זה המזגן המסריח הזה?!', "ma ze ha-mazg'an ha-masr'iax ha-z'e?!", { mood: 'shout' }),
      L('s03_l2', 'nir', 'מה אתה רוצה? הגענו לפני שלושים שניות!', "ma at'a rots'e? hig'anu lifn'ey shlosh'im shniy'ot!"),
      L('s03_l3', 'marom', 'בחוץ ארבעים מעלות, ובפנים גיהינום עם שלט!', "ba-x'uts arba'im maal'ot, u-vi-fn'im gehin'om im shl'at!", { mood: 'shout' }),
      L('s03_l4', 'roee', 'אחים שלי, הסופ״ש הזה אנחנו לא ישנים!', "ax'im shel'i, ha-s'ofash ha-z'e an'axnu lo yeshen'im!", { sfx: [{ s: 'pop', at: 0.1 }] }),
      B('s03_slam', 0.9, 'Bathroom door slams', [{ s: 'slam' }, { s: 'squeak', at: 0.5 }]),
      L('s03_l5', 'nir', 'מי הבן זונה שגמר את הנייר?!', "mi ha-ben z'ona she-gam'ar et ha-ney'ar?!", { mood: 'scream' }),
      B('s03_alarm', 1.8, 'Red emergency light — EMERGENCY #1', [{ s: 'alarm' }]),
    ],
  },
  {
    id: 's04',
    n: 4,
    title: 'טקס הצלחת הראשון',
    location: 'דירה באילת — 2 שעות אחרי ההגעה',
    music: [{ track: 'ceremony', vol: 0.55, from: 's04_bow', to: 's04_faces' }],
    timer: { start: 117, end: 120, resetAt: 's04_gong' },
    items: [
      B('s04_tick', 0.9, 'Clock ticks to exactly two hours', [{ s: 'tick' }, { s: 'tick', at: 0.45 }]),
      B('s04_gong', 1.8, 'DONG — everything freezes, spotlight on the plate', [{ s: 'gong' }]),
      L('s04_l1', 'marom', 'הגיע הזמן.', "hig'ia ha-zm'an.", { mood: 'whisper', post: 0.2 }),
      L('s04_l2', 'nir', 'עוד פעם? רק הגענו!', "od p'aam? rak hig'anu!"),
      L('s04_l3', 'roee', 'לא מזלזלים במסורת.', "lo mezalzel'im ba-mas'oret.", { mood: 'solemn', post: 0.2 }),
      B('s04_bow', 2.0, 'Synchronised formal bow toward the plate', [{ s: 'whoosh', at: 0.3 }]),
      B('s04_choir', 1.8, 'Exterior: absurd choir, sparkle puff', [{ s: 'choir' }, { s: 'sparkle', at: 1.4 }]),
      B('s04_faces', 1.4, 'Three wide-eyed faces', [{ s: 'boing', at: 0.2 }]),
      L('s04_n1', 'narr', 'ומאותו רגע, כל שעתיים, נערך הטקס הקדוש שאף אחד לא היה מוכן להסביר.', "u-me-ot'o r'ega, kol shaat'ayim, neer'ax ha-t'ekes ha-kad'osh she-af ex'ad lo hay'a mux'an le-hasb'ir.", { post: 0.4 }),
    ],
  },
  {
    id: 's05',
    n: 5,
    title: 'חוף מוש',
    location: 'חוף מוש — יום',
    ambience: [{ track: 'waves', vol: 0.45 }],
    music: [{ track: 'beach', vol: 0.32, to: 's05_silence' }],
    timer: { start: 14, end: 48 },
    items: [
      B('s05_beach', 1.0, 'Beautiful beach, three guys with drinks'),
      L('s05_l1', 'guard', 'מה יש לכם בכוס?', "ma yesh lax'em ba-k'os?"),
      L('s05_l2', 'marom', 'ויטמינים.', "vitamin'im.", { post: 0.15 }),
      L('s05_l3', 'nir', 'כן, בעיקר ויטמין וודקה.', "ken, be-ik'ar vitam'in v'odka."),
      B('s05_look', 1.0, 'Guard gives a suspicious look', [{ s: 'sting', vol: 0.35 }]),
      L('s05_l4', 'roee', 'תקשיבו, אני הולך להביא לנו חברות לסופ״ש.', "takshiv'u, an'i hol'ex le-hav'i l'anu xaver'ot la-s'ofash."),
      L('s05_l5', 'nir', 'רואי, רק אל תדבר.', "r'oi, rak al tedab'er."),
      B('s05_approach', 1.4, 'Roee struts over, the women laugh', [{ s: 'steps' }, { s: 'giggle', at: 0.7 }]),
      L('s05_l6', 'roee', 'תגידו, יש לכן תוכניות לערב?', "tag'idu, yesh lax'en toxniy'ot la-'erev?", { mood: 'flirt' }),
      L('s05_l7', 'girl', 'אולי, למה?', "ul'ay, l'ama?", { mood: 'flirt' }),
      L('s05_l8', 'roee', 'כי יש לנו דירה, מזגן שלא עובד, ואפס נייר טואלט.', "ki yesh l'anu dir'a, mazg'an she-lo ov'ed, ve-'efes ney'ar tual'et.", { mood: 'flirt' }),
      B('s05_silence', 2.0, 'SILENCE. The women leave.', [{ s: 'crickets' }, { s: 'steps', at: 1.0 }]),
      L('s05_l9', 'nir', 'וואלה, מכרת את זה יפה.', "w'ala, mak'arta et ze yaf'e.", { mood: 'sarcastic' }),
      B('s05_count', 1.2, 'Counter: 4', [{ s: 'boing' }]),
    ],
  },
  {
    id: 's06',
    n: 6,
    title: 'הבנות בדירה',
    location: 'הדירה — ערב',
    music: [{ track: 'lounge', vol: 0.28, to: 's06_scream' }],
    timer: { start: 55, end: 82 },
    items: [
      B('s06_prep', 2.0, 'Nir cleans, Marom smacks the AC remote, Roee rehearses in the mirror', [
        { s: 'bonk', at: 0.5 },
        { s: 'bonk', at: 1.1 },
        { s: 'spray', at: 1.6 },
      ]),
      B('s06_bell', 0.8, 'Doorbell', [{ s: 'doorbell' }]),
      L('s06_l1', 'girl', 'איזה נחמד פה!', "'eyze nexm'ad p'o!"),
      L('s06_l2', 'marom', 'חכי שתנסי את המזגן.', "xak'i she-tenas'i et ha-mazg'an.", { mood: 'sarcastic' }),
      L('s06_l3', 'roee', 'תקשיבו, אנחנו שלושה גברים מאוד איכותיים.', "takshiv'u, an'axnu shlosh'a gvar'im me'od exutiy'im.", { mood: 'flirt' }),
      B('s06_scream', 0.6, 'Scream from the bathroom', [{ s: 'squeak' }]),
      L('s06_l4', 'nir', 'מרוםםם! תביא נייררר!', "mar'ooom! tav'i ney'aaar!", { mood: 'scream' }),
      B('s06_alarm', 1.3, 'Bathroom emergency #2', [{ s: 'alarm' }]),
      L('s06_l5', 'roee', 'אז כמו שאמרתי, מאוד איכותיים.', "az kmo she-am'arti, me'od exutiy'im.", { mood: 'flirt' }),
      B('s06_looks', 0.9, 'The women exchange looks'),
      L('s06_l6', 'girl2', 'טוב… נראה לי שאנחנו נזוז.', "t'ov... nir'e l'i she-an'axnu naz'uz."),
      B('s06_slam', 0.8, 'Door slams', [{ s: 'slam' }]),
      L('s06_n1', 'narr', 'הן היו אמורות להישאר כל הסופ״ש. הן לא שרדו אפילו עד הטקס הבא.', "hen h'ayu amur'ot le-hisha'er kol ha-s'ofash. hen lo sard'u af'ilu ad ha-t'ekes ha-b'a.", { post: 0.2 }),
      B('s06_count', 1.0, 'Counter: 8', [{ s: 'boing' }]),
    ],
  },
  {
    id: 's07',
    n: 7,
    title: 'סלינה',
    location: 'סלינה — לילה',
    ambience: [{ track: 'clubRoom', vol: 0.3 }],
    music: [{ track: 'club', vol: 0.5 }],
    timer: { start: 20, end: 52 },
    items: [
      B('s07_club', 1.2, 'Neon, loud music, drinks ordered'),
      L('s07_l1', 'nir', 'מה זה המחיר הזה?!', "ma ze ha-mex'ir ha-z'e?!", { mood: 'shout' }),
      L('s07_l2', 'marom', 'מה הזמנו, את כל הבר?!', "ma hizm'anu, et kol ha-b'ar?!", { mood: 'shout' }),
      L('s07_l3', 'roee', 'עזבו כסף, תראו כמה בחורות!', "izv'u k'esef, tir'u k'ama baxur'ot!", { mood: 'shout' }),
      B('s07_terror', 0.9, 'Nir and Marom exchange a look of terror', [{ s: 'sting', vol: 0.4 }]),
      L('s07_l4', 'nir', 'לא. רואי. לא.', "l'o. r'oi. l'o.", { post: 0.2 }),
      B('s07_smash', 1.8, 'SMASH CUT — the women are already leaving', [{ s: 'scratch' }, { s: 'steps', at: 0.5 }]),
      L('s07_l5', 'roee', 'אחי, אני נשבע לך, הן היו בקטע!', "'axi, an'i nishb'a lex'a, hen h'ayu ba-k'eta!", { mood: 'panic' }),
      L('s07_n1', 'narr', 'בשלב הזה גם המאבטחים התחילו להזהיר את הבחורות מראש.', "be-shl'av ha-z'e gam ha-meavtx'im hitx'ilu le-hazh'ir et ha-baxur'ot me-r'osh.", { post: 0.2 }),
      B('s07_count', 1.0, 'Counter: 13', [{ s: 'boing' }]),
    ],
  },
  {
    id: 's08',
    n: 8,
    title: 'הצלחת חוזרת',
    location: 'הדירה — 2 שעות אחרי הטקס הקודם',
    music: [{ track: 'ceremony', vol: 0.55, from: 's08_bow', to: 's08_cave' }],
    timer: { start: 118, end: 120, resetAt: 's08_gong' },
    items: [
      B('s08_return', 1.2, 'The guys stumble back in', [{ s: 'slam', vol: 0.5 }, { s: 'tick', at: 0.7 }]),
      B('s08_gong', 1.5, 'DONG!', [{ s: 'gong' }]),
      L('s08_l1', 'marom', 'כולם לעמדות.', "kul'am la-emd'ot.", { mood: 'solemn' }),
      L('s08_l2', 'nir', 'אני באמצע לחרבן!', "an'i ba-'emtsa le-xarb'en!", { mood: 'scream' }),
      L('s08_l3', 'roee', 'הטקס לא מחכה לאף אחד.', "ha-t'ekes lo mexak'e le-af ex'ad.", { mood: 'solemn', post: 0.2 }),
      B('s08_bow', 2.2, 'Heavenly spotlight. Religious bow.', [{ s: 'choir', vol: 0.6 }, { s: 'whoosh', at: 0.4 }]),
      B('s08_cave', 0.8, 'Mock-documentary cave painting', [{ s: 'sparkle', at: 0.1 }]),
      L('s08_n1', 'narr', 'חוקרי תרבויות עדיין מנסים להבין מה לעזאזל קרה שם.', "xokr'ey tarbuy'ot ad'ayin menas'im le-hav'in ma la-azaz'el kar'a sh'am.", { post: 0.3 }),
      L('s08_l4', 'nir', 'אבל מי לקח את הנייר?!', "av'al mi lak'ax et ha-ney'ar?!", { mood: 'scream', post: 0.3, sfx: [{ s: 'squeak', at: 0.1 }] }),
    ],
  },
  {
    id: 's09',
    n: 9,
    title: 'ארוחת הבוקר',
    location: 'מלון — בוקר',
    music: [{ track: 'lounge', vol: 0.25, to: 's09_register' }],
    timer: { start: 64, end: 90 },
    items: [
      B('s09_receipt', 1.5, 'A receipt arrives: 500 ₪', [{ s: 'sting', at: 0.7, vol: 0.5 }]),
      L('s09_l1', 'nir', 'חמש מאות שקל?!', "xam'esh me'ot sh'ekel?!", { mood: 'scream' }),
      L('s09_l2', 'marom', 'מה אכלנו, את המלצר?!', "ma ax'alnu, et ha-melts'ar?!", { mood: 'shout' }),
      L('s09_l3', 'roee', 'אחי, לפחות היה טעים.', "'axi, le-fax'ot hay'a ta'im."),
      L('s09_l4', 'nir', 'אכלת חביתה ולחמנייה, יא חמור!', "ax'alta xavit'a ve-laxmaniy'a, ya xam'or!", { mood: 'shout' }),
      B('s09_register', 1.6, 'Zoom into the bill. Cash register screams.', [{ s: 'registerScream' }]),
      L('s09_n1', 'narr', 'שלוש ביצים, שתי לחמניות, ומשכנתה לשלושים שנה.', "shal'osh beyts'im, sht'ey laxmaniy'ot, u-mashkant'a li-shlosh'im shan'a.", { post: 0.4, sfx: [{ s: 'register', at: 0.2, vol: 0.4 }] }),
    ],
  },
  {
    id: 's10',
    n: 10,
    title: 'רויאל גארדן',
    location: 'בריכת המלון — יום',
    ambience: [{ track: 'pool', vol: 0.35 }],
    music: [{ track: 'beach', vol: 0.3 }],
    timer: { start: 30, end: 58 },
    items: [
      B('s10_pool', 1.4, 'Relaxing by the pool. Perfect.'),
      L('s10_l1', 'roee', 'תקשיבו, הפעם אני בא רגוע.', "takshiv'u, ha-p'aam an'i ba rag'ua."),
      L('s10_l2', 'nir', 'זה בדיוק מה שמפחיד אותי.', "ze bed'iyuk ma she-mafx'id ot'i.", { mood: 'sarcastic' }),
      B('s10_approach', 2.4, 'Roee approaches… seconds later the women walk away', [
        { s: 'steps' },
        { s: 'scratch', at: 1.2 },
        { s: 'steps', at: 1.4 },
      ]),
      L('s10_l3', 'marom', 'אחי, אולי פשוט תפסיק לדבר?', "'axi, ul'ay pash'ut tafs'ik le-dab'er?"),
      L('s10_l4', 'roee', 'אתם לא מבינים נשים.', "at'em lo mevin'im nash'im.", { mood: 'flirt' }),
      L('s10_l5', 'nir', 'נכון. אבל אנחנו מבינים למה הן בורחות.', "nax'on. av'al an'axnu mevin'im l'ama hen borx'ot.", { mood: 'sarcastic' }),
      B('s10_count', 1.0, 'Counter: 19', [{ s: 'boing' }]),
    ],
  },
  {
    id: 's11',
    n: 11,
    title: 'הן חזרו!',
    location: 'הדירה — אחר הצהריים',
    music: [{ track: 'theme', vol: 0.4, from: 's11_l1', to: 's11_enter' }],
    timer: { start: 70, end: 96 },
    items: [
      B('s11_notif', 0.9, 'Phone notification', [{ s: 'ding' }]),
      L('s11_l1', 'roee', 'אחים שלי! הבנות חוזרות!', "ax'im shel'i! ha-ban'ot xozr'ot!", { mood: 'shout' }),
      B('s11_prep', 1.8, 'Celebration: hair, perfume, poses', [{ s: 'spray', at: 0.8 }, { s: 'sparkle', at: 1.6 }]),
      B('s11_enter', 0.8, 'The women enter', [{ s: 'doorbell' }]),
      L('s11_l2', 'girl', 'באנו לקחת את המזוודה ששכחנו.', "b'anu lak'axat et ha-mizvad'a she-shax'axnu."),
      B('s11_take', 2.2, 'Silence. They take the suitcase and leave.', [{ s: 'crickets' }, { s: 'steps', at: 0.8 }]),
      L('s11_l3', 'marom', 'אז… לא נשארות?', "az... lo nishar'ot?", { post: 0.1 }),
      B('s11_slam', 0.8, 'Door slams', [{ s: 'slam' }]),
      L('s11_n1', 'narr', 'פעם ראשונה בהיסטוריה שמזוודה קיבלה יותר יחס משלושה גברים.', "p'aam rishon'a ba-hist'orya she-mizvad'a kibl'a yot'er y'axas mi-shlosh'a gvar'im.", { post: 0.4 }),
    ],
  },
  {
    id: 's12',
    n: 12,
    title: 'הרודס והגשם',
    location: 'מלון הרודס — יום',
    ambience: [{ track: 'rain', vol: 0.5 }],
    music: [{ track: 'tension', vol: 0.35, from: 's12_rain' }],
    timer: { start: 38, end: 60 },
    items: [
      B('s12_pose', 1.4, 'Posing like millionaires', [{ s: 'sparkle' }]),
      L('s12_l1', 'nir', 'סוף סוף מקום ברמה.', "sof s'of mak'om ba-ram'a."),
      L('s12_l2', 'marom', 'יש פה מזגן נורמלי לפחות?', "yesh po mazg'an norm'ali le-fax'ot?"),
      B('s12_rain', 1.0, 'Thunder — rain pours', [{ s: 'thunder' }]),
      L('s12_l3', 'roee', 'מה זה החרא הזה?! באנו לאילת!', "ma ze ha-x'ara ha-z'e?! b'anu le-eyl'at!", { mood: 'scream' }),
      B('s12_run', 3.0, 'Running through the rain; Roee flirts, woman escapes into a taxi', [
        { s: 'steps' },
        { s: 'steps', at: 1.2 },
        { s: 'slam', at: 2.4, vol: 0.6 },
        { s: 'whoosh', at: 2.6 },
      ]),
      B('s12_count', 1.0, 'Counter: 20', [{ s: 'boing' }]),
    ],
  },
  {
    id: 's13',
    n: 13,
    title: 'אפוקליפסת הנייר',
    location: 'שירותים שונים — מונטאז׳',
    music: [{ track: 'heroic', vol: 0.6, from: 's13_command', to: 's13_fall' }],
    timer: { start: 112, end: 120, resetAt: 's13_gong' },
    items: [
      B('s13_split', 1.0, 'Three-way split screen, every roll empty', [{ s: 'squeak' }, { s: 'squeak', at: 0.4 }, { s: 'squeak', at: 0.7 }]),
      B('s13_screams', 1.0, 'THREE SIMULTANEOUS SCREAMS', [{ s: 'scream3' }]),
      L('s13_l1', 'nir', 'מרוםםם! נייררר!', "mar'ooom! ney'aaar!", { mood: 'scream' }),
      L('s13_l2', 'marom', 'רואייי! תביא מגבונים!', "r'oiii! tav'i magbon'im!", { mood: 'scream' }),
      L('s13_l3', 'roee', 'גם אני תקוע, יא בני זונות!', "gam an'i tak'ua, ya bn'ey zon'ot!", { mood: 'scream' }),
      B('s13_command', 2.2, 'Military command center: OPERATION CODE BROWN', [{ s: 'siren' }]),
      B('s13_heli', 2.6, 'Helicopter over Eilat with a giant roll', [{ s: 'heli' }]),
      B('s13_fall', 2.2, 'The roll falls into the sea. Silence.', [{ s: 'whoosh' }, { s: 'splash', at: 0.9 }]),
      L('s13_l4', 'nir', 'אני בחיים לא נוסע איתכם יותר.', "an'i ba-xay'im lo nos'ea itx'em yot'er.", { post: 0.2 }),
      B('s13_gong', 1.5, 'DONG! They slowly turn to the plate', [{ s: 'gong' }]),
      L('s13_l5', 'roee', 'אבל קודם… הטקס.', "av'al k'odem... ha-t'ekes.", { mood: 'solemn' }),
      B('s13_bow', 2.2, 'Perfectly synchronised bow', [{ s: 'choir', vol: 0.8 }]),
      B('s13_black', 0.9, 'SMASH CUT TO BLACK', [{ s: 'smash' }]),
    ],
  },
  {
    id: 's14',
    n: 14,
    title: 'הדרך הביתה',
    location: 'האוטו — שקיעה',
    ambience: [{ track: 'engine', vol: 0.3 }],
    music: [{ track: 'ending', vol: 0.4, from: 's14_n1' }],
    timer: { start: 40, end: 62 },
    items: [
      B('s14_car', 1.6, 'Sunset drive. Everyone exhausted.'),
      L('s14_l1', 'marom', 'תגידו… מתי נוסעים שוב?', "tag'idu... mat'ay nos'im sh'uv?"),
      L('s14_l2', 'nir', 'בחיים לא.', "ba-xay'im l'o.", { mood: 'sarcastic' }),
      L('s14_l3', 'roee', 'אני מכיר כמה בנות שיבואו איתנו.', "an'i mak'ir k'ama ban'ot she-yav'ou it'anu."),
      L('s14_l4', 'both', 'לאאאאא!', "l'ooooo!", { mood: 'scream' }),
      B('s14_freeze', 0.5, 'Freeze frame', [{ s: 'scratch' }]),
      L('s14_n1', 'narr', 'שלושה חברים. ארבעה ימים. עשרים בחורות שברחו. אינסוף חירבונים. ואפס נייר טואלט.', "shlosh'a xaver'im. arba'a yam'im. esr'im baxur'ot she-barx'u. eyns'of xirbun'im. ve-'efes ney'ar tual'et.", { post: 0.3 }),
      B('s14_end', 3.8, 'End title + subtitle', [{ s: 'sting', vol: 0.6 }]),
    ],
  },
  {
    id: 's15',
    n: 15,
    title: 'הקללה ממשיכה',
    location: 'פוסט־קרדיטס',
    timer: { start: 0, end: 0 },
    items: [
      B('s15_black', 1.0, 'Black screen'),
      B('s15_msg', 2.6, 'WhatsApp group "אילת 2026": message from Roee', [{ s: 'ding' }]),
      B('s15_silence', 3.0, 'Three seconds of silence'),
      B('s15_gong', 2.4, 'DONG! THE END.', [{ s: 'gong' }]),
    ],
  },
];

/** Counter states. Each entry applies from the start of the given item onward. */
export const COUNTER_EVENTS: { at: string; girls?: number; bath?: number }[] = [
  { at: 's03_alarm', bath: 1 },
  { at: 's05_silence', girls: 4 },
  { at: 's06_alarm', bath: 2 },
  { at: 's06_slam', girls: 8 },
  { at: 's07_smash', girls: 13 },
  { at: 's08_l2', bath: 3 },
  { at: 's10_l3', girls: 19 },
  { at: 's12_run', girls: 20 },
  { at: 's13_screams', bath: 6 },
];

export const WHATSAPP = {
  group: 'אילת 2026',
  from: 'רואי',
  text: 'אחים, מי לקח את הנייר מהאוטו?',
};
