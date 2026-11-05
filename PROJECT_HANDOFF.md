# The AI Side — production memory

Updated 5 November 2026. This file supersedes older project handoffs.

## Channel and approved workflow

Channel: https://www.youtube.com/@TheAISide-01. English-language YouTube Shorts, made with free tools. The first agent-harness video was published by explicit user instruction. Daily noon topic/script review and 7 pm publication tasks exist; the user must approve each day's script, and the task must verify the render and channel before publication. Do not upload rejected versions. A 7 pm task starts at that time; actual publication must be confirmed.

## Current episode and series

Episode 1 introduces spec-driven development with the user-approved cartoon story: an AI creates an appointment feature; two patients book one slot; a spec states behavior and rules; acceptance criteria make the expected outcome testable; a technical plan, implementation and tests follow; humans review; the closing teases GitHub Spec Kit. Episode 2: Spec Kit. Episode 3: Kiro. Branch appointment-cartoon-approved, PR #11. The approved script is in motion/spec_voice.py.

## Creative and quality requirements

- More than 90 seconds and at most 120 seconds; 1080×1920 vertical, 30 fps.
- Original work only. Explain accurately and simply, with light humor, expressive English voice and intentional pauses.
- Continuous cartoon action that literally illustrates the spoken story. Avoid tiny generic cards, page turns, scene blinking, page numbers, empty shots and meaningless movement.
- Characters must stay grounded; keep faces, bodies, labels, captions and controls separated. Reserve generous mobile-safe margins and test intermediate transition frames.
- Review as a viewer: script-to-shot match, visual causality, motion readability, timing, captions, complete frame alignment and audio. Record what was actually inspected. Never claim an end-to-end playback or listening review without performing it.
- User specifically rejected earlier house analogy and videos. Current decisions supersede earlier generic follow/punchline endings.

## Motion references to use

- Remotion official Agent Skills: https://github.com/remotion-dev/skills — frame-based composition, sequencing, caption/audio and rendering. Installed adapted remotion-video-production skill supplements the official material.
- Motion Graphics Skills: https://github.com/charlie947/motion-graphics-skills — brief, explainer, motion effects and visual storytelling. Follow applicable ideas without copying others' designs.
- Emil Kowalski Animation Skills: https://github.com/emilkowalski/skills — purposeful motion, easing, choreography and review. UI interaction timings are guidelines, not a substitute for narration-led film pacing.
- Captions currently use sentence cues with approximate phrase timing, not forced word alignment.
- Kokoro ONNX voice af_heart via motion/spec_voice.py; composition motion/src/SpecShort.jsx; workflow .github/workflows/spec-short.yml.

## Quality gate

Render the exact branch revision, verify 90 < duration ≤ 120 seconds, inspect scene starts, middles, ends and transition frames for overlaps and matching actions, listen to narration if an audio-review capability is available, and check viewer comprehension. Be candid about unresolved limits. Never publish merely because encoding succeeds.

## 5 November follow-up

The 92.928-second render at 124a950f383f3371529a15585e0317f6575c3dd2 was reviewed in sampled stills and rejected: it remained dominated by small, static cards. No audio listening was possible in that review. Do not publish it. Revision 5c15b1fa629d77a1355a78469f66d34c102b6a3d introduces an animated double-booking reaction and revised rule/criteria scenes, slows the narration, and adds a comedic pause. Its render and end-to-end quality are not yet verified. Several other shots still need evaluation against the continuous-cartoon requirement. User's approved target was 1:40–1:55; maintain the absolute range of over 90 and at most 120 seconds. The 7 pm task must not publish any candidate without passing actual quality review.
