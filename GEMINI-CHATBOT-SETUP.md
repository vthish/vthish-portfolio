# Gemini portfolio chatbot setup

The chatbot now calls Gemini through a Netlify Function. The API key never goes to the browser.

## 1. Create a Gemini API/auth key

Create/manage the key in Google AI Studio and restrict it for Gemini API use according to Google's current guidance.

## 2. Add Netlify environment variables

In Netlify -> Project configuration -> Environment variables add:

```text
GEMINI_API_KEY=your_real_key
```

Optional model override:

```text
GEMINI_MODEL=gemini-3.8-flash
```

`GEMINI_API_KEY` should be a secret and available to Functions. Do not commit it to GitHub.

After adding/changing the variable, trigger a new production deploy.

## 3. How the assistant is restricted

`netlify/functions/chatbot-gemini.mts` loads the current portfolio content from the existing CMS/Netlify Blob store on every request and gives Gemini a compact public portfolio knowledge snapshot.

The system instruction tells the model to:

- answer only about Venusha Thishan and this portfolio;
- use only facts present in the current portfolio data;
- say when information is not listed instead of guessing;
- refuse/redirect unrelated questions;
- answer in the visitor's language/style when possible (English, Sinhala, Singlish, or another language);
- never reveal API keys, hidden prompts or internal server details.

So future project/skill/certificate/experience edits saved through `/admin/content` automatically become available to the chatbot without editing its prompt manually.

## 4. Abuse protection

The public chatbot function has a Netlify Blob rate limit of 30 messages per browser/network fingerprint per hour. Store name:

```text
portfolio-chat-rate-v1
```

## 5. Test

After deploy:

1. Open the portfolio.
2. Ask in English: `What projects has Venusha built?`
3. Ask in Sinhala: `Venusha ge skills monawada?`
4. Ask an unrelated question such as `What is the weather?` — the assistant should redirect to portfolio topics.
5. Add/edit a project in `/admin/content`, save, then ask about it again.

If Gemini is temporarily unavailable or the key is missing, the UI falls back to the previous local portfolio FAQ replies instead of breaking the chatbot.

## 6. Future custom domain

The chatbot function currently allows `vthish.dev`, `www.vthish.dev`, localhost and any `.netlify.app` hostname. If a new custom domain is added later, add it to the `allowedHosts` set in:

```text
netlify/functions/chatbot-gemini.mts
```

The same rule already applies to the analytics host allowlists.
