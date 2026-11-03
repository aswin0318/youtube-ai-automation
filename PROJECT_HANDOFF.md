# The AI Side — project handoff

Updated: 4 November 2026.

## Goal and constraints

Build an attractive, English-language AI-explainer Shorts workflow for the user's channel, currently called Mind-il AI; preferred proposed name: **The AI Side**. Name/handle availability has not been verified and the YouTube channel has not been renamed. User is on a phone, wants free tools and no paid services. Do not publish or upload to YouTube until the user explicitly authorizes it.

## Current state

Repository: aswin0318/youtube-ai-automation. The latest accepted preview is on branch `english-motion-preview`, commit `24f3054d80cdb643766cb07970d7b184d3f5f13f`, pull request #2. The changes are not merged into the default branch; the old workflow remains there. The workflow produces reviewable artifacts, not published videos. The latest successful run: https://github.com/aswin0318/youtube-ai-automation/actions/runs/41721938863 ; artifact `ai-side-motion-preview`, expires after 7 days. To regenerate, run a branch workflow. This prototype has one fixed, manually written AI agents topic; it does not autonomously research trends, generate new scripts or publish.

## Feedback and creative decisions

- The first Malayalam/eSpeak video was rejected; switch to English.
- The user likes the Kokoro `af_heart` English voice and the latest Remotion visual design.
- They dislike repetitive slide/page designs, abrupt cuts, blinking, page numbers and generic calls to follow.
- The latest version overlaps the scenes, removes page numbers and the progress bar, and uses deliberate pauses. User says this version is good, but asks for **more animation, smoother motion and more seamless continuity** in the next iteration.
- Endings must be specific to the topic, impactful and expressive, with a pause before the question. Current closing: “AI agents can act for you, but they need your judgment.” [pause] “What task would you trust one to do?”
- Use varied, purposeful visuals responding to narration. Focus on a strong hook, readable captions, storytelling and viewer retention; do not promise engagement or claim quality has been verified without actually reviewing the video.
- Previous requests: find suitable high-quality skills/tools and use them. Continue reviewing and respecting licenses, free-use constraints and reproducibility.

## Implementation and tools

- Frame-based Remotion/React visuals, 1080×1920 and 30 fps. Main composition: `motion/src/index.jsx`; narration/timing: `motion/voice.py`; workflow: `.github/workflows/daily.yml`.
- Local Kokoro ONNX voice, `af_heart`, with sentence-based timing and inserted silence. Open model files download at workflow time. Free FFmpeg, Python and GitHub Actions.
- An adapted personal **remotion-video-production** skill was installed and used. It derives from `remotion-dev/skills` Remotion best practices and contains references for compositions, multi-scene video, timing, transitions, sequencing and layout. The full upstream Remotion skill repository was inspected; use the adapted skill as guidance and consult upstream documentation if needed.
- `CREATIVE_BRIEF.md` records the editorial brief. This is guidance, not an automatically executed LLM prompt.

## Next session

Begin with the current accepted preview and user feedback. Improve continuity with persistent scene elements, motivated movement, smooth transitions and visuals that illustrate each spoken beat; keep the current voice and retain pauses. Preserve the relevant ending. Render and review representative frames/actual playback where possible, verify generated audio and video, and give the user a new downloadable preview. Do not assume the test branch is already merged or that YouTube publishing is enabled.
