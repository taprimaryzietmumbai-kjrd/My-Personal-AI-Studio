# Personal AI Studio

A responsive personal AI workspace with a GitHub Pages frontend and a separate secure API backend.

## Frontend deployment
1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. The included workflow deploys the site after commits to `main`.
4. The expected app address is `https://taprimaryzietmumbai-kjrd.github.io/My-Personal-AI-Studio/`.

## Secure AI backend
The frontend requires a separately deployed Cloudflare Worker. From the `worker` folder:
1. Install Wrangler and authenticate: `npx wrangler login`.
2. Set the provider key securely: `npx wrangler secret put OPENAI_API_KEY`.
3. In Worker Variables, set `ALLOWED_ORIGIN` to `https://taprimaryzietmumbai-kjrd.github.io`.
4. Deploy: `npx wrangler deploy`.
5. In the live app, open Settings, paste the Worker URL and save.

Optional variables: `OPENAI_MODEL` (defaults to `gpt-4o-mini`) and `OPENAI_API_URL` (defaults to the OpenAI Chat Completions endpoint).

## Editing
Edit `index.html` directly on GitHub. Each commit to `main` automatically republishes the frontend.

## Security
Never commit an AI provider key or place it in the frontend. Keep it in the Worker secret store. Add authentication, rate limits, usage limits and monitoring before broad public use. Do not submit confidential personal data unless the deployment has been reviewed for that use.

Live AI responses require a separately deployed backend and a valid provider account.
