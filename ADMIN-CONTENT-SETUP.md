# Full portfolio content admin

This version upgrades the private content manager so the portfolio can be maintained from the browser instead of editing source code for normal content updates.

## Admin URLs

- Admin home: `https://vthish.dev/admin`
- Analytics: `https://vthish.dev/admin/analytics`
- Full portfolio content manager: `https://vthish.dev/admin/content`

The content manager uses the existing Netlify environment variable:

```text
ANALYTICS_ADMIN_PASSWORD
```

No new password or environment variable is required.

## What can be managed

From `/admin/content` you can edit:

- name, location, email, phone and WhatsApp details
- the WhatsApp pre-filled message
- CV URL
- social links
- hero text, rotating roles, tech marquee and hero image
- About section text and image
- Skills groups, skill tags and services
- Projects: add, edit, delete, reorder, tech stack, links and screenshot images
- Education: add, edit, delete and reorder
- Experience: add, edit, delete, reorder and attach an optional image
- Certificates: add, edit, delete, reorder, attach the certificate image and credential link
- photo-break content and image
- Contact section content and image

Press **Save portfolio changes** to publish the updated content to the portfolio.

## Project screenshots

Every project has an optional **Real project screenshot** field.

- If the field is empty, the portfolio keeps the original developer-console visual.
- If you upload or paste an image URL, that project card switches to the real screenshot.
- Project screenshots use a responsive crop (`object-fit: cover`) so the card stays aligned on desktop and mobile.

The admin uploader accepts JPG, PNG and WebP up to 4 MB.

## Certificates

The default certificate list is empty, so **no certificate section is shown on the public portfolio right now**.

When you add the first certificate and save:

- a Certificates navigation item appears automatically
- a matching certificate section appears automatically
- the certificate can include title, issuer, date, description, credential URL and image

Certificate images are fitted inside the card so the credential remains readable rather than being stretched.

If all certificate items are deleted later, the public Certificates section disappears again.

## Experience

The default experience list is also empty, so **no Experience section is shown right now**.

When you add an experience entry and save, the Experience navigation item and section appear automatically. Each entry can include role, company, period, location, description, highlights and an optional image.

If all experience entries are deleted, the section is hidden again.

## Image storage

Images uploaded from the admin are stored separately in Netlify Blobs under the `portfolio-media-v1` store and are served through the public `portfolio-media` function.

Editable content is stored in `portfolio-content-v2`.

The previous `portfolio-content-v1` store is automatically read as a fallback so existing CV/project edits from the older admin version are preserved. After the first save in the new admin, the complete content is stored in v2.

## CV

The CV can still use either a public Google Drive preview URL:

```text
https://drive.google.com/file/d/FILE_ID/view
```

or a PDF hosted by the portfolio itself:

```text
/cv/venusha-thishan-cv.pdf
```

## Important

The existing loader, scroll animations, project-card fallback visual, analytics tracking and monthly analytics email are not replaced by this content manager. The new Experience and Certificates UI is conditional and does not change the current public page until you add entries.


## Project screenshot galleries
Each project can now store up to 8 JPG, PNG, or WebP screenshots (4 MB max per image). The first image is the cover image. Use the arrow buttons in the admin panel to reorder screenshots. If a project has no screenshots, the original developer-console project visual remains as the fallback. On the public portfolio, projects with multiple screenshots rotate through them automatically with a subtle indicator.
