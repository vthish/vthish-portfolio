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
