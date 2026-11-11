# Résumé source and review

The supplied résumé was reviewed against project documentation and owner clarifications. Its replacement is public at `/documents/adon-paul-tomy-resume.pdf` and linked in the contact section. The editable source remains `resume-draft.html` (historical filename); the PDF copy here matches the public version.

The replacement uses the current domain, excludes phone/address details, removes unsupported commerce authentication/production claims, Spotify/high-res claims, download counts and publication/award implications. LumiSense implementation credit is owner-confirmed; Style Transfer AI co-development comes from the supplied résumé.

Education is phrased as Computer Science & Engineering at VISAT without asserting graduation. The µLearn role is historical community experience without unconfirmed end dates. Update these only when the owner supplies more precise information. No uncertain fact is needed for the current public version.

Regenerate with Playwright Chromium `page.setContent()` from the HTML and `page.pdf({ path: ..., printBackground: true, preferCSSPageSize: true })`. Verify one A4 page and keep the public/documentation copies equal.
