VTHISH Gemini chatbot — Search fallback patch

Changed application file:
  netlify/functions/chatbot-gemini.mts

Behavior:
- Normal portfolio questions use GEMINI_MODEL (default: gemini-3.5-flash).
- Search questions use GEMINI_SEARCH_MODEL; if omitted, it automatically uses GEMINI_MODEL.
- Search requests include Google Search grounding.
- If Google Search fails because of quota/billing/model/tool availability, the function retries once WITHOUT Google Search using the normal portfolio model.
- The fallback answer uses portfolio/CMS data only and must not claim it searched Google.
- No UI, design, animations, admin, analytics, contact, media, or other app code is changed.

Recommended env:
  GEMINI_MODEL=gemini-3.5-flash
  GEMINI_SEARCH_MODEL=gemini-3.5-flash

GEMINI_SEARCH_MODEL is optional because it now defaults to GEMINI_MODEL.
