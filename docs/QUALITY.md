# Technische Qualitätssicherung

Der GitHub-Workflow prüft Pull Requests und main. Er führt keine Vercel-Deployments aus.

## Testbefehle

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run test:unit`
5. `npm run test:integration`
6. `npm run test:ssr:fixture`
7. `npm run test:budget`
8. `npm run test:setup`
9. `npx playwright install chromium firefox webkit`
10. `npm run test:e2e`
11. `npm run test:lighthouse`
12. `npm audit --omit=dev --audit-level=high`

Alle SSR- und Browserprüfungen verwenden lokale, feste Supabase-Testdaten.
Dabei werden keine produktiven Inhalte geändert und keine Kontaktanfragen versendet.

## Aktuelle Grenzen

- Kein ESLint-, Build- oder SSR-Testfehler.
- Unit- und Integrationstests mit veröffentlichten und unveröffentlichten Datensätzen.
- Browser: Chromium, Firefox, WebKit, mobiles Chrome.
- Axe: keine kritischen oder schwerwiegenden Befunde auf den geprüften Seiten.
- JS vor Gzip höchstens 750 KB, CSS höchstens 230 KB.
- Lighthouse-Mindestwert 0,50 für Performance, 0,85 für SEO.
  LCP und CLS werden separat gemeldet, derzeit als Warnung.
- Sicherheitsprüfung: keine High-/Critical-Laufzeitabhängigkeiten.

Beim ersten isolierten Lighthouse-Lauf lagen die Performance-Werte bei etwa
72 bis 73 für die Startseite und 53 für das Artikelarchiv. CLS wurde mit 1
gemeldet. Das ist kein gemessener Live-PageSpeed-Wert. Diese Probleme sind
noch zu untersuchen.

## Freigabe von Änderungen

Nach dem ersten erfolgreichen GitHub-Lauf unter Repository > Settings > Rules >
Rulesets für main die Checks `Code / SSR / Security`,
`Browser / Accessibility` und `Lighthouse / Performance` verpflichtend setzen.
Die Ruleset-Einstellung muss separat in GitHub aktiviert werden.

Tests mit simulierten Antworten beweisen **nicht**, dass die produktiven
Supabase-RLS-Richtlinien korrekt sind. Diese müssen zusätzlich in einem
freigegebenen Staging-/Testprojekt geprüft werden. Auch Tastatur, Screenreader
und das echte Kontaktformular benötigen manuelle Prüfungen.

GitHub-Commits sind kein Produktionsrelease. Vercel bewusst separat deployen.
