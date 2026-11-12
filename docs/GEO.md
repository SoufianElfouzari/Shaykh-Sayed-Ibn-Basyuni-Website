# GEO-Audit und redaktionelle Folgeaufgaben

Stand: 12. November 2026.

## Im Code behoben
- Startseite überträgt veröffentlichte Unterrichtsaufnahmen und den Unterrichtsplan bereits im SSR-HTML, statt sie nur nach JavaScript-Ausführung einzublenden.
- Vollständige vorhandene Unterrichtsbeschreibungen stehen im HTML. Die visuelle Kurzfassung wird über CSS-Limitierung dargestellt.
- Jede Aufnahme erhält einen stabilen Anker auf `/durous`, inklusive Direktlink und maschinenlesbarer Referenz.
- JSON-LD unterscheidet den Lehrer von der Redaktion als veröffentlichender Einheit. Autorennamen für Artikel werden weiterhin ausschließlich aus dem vorhandenen Datenbankfeld gelesen.
- Strukturierte Daten verknüpfen veröffentlichte Unterrichtsaufnahmen, Artikel, Themengebiete und die zugehörigen Seiten.
- `/llms.txt` dient als optionaler, öffentlich lesbarer Navigationshinweis. Die Datei ist kein Standard mit garantierter Verarbeitung durch KI-Suchsysteme.

## Redaktionell noch notwendig
1. **Transkripte:** Für jeden Audio-Unterricht redigierte, korrekturgelesene Transkripte auf dauerhaften öffentlichen Seiten veröffentlichen. Audio-Beschreibungen sind kein Ersatz für Originaltranskripte.
2. **Quellen:** Bei Artikeln konkrete Quran- und Hadith-Belege und Angaben zu verwendeten Büchern mit eindeutigen Quellen ergänzen. Keine Quellen automatisiert erfinden.
3. **Autoren:** Für jeden Artikel das tatsächlich zutreffende Feld `author` in Supabase prüfen. Nur persönlich verfasste Texte dem Shaykh direkt zuschreiben.
4. **Frageorientierte Inhalte:** Fachliche Fragen in eigenständigen, überprüften Artikeln mit präzisen Definitionen, Zusammenfassungen und nachvollziehbaren Quellen beantworten.
5. **Externe Bestätigung:** Verlässliche Erwähnungen und Fachverweise von unabhängigen relevanten Quellen aufbauen. KI-Nennungen oder Empfehlungen lassen sich durch Markup nicht garantieren.
6. **Nach Deployment:** HTML ohne JavaScript auf `/` und `/durous` prüfen, strukturierte Daten validieren und die Indexierung neuer Inhalte kontrollieren.

## Wichtige Grenzen
GEO hat keinen einheitlichen offiziellen Score. JSON-LD, robots.txt und llms.txt garantieren weder die Aufnahme in Trainingsdaten noch Zitate in ChatGPT, Gemini oder anderen KI-Antworten.
