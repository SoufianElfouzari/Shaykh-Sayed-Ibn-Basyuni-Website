# Appwrite zu Supabase: Migrations-Branch

Dieser Branch ist **nicht** für einen Produktions-Deploy freigegeben, solange die Datensätze aus Appwrite und die Filebase Edge Function nicht migriert und getestet sind.

## Zieltabellen
- `articles` (einschließlich HTML-Inhalt und Slug)
- `duruus` (einschließlich Filebase Object Key)
- `notices`
- `contact_requests` (nur serverseitig beschreibbar)

Die Tabellen wurden im Supabase-Projekt `hwksfmccecfsxbxjlizm` mit RLS vorbereitet. Vor dem produktiven Einsatz **Projektzuordnung bestätigen**.

## Nächste Schritte
1. Pausiertes Appwrite-Projekt reaktivieren und alle Datensätze exportieren.
2. Admin-Konten in Supabase Auth anlegen und explizit in `app_private.admin_users` berechtigen.
3. Filebase-Manager als sichere Supabase Edge Function deployen, mit auf serverseitige Geheimnisse begrenztem Zugriff.
4. React-Website, Flutter-Admin-App und Flask-Kontakt-Backend umstellen.
5. Testen: veröffentlichte Artikel, Entwürfe, Duruus, Audio, Hinweise, Login, CRUD, Kontaktformular.
6. Erst nach Datenvergleich und erfolgreichen Tests Produktivversion umstellen.

## Frontend-Variablen
```
VITE_SUPABASE_URL=https://hwksfmccecfsxbxjlizm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>
```
Geheimnisse und Service-Role-Keys niemals in `VITE_` Variablen speichern.

## Sicherheit
Öffentliche Besucher dürfen ausschließlich veröffentlichte Artikel, Duruus und Hinweise lesen. Nur explizit autorisierte Admin-Nutzer dürfen diese bearbeiten. Kontaktanfragen bleiben privat.
