# Private Analytics Setup

The code is already wired for private portfolio analytics and a monthly email report. Complete these one-time production settings after pushing the project.

## 1. Add Netlify environment variables

Open **Netlify → Project configuration → Environment variables** and add:

```text
ANALYTICS_ADMIN_PASSWORD=<choose-a-long-private-password>
RESEND_API_KEY=<your-resend-api-key>
ANALYTICS_EMAIL_TO=devthish17@gmail.com
ANALYTICS_EMAIL_FROM=Portfolio Analytics <analytics@vthish.dev>
```

Do not commit real secret values to Git.

## 2. Configure Resend

1. Create/sign in to a Resend account.
2. Add `vthish.dev` as a sending domain.
3. Add the DNS records Resend provides and wait until the domain is verified.
4. Create an API key and copy it into Netlify as `RESEND_API_KEY`.

## 3. Deploy

Push the project to the branch connected to Netlify. Netlify will install the added packages and deploy the functions.

## 4. Open the private dashboard

Visit:

```text
https://vthish.dev/admin/analytics
```

Enter the value you set for `ANALYTICS_ADMIN_PASSWORD`.

## 5. Monthly report

The scheduled function runs at `00:05 UTC` on the first day of every month and sends the previous month's report to:

```text
devthish17@gmail.com
```

To test without waiting for next month, open **Netlify → Functions → analytics-monthly-email → Run now** after deployment.

## Notes

- The public portfolio has no visible view counter.
- IP addresses are not stored.
- Unique visitors are estimated using a hashed browser ID, so the same person on multiple browsers/devices may count more than once.
- Detectable bots are ignored.
- The analytics tracker skips `/admin` pages so your dashboard visits do not inflate the public view count.

## 6. Portfolio content manager

The same `ANALYTICS_ADMIN_PASSWORD` also unlocks:

```text
https://vthish.dev/admin/content
```

After a successful login, the browser receives a secure admin session with a 2-hour hard expiry and 15-minute inactivity auto-lock, so you can move between Analytics and Content Manager without entering the password again. Use **Lock** to end the session immediately; otherwise it auto-locks after 15 minutes of inactivity and has a 2-hour maximum lifetime.

The content manager stores the CV link and editable project list in Netlify Blobs. No additional environment variable is needed.

## Extended analytics

The private dashboard now includes selectable periods:

- Today
- Last 7 days
- Last 30 days
- This month
- This year
- All time

It also records privacy-friendly interaction events for portfolio actions such as:

- CV clicks
- WhatsApp clicks
- Email form opens
- Successfully sent contact emails
- Call clicks
- Project repository clicks
- Project live-demo clicks
- Certificate clicks
- Social-link clicks

The dashboard includes top referrers and interaction breakdowns/targets/pages. These events use the same hashed browser identifier model as the existing view analytics and do not store a raw IP address as the analytics visitor identity.

The monthly analytics email now includes previous-month interaction counts and referrer information in addition to the original page-view summary.
