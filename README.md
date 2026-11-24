# King of Britain · website

Static one-page site for **King of Britain 2027**, round 1 of the Ultra4 Europe season.
Plain HTML, CSS and JS. No build step. It runs on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Files
| Path | What it is |
|---|---|
| `index.html` | All page content (sections: hero, story, 2027 season, classes, schedule, entry & regulations, gallery, team, sponsors, FAQ, contact) |
| `css/style.css` | Design: colours at the top in `:root` |
| `js/config.js` | **Edit this:** race date for the countdown, contact email or form endpoint, Supabase gallery settings, local photo list |
| `js/main.js` | Menu, countdown, scroll animations, gallery and lightbox, contact form |
| `assets/` | Logo, race photos and team photos used by the site |

## Run locally
```
python -m http.server 5174
```
Then open http://localhost:5174

## Gallery on Supabase
1. In Supabase create a **public** Storage bucket, e.g. `gallery`, and upload photos (optionally into a folder such as `kob-2026`).
2. In `js/config.js` fill `supabase.url`, `supabase.anonKey`, `supabase.bucket` and `supabase.folder`.
3. The gallery then lists every image in that folder automatically. If Supabase fails or is empty, the local photos are shown.

## Contact form
By default the form opens the visitor's email app with the message filled in, addressed to `contactEmail`.
To receive messages directly, set `formEndpoint` in `js/config.js` to a URL that accepts a JSON POST
(a Supabase Edge Function, Formspree, etc.). Fields sent: `name, email, phone, topic, vehicle, message`.

## To fill in later
- **Venue**: Ultra4 Europe lists it as "England, venue TBC" (their page metadata mentions Parkwood Off Road Centre, Bradford, but the page body says TBC). Update the Season, Schedule and FAQ sections once confirmed.
- **Detailed timetable**: replace the 3-day outline in `#schedule`.
- **Registration**: replace the "Entry form · coming soon" button in `#entry` with the live form link.
- **Regulations PDFs**: in `#entry` turn each "Coming soon" document into a link (`<a href="docs/....pdf">`).
- **Team roles**: David Robson and Andy Clark are shown as "Organising team". Add their exact roles.
- **Sponsor logos**: the sponsor names are text. Swap in logo images when available.
- **Class rules**: class cards are short summaries. Link the official 2027 technical regulations when published.
