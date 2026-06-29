# Cool Web Today — Keynote

Eine selbsttragende, scroll-getriebene Keynote-Website (cineastischer Flow) für
Investor:innen, Mentor:innen und Förderstellen. Editorialer „Dossier"-Look,
gepinnter Hero mit wanderndem Glas-Panel, fließendes Scrollen statt harter
Folienwechsel.

## Struktur

```
CWT_Keynote/
├── index.html        Orchestriert alles: lädt css + js, enthält Hero + 15 Folien + Modal
├── css/
│   └── styles.css    Komplettes Designsystem (Tokens, Folien, Hero/Flow, Modal, Responsive)
├── js/
│   ├── app.js        Navigation + cineastische Scroll-Engine
│   └── contact.js    DSGVO-Kontaktformular (Web3Forms + mailto-Fallback)
├── assets/
│   └── logo.png      ← HIER das Logo ablegen (siehe „Vor dem ersten Start")
└── README.md         Diese Datei
```

## Wie die Dateien zusammenspielen

- **index.html** ist die einzige Seite. Im `<head>` wird `css/styles.css` geladen,
  am Ende des `<body>` `js/app.js` und danach `js/contact.js` (Reihenfolge wichtig:
  app vor contact).
- **app.js** erwartet feste IDs/Klassen aus index.html: `#deck`, `#progress`,
  `#dots`, alle `.slide`, und für den Hero `#hero #hGlass #hLead #hTriad #hMeta
  #hCue #heroBg`. Jede `.slide` braucht ein `data-label` — daraus baut app.js die
  Punkt-Navigation rechts.
- **styles.css** liefert die Klassen, die index.html verwendet
  (`.slide--ink/--ink2/--bone`, `.h-lg/.h-xl`, `.lead`, `.caps/.crow`, `.port/.prow`,
  `.princ/.pr`, `.eco/.ecoitem`, `.glass`, `.hero-*` …).
- **contact.js** ist über `#openContact` (Button auf der Kontaktfolie) und das
  `#contactModal` mit index.html verbunden.

## Vor dem ersten Start

1. **Logo ablegen:** eine `logo.png` (weiß/hell, transparenter Hintergrund wirkt im
   Glas-Panel am besten) in `assets/` legen. index.html referenziert sie als
   `assets/logo.png`. Alternativ kann das Logo als data-URI direkt in index.html
   eingebettet werden — dann ist die Seite eine einzige, portable Datei.
2. **Kontaktformular aktivieren:** in `js/contact.js` oben `ACCESS_KEY` durch einen
   kostenlosen Web3Forms-Key (web3forms.com, Zieladresse claudiu@dangulea.at)
   ersetzen. Solange der Platzhalter steht, öffnet das Formular das E-Mail-Programm
   (mailto) als Fallback — funktioniert also auch ohne Key.

## Lokal ansehen / deployen

- **Lokal:** wegen relativer Pfade am besten über einen kleinen Server, nicht per
  Doppelklick. Im Projektordner z. B. `python3 -m http.server` und
  `http://localhost:8000` öffnen.
- **GitHub Pages:** Ordnerinhalt ins Repo, Pages auf den Branch/Root stellen —
  fertig. Reine statische Seite, kein Build-Schritt.

## Bedienung

- Scrollen, Pfeiltasten / Leertaste / Bild-auf/ab, Pos1/Ende.
- `F` schaltet Vollbild.
- Punkte rechts springen direkt zu einer Folie (Desktop).

## Den Flow justieren (js/app.js, Funktion `frame()`)

Die Hero-Choreografie hängt am Scroll-Fortschritt `hp` (0…1). Stellschrauben:

- `sc = 1 + hp*0.34` — wie stark das Glas-Panel skaliert.
- `ty = -hp*64` — vertikaler Drift in px.
- `rot = -1.5 + hp*3.5` — Rotation in Grad.
- `norm(hp, 0.20, 0.44)` / `norm(hp, 0.48, 0.70)` — wann Tagline bzw. Triade
  einblenden.
- Parallaxe der Inhaltsfolien: der Faktor `*-24` (px) bei `.inner`.

Höhe des Hero-Scrollwegs: `.slide.hero { min-height: 220vh }` in styles.css
(mehr vh = langsamer, gemächlicher Ablauf).

## Technische Hinweise

- iOS-Safari-tauglich: Sticky + `requestAnimationFrame`, bewusst **keine**
  CSS-Scroll-Timeline.
- `prefers-reduced-motion`: Parallaxe und Hero-Transforms werden deaktiviert,
  alle Inhalte bleiben sichtbar.
- Engine rechnet nur während des Scrollens (akkuschonend).

## Inhaltliche Quelle

Die Folientexte in index.html wurden aus den Arbeitsnotizen des Keynote-Builds
zusammengeführt (inkl. der überarbeiteten, affirmativen Formulierungen, der neuen
Leitprinzipien-Folie und der bereinigten Ökosystem-/Kontaktangaben ohne
coolwebtoday.org, mit dangulea.at als Präsentations-Webseite). Für den exakten
Wortlaut bitte einmal gegen die zuletzt finalisierte Fassung gegenlesen.
