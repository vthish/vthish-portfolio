# Portfolio content admin

This version adds a private content manager that uses the same password as the analytics dashboard.

## URLs

- Admin home: `https://vthish.dev/admin`
- Analytics: `https://vthish.dev/admin/analytics`
- Portfolio content: `https://vthish.dev/admin/content`

## Password

No new password is required. The content manager uses the existing Netlify environment variable:

```text
ANALYTICS_ADMIN_PASSWORD
```

A successful admin login creates a secure, HttpOnly, SameSite=Strict session cookie for 12 hours. That same session unlocks both Analytics and Portfolio Content. Press **Lock** to end the session.

## What can be changed without editing code

From `/admin/content` you can:

- change the CV URL
- add a project
- edit project title, category, description and repository/project URL
- edit highlight chips and tech stack
- choose the project card icon
- reorder projects
- delete projects

Press **Save portfolio changes** to write the content to Netlify Blobs. The public portfolio reads the latest saved values when the page loads.

## CV links

You can use either a public Google Drive preview URL such as:

```text
https://drive.google.com/file/d/FILE_ID/view
```

or a file hosted by the portfolio itself, for example:

```text
/cv/venusha-thishan-cv.pdf
```

If you use the second option, place the PDF at `public/cv/venusha-thishan-cv.pdf` before deploying.

## Storage

Editable portfolio content is stored separately from analytics in a Netlify Blobs store named `portfolio-content-v1`. Deploying new code does not normally erase the saved content.

If no saved content exists yet, the site falls back to the projects and CV link included in the source code.
