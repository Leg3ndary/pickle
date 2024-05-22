# Pickle

The amazing game also known as pickle.

To run this project first install the latest version of NPM.

Then create a file called .env.local and add the following kv pairs:

```env
apikey="YOUR_API_KEY"
WEBHOOK="YOUR_DISCORD_WEBHOOK"
```

The API key is the key for OpenAI's DALLE-3 API. The webhook is the webhook for a discord channel to log data.

Finally run the following commands:

```bash
npm install
npm run dev
```