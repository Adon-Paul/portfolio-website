# Résumé refresh

The supplied résumé is not copied into public assets. `resume-draft.html` and the matching PDF are a factual revision for the owner to review, using the new domain and inspected project documentation. No street address, postcode or phone number is carried across.

Removed unverified commerce authentication/production claims, Spotify/high-res claims, download counts and publication/award implications. Added LumiSense with the owner's clarified implementation role. Kept Style Transfer AI co-development from the supplied résumé. Education does not assert graduation or an unconfirmed current enrolment status.

Before making this the website's public résumé download, confirm graduation/degree wording and whether community roles ended in 2026; review the concise descriptions. The original remains untouched in Downloads. Do not silently publish the original or add unsupported metrics.

PDF generation: use Playwright Chromium `page.setContent()` with this HTML and `page.pdf({ path: ..., printBackground: true, preferCSSPageSize: true })`. No external fonts or network calls are needed.
