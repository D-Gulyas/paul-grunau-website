/* Zentrale Inhalte – aus Webseiteninhalt_Paul_Grunau.md übernommen */

export type Service = {
  id: string;
  title: string;
  tag: string;
  description: string;
  features: string[];
  image: string;
};

export const services: Service[] = [
  {
    id: "elektrotechnik",
    title: "Elektrotechnik",
    tag: "Installation & Wartung",
    description:
      "Wir planen, installieren und warten elektrische Anlagen für private, gewerbliche und industrielle Kunden. Wir arbeiten nach neuesten Standards und sorgen für maximale Sicherheit und Effizienz Ihrer Anlagen.",
    features: [
      "Neuinstallationen und Sanierungen",
      "Smart Home und Gebäudeautomation",
      "Beleuchtungstechnik und Energieeffizienz",
      "E-Ladesäulen für Elektromobilität",
      "Wartung und Prüfung nach VDE",
    ],
    image: "/images/leistung-elektrotechnik.webp",
  },
  {
    id: "knx-smarthome",
    title: "KNX & Smarthome",
    tag: "Gebäudeautomation",
    description:
      "Steuern Sie Ihr Zuhause oder Ihr Büro intelligent und energieeffizient. Mit KNX und weiteren Smarthome-Technologien erhöhen Sie Komfort, Sicherheit und Energieeffizienz mit einer individuell auf Sie abgestimmten Lösung.",
    features: [
      "Licht- und Jalousiesteuerung",
      "Heizungs- und Klimatisierungskontrolle",
      "Integration von Sicherheitslösungen",
      "Visualisierung und Bedienung per App",
      "Planung und Installation von KNX-Anlagen",
    ],
    image: "/images/leistung-knx-smarthome.webp",
  },
  {
    id: "photovoltaik",
    title: "Photovoltaik",
    tag: "Nachhaltige Energie",
    description:
      "Nutzen Sie die Kraft der Sonne und werden Sie unabhängiger von steigenden Strompreisen. Wir sind Ihr Partner für die Installation von Photovoltaikanlagen – investieren Sie in eine nachhaltige Zukunft mit Ihrer eigenen sauberen Energiequelle.",
    features: [
      "Individuelle Planung und Beratung",
      "Montage von Solarmodulen und Wechselrichtern",
      "Netzanbindung und Anlagenerweiterung",
      "Stromspeichersysteme",
      "Wartung und Optimierung",
    ],
    image: "/images/leistung-photovoltaik.webp",
  },
];

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  image: string;
  body: BlogBlock[];
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; label: string; text: string }
  | { type: "table"; head: string[]; rows: string[][]; note?: string };

export const blogPosts: BlogPost[] = [
  {
    slug: "brandschutz-leitfaden",
    category: "Brandschutz",
    title: "Brandschutz: Ein umfassender Leitfaden",
    excerpt:
      "Brandschutz ist mehr als nur eine Prüfung. Dieser Leitfaden beleuchtet die wichtigsten Aspekte, von der Vorbeugung bis hin zu aktiven und passiven Schutzmaßnahmen.",
    readingTime: "6 Min.",
    image: "/images/blog-brandschutz.webp",
    body: [
      {
        type: "p",
        text: "Brandschutz ist eine der wichtigsten Sicherheitsvorkehrungen in Gebäuden. Er schützt Leben, Sachwerte und die Umwelt. In diesem umfassenden Leitfaden erfahren Sie alles Wichtige über die verschiedenen Facetten des Brandschutzes, von der Vorbeugung bis hin zu den gesetzlichen Anforderungen.",
      },
      { type: "h", text: "Was bedeutet Brandschutz?" },
      {
        type: "p",
        text: "Brandschutz umfasst alle Maßnahmen, die der Entstehung, Ausbreitung und den Auswirkungen von Bränden vorbeugen. Er gliedert sich in zwei Hauptbereiche: aktiven und passiven Brandschutz.",
      },
      { type: "h", text: "Aktiver Brandschutz" },
      {
        type: "p",
        text: "Der aktive Brandschutz zielt darauf ab, einen Brand schnellstmöglich zu erkennen und zu bekämpfen. Dazu gehören:",
      },
      {
        type: "list",
        items: [
          "Rauchmelder und Brandmeldeanlagen: Erkennen Rauch und Hitze frühzeitig und alarmieren die Bewohner.",
          "Feuerlöscher: Ermöglichen eine schnelle Brandbekämpfung in der Entstehungsphase.",
          "Sprinkleranlagen: Löschen Brände automatisch, indem sie Wasser oder andere Löschmittel freisetzen.",
          "Wandhydranten: Bieten eine Löschwasserquelle zur Brandbekämpfung durch geschultes Personal.",
        ],
      },
      { type: "h", text: "Passiver Brandschutz" },
      {
        type: "p",
        text: "Der passive Brandschutz verhindert oder verzögert die Ausbreitung eines Brandes. Er ist direkt in die Bausubstanz integriert:",
      },
      {
        type: "list",
        items: [
          "Brandwände und -türen: Schotten Brandabschnitte voneinander ab.",
          "Baustoffe: Auswahl von schwerentflammbaren oder nicht brennbaren Materialien.",
          "Rauch- und Wärmeabzugsanlagen (RWA): Führen Rauch und Hitze im Brandfall aus dem Gebäude.",
          "Flucht- und Rettungswege: Dienen der sicheren Evakuierung von Personen.",
        ],
      },
      {
        type: "quote",
        label: "Experten-Tipp",
        text: "Ein effektives Brandschutzkonzept kombiniert aktiven und passiven Brandschutz. Regelmäßige Wartung der Systeme ist unerlässlich. Lassen Sie sich von einem zertifizierten Fachbetrieb beraten, um sicherzustellen, dass Ihr Gebäude optimal geschützt ist.",
      },
    ],
  },
  {
    slug: "smart-home-nachruesten",
    category: "Elektrotechnik",
    title: "Smart Home nachrüsten: Das müssen Sie beachten",
    excerpt:
      "Moderne Smart Home Systeme bieten Komfort und Sicherheit. Wir erklären, welche Möglichkeiten es gibt und worauf bei der Nachrüstung zu achten ist.",
    readingTime: "5 Min.",
    image: "/images/blog-smart-home.webp",
    body: [
      {
        type: "p",
        text: "Moderne Smart Home Systeme bieten Komfort und Sicherheit. Wir erklären, welche Möglichkeiten es gibt und worauf bei der Nachrüstung zu achten ist.",
      },
      { type: "h", text: "Vorteile eines Smart Homes" },
      {
        type: "p",
        text: "Ein Smart Home bietet zahlreiche Vorteile, von Energiesparpotenzialen bis hin zu erhöhter Sicherheit.",
      },
      {
        type: "list",
        items: [
          "Energieeinsparung: Durch intelligente Steuerung von Heizung und Beleuchtung.",
          "Erhöhte Sicherheit: Vernetzte Alarmanlagen und Überwachungssysteme.",
          "Mehr Komfort: Automatisierte Abläufe und Fernsteuerung.",
          "Fernsteuerung: Kontrolle von unterwegs via Smartphone.",
        ],
      },
      { type: "h", text: "Was kann nachgerüstet werden?" },
      {
        type: "list",
        items: [
          "Intelligente Beleuchtung: Smarte LEDs und Steuerungen, die sich dimmen und farblich anpassen lassen.",
          "Heizungssteuerung: Thermostate, die lernen, wann Sie zu Hause sind und sich entsprechend anpassen.",
          "Sicherheitstechnik: Smarte Rauchmelder, Überwachungskameras und Alarmsysteme.",
        ],
      },
      {
        type: "quote",
        label: "Installationstipp",
        text: "Bei der Nachrüstung ist die Kompatibilität der Systeme entscheidend. Wir beraten Sie gerne zu den besten Lösungen für Ihr Zuhause und übernehmen die professionelle Installation.",
      },
    ],
  },
  {
    slug: "stromsparen-tipps",
    category: "Praxistipps",
    title: "5 einfache Tipps zum Stromsparen im Haushalt",
    excerpt:
      "Mit kleinen Veränderungen können Sie Ihre Stromrechnung deutlich reduzieren. Praktische Tipps, die sofort umsetzbar sind und wirklich Wirkung zeigen.",
    readingTime: "4 Min.",
    image: "/images/blog-praxistipps.webp",
    body: [
      { type: "h", text: "Energieeffizienz beginnt im Kleinen" },
      {
        type: "p",
        text: "Oft sind es die kleinen Gewohnheiten, die in der Summe einen großen Unterschied machen.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "LED-Beleuchtung nutzen – Moderne LEDs verbrauchen bis zu 90% weniger Energie als herkömmliche Glühbirnen und haben eine deutlich längere Lebensdauer.",
          "Stromfresser identifizieren – Alte Kühlschränke, Gefriertruhen und Boiler sind oft die größten Energiefresser. Ein Neugerät kann sich bereits nach wenigen Jahren amortisieren.",
          "Standby-Modus vermeiden – Einfachste Methode: Steckerleisten mit Schalter verwenden und nachts komplett abschalten.",
          "Heizungspumpe optimieren – Alte Heizungspumpen verbrauchen oft mehr Strom als Kühlschrank, Waschmaschine und Beleuchtung zusammen. Ein Austausch lohnt sich!",
          "Wasserkocher statt Herdplatte – Zum Erhitzen von Wasser ist der Wasserkocher deutlich effizienter als der Elektroherd.",
        ],
      },
      {
        type: "quote",
        label: "Einsparpotential",
        text: "Durch konsequente Umsetzung dieser Tipps können Sie bis zu 25% Ihrer Stromkosten einsparen. Bei einem durchschnittlichen 4-Personen-Haushalt sind das etwa 300 € pro Jahr.",
      },
    ],
  },
  {
    slug: "photovoltaik-2025",
    category: "Elektrotechnik",
    title: "Photovoltaik: Lohnt sich eine Anlage auch 2025 noch?",
    excerpt:
      "Die Rahmenbedingungen für Photovoltaik haben sich weiterentwickelt. Wir analysieren, ob sich die Investition angesichts aktueller Förderungen und Strompreise noch lohnt.",
    readingTime: "6 Min.",
    image: "/images/blog-photovoltaik.webp",
    body: [
      { type: "h", text: "Aktuelle Rahmenbedingungen 2025" },
      {
        type: "p",
        text: "Die Einspeisevergütung wurde angepasst, aber die Strompreise sind auf hohem Niveau stabil – eine interessante Ausgangslage für Photovoltaik-Investitionen.",
      },
      {
        type: "table",
        head: ["Kennzahl", "Wert", "Hinweis"],
        rows: [
          ["Investitionskosten", "12.000 – 18.000 €", "inkl. Installation und Mehrwertsteuer"],
          ["Jährlicher Eigenverbrauch", "3.500 – 4.500 kWh", "Ersparnis ca. 1.400 €/Jahr*"],
          ["Einspeisevergütung", "9,8 Cent/kWh", "für 20 Jahre garantiert"],
          ["Amortisationszeit", "7 – 10 Jahre", "abhängig vom Eigenverbrauch"],
        ],
        note: "*bei einem Strompreis von 40 Cent/kWh",
      },
      { type: "h", text: "Förderungen und Steuervorteile 2025" },
      {
        type: "list",
        items: [
          "Bundesförderung: Bis zu 30% Zuschuss für PV-Anlagen mit Speicher.",
          "Mehrwertsteuer: Bei Anlagen unter 30 kWp Erstattung der Mehrwertsteuer.",
          "Einkommenssteuer: Vereinfachte Regelungen für private Anlagen.",
          "Regionalförderung: Zusätzliche Förderprogramme in NRW.",
        ],
      },
      {
        type: "quote",
        label: "Unsere Einschätzung für 2025",
        text: "Photovoltaik lohnt sich 2025 mehr denn je. Durch gestiegene Strompreise und verbesserte Förderbedingungen amortisieren sich die Anlagen schneller. Die Kombination mit modernen Stromspeichern ermöglicht heute bis zu 80% Eigenverbrauch. Jetzt ist der ideale Zeitpunkt für die Investition in saubere Energie.",
      },
    ],
  },
  {
    slug: "fi-schutzschalter",
    category: "Sicherheit",
    title: "FI-Schutzschalter: Die unterschätzten Lebensretter",
    excerpt:
      "Der FI-Schutzschalter ist eine der wichtigsten Sicherheitseinrichtungen in modernen Elektroinstallationen. Wir erklären, wie er funktioniert und warum er regelmäßig geprüft werden muss.",
    readingTime: "5 Min.",
    image: "/images/blog-sicherheit.webp",
    body: [
      { type: "h", text: "Was ist ein FI-Schutzschalter?" },
      {
        type: "p",
        text: "Ein FI-Schutzschalter (Fehlerstrom-Schutzschalter) schützt Personen vor lebensgefährlichen Stromschlägen, indem er bei gefährlichen Fehlerströmen sofort den Stromkreis unterbricht.",
      },
      { type: "h", text: "Wie funktioniert ein FI-Schutzschalter?" },
      {
        type: "p",
        text: "Der FI-Schutzschalter vergleicht den hinfließenden mit dem zurückfließenden Strom. Bei einer Differenz von bereits 0,03 Ampere (30 mA) unterbricht er innerhalb von Millisekunden den Stromkreis und verhindert so einen lebensgefährlichen Stromschlag.",
      },
      {
        type: "quote",
        label: "Warnhinweis",
        text: "FI-Schutzschalter sollten alle 6 Monate durch Betätigen der Testtaste geprüft werden. Bei älteren Modellen empfiehlt sich ein Austausch nach 10-15 Jahren, da die Technik verschleißt.",
      },
      { type: "h", text: "Typische Anwendungsbereiche" },
      {
        type: "list",
        items: [
          "Feuchträume (Badezimmer, Küchen)",
          "Steckdosen im Außenbereich",
          "Kinderzimmer und Spielbereiche",
          "Werkstätten und Hobbykeller",
          "Garagen und Carports",
        ],
      },
      {
        type: "quote",
        label: "Sicherheit geht vor",
        text: "Ein intakter FI-Schutzschalter kann Leben retten. Lassen Sie Ihre Elektroanlage regelmäßig von Fachpersonal überprüfen. Wir führen den Einbau und die Überprüfung von FI-Schutzschaltern nach aktuellen Sicherheitsstandards durch.",
      },
    ],
  },
];

export const team = [
  {
    name: "Paul Grunau",
    role: "Geschäftsführer & Elektromeister",
    bio: "Gründer des Meisterbetriebs. Ihr persönlicher Ansprechpartner für Brandschutz, Elektrotechnik und alle Projektfragen.",
  },
  {
    name: "Team Elektrotechnik",
    role: "Meister & Fachkräfte",
    bio: "Qualifizierte Elektroniker und Techniker, die Ihre Installationen präzise und nach neuesten Standards umsetzen.",
  },
  {
    name: "Team Brandschutz",
    role: "Zertifizierte Fachkräfte",
    bio: "Spezialisten für aktive und passive Brandschutzkonzepte – von der Planung bis zur regelmäßigen Wartung.",
  },
];

export const stats = [
  { value: "15+", label: "Jahre Erfahrung" },
  { value: "100%", label: "Meisterqualität" },
  { value: "VDE", label: "Geprüfte Standards" },
  { value: "24/7", label: "Notfall-Erreichbarkeit" },
];
