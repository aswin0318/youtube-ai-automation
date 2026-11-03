# Mind-il AI — free Malayalam Shorts proof of concept

A scheduled GitHub Actions workflow produces a **reviewable video**, not an automatic public upload. It runs entirely on free, open-source tools: Python, Pillow, eSpeak NG, FFmpeg and Noto Malayalam fonts.

## Workflow

- Scheduled for 10:30 UTC (4:00 PM India time); also supports manual dispatch.
- Rotates among 3 original, educational Malayalam scripts.
- Produces a 720×1280 MP4 and metadata in the Actions artifact.
- Does **not** claim to research breaking news or upload to YouTube yet.

## Mobile-only setup

1. Push all files to a GitHub repository, retaining `.github/workflows/daily.yml` path.
2. From the GitHub website on your phone, open **Actions → Mind-il AI Malayalam Short → Run workflow**.
3. Download **mind-il-ai-preview** from the workflow run artifacts.
4. Watch and verify Malayalam speech and text on your phone.

## Why no automated publication yet?

Malayalam eSpeak voice quality is often robotic and video quality must be checked. Enabling uploads requires one-time Google OAuth authorization and secure GitHub Actions secrets. YouTube upload has intentionally been omitted until the preview is validated.

This is a **prototype**, not a fully automatic trending-news system. It has no paid API dependency, and public-repo standard GitHub-hosted runner minutes are normally free, subject to provider policy and reasonable-use rules.
