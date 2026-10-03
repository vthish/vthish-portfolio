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

Every project has an optional **Project screenshots** gallery.

- If the field is empty, the portfolio keeps the original developer-console visual.
- If you upload screenshots, that project card switches to the real project media gallery.
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
Each project can now store up to 12 JPG, PNG, or WebP screenshots (4 MB max per image). The first image is the cover image. Use the arrow buttons in the admin panel to reorder screenshots. If a project has no screenshots, the original developer-console project visual remains as the fallback. On the public portfolio, projects with multiple screenshots rotate through them automatically with a subtle indicator.


## Project demo videos

Each project can optionally have one demo video in addition to up to 12 screenshots. In the admin content manager, use **Project demo video** to upload a short MP4/WebM file (maximum 4 MB) or paste a supported provider/direct video link. If a video is present, it appears first in the public project media rotation; screenshots follow it. If no video or screenshots exist, the original developer-console project visual remains unchanged.

## Universal project video links

Each project still supports one optional demo video, but the **Project demo video** field now understands more than uploaded files/direct video URLs.

Supported inline providers include:

- YouTube and YouTube Shorts
- Vimeo
- Loom
- Google Drive video preview links
- Dailymotion
- Streamable
- TikTok
- Instagram public post/reel links
- Facebook public video links
- direct MP4/WebM/OGG/M4V URLs
- MP4/WebM files uploaded through the admin (4 MB maximum)

For another valid HTTP/HTTPS video provider that cannot be embedded safely, the project card automatically falls back to a **Watch project demo** link that opens the original video in a new tab instead of showing a broken player.

## Multiple photos across the portfolio

Multiple-image upload is no longer limited to projects. The admin can now keep several JPG, PNG or WebP images (4 MB maximum each) for:

- hero portraits
- About photos
- project screenshots (up to 12)
- Experience/work photos
- Certificate images
- photo-break images
- Contact photos

The first image is shown first. Use the left/right arrow buttons in the admin to reorder them. When there is more than one image, the public portfolio rotates them smoothly inside the existing visual frame, so the original layout does not change. Existing single-image content is automatically preserved as the first image.

## Website email form

The public **Email me** button now opens an on-site email form instead of forcing the visitor into their local mail app. Visitors can enter:

- their name
- their email address
- their own subject
- their own message

Messages are sent to the email currently saved in **Identity → Email** in `/admin/content`. The visitor's email is set as the Reply-To address, so replying from Gmail replies directly to that visitor.

This feature reuses the existing `RESEND_API_KEY` and verified Resend domain. No new environment variable is required. `CONTACT_EMAIL_FROM` is optional; if it is not configured, the function reuses the verified address inside `ANALYTICS_EMAIL_FROM` with the display name `vthish.dev Contact`.

The endpoint also includes a honeypot field, server-side validation and a privacy-friendly rate limit to reduce automated spam. The recipient address is fixed on the server from your portfolio content, so visitors cannot use the form as an open relay to arbitrary email addresses.


## Phone contact button

The Contact section includes a **Call me** button using the editable Identity → Phone number. On phones it opens the device dialer through a `tel:` link. The button label is editable under Contact → Phone button.

## Admin session security

Analytics and Content Manager share the same secure session. It now auto-locks after **15 minutes of inactivity** and has a **2-hour absolute server-side expiry**, even if Lock is not clicked.
