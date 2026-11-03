# The AI Side — research, original video ideas, and production roadmap

Research snapshot: 4 November 2026. This file is a planning document, not an automatic trend detector, publishing schedule, or completed video.

## Audience and editorial promise

Make short, practical videos for developers and curious beginners about AI agents, coding tools and modern software engineering. Explain one idea at a time with original scenarios, scripts, narration and visuals. Credit primary sources when a video discusses a specific announcement. Verify release date, preview/GA state, access and pricing immediately before production; never claim that a particular topic is trending without evidence.

Reference: AI Engineer (@aiDotEngineer) publishes talks and panels on agents, harnesses, context, RAG, evals and AI engineering. One relevant source is the talk “Your Agent Didn’t Fail. Your Harness Did.” (https://ai.engineer/talks/BInpv7lGp1o-your-agent-didnt-fail-your-harness-did). Use the channel as an idea and source-discovery reference only. Do not reproduce its wording, script structure, visual sequences, speaker audio, slides, footage, thumbnails or distinctive presentation. Explore primary sources and create independent scripts, metaphors, storyboards and designs.

## Production reality

- The approved preview, voice and Remotion workflow are in branch `english-motion-preview`. Existing generator uses one fixed topic. The scripts below are drafts; saving this document does not cause the generator to produce these videos.
- Use original narration and self-created visuals, or independently licensed assets. Never upload until the user explicitly authorizes it.
- Short names and hooks are working titles, not claims that video titles are unused or guaranteed to attract viewers.
- All topics are candidates, not verified trends. Test interest after publication using retention, not assumptions.

## Prioritized content backlog

| Order | Working title / hook | Audience value and original scenario | Sources / status |
|---|---|---|---|
| 1 | The agent that deleted the wrong file | Compare an AI with a tool loop to one with an explicitly engineered runtime: a developer asks it to clean temporary files; one setup can call delete directly, another constrains paths and verifies results. A loop always has *some* surrounding implementation, so compare a minimal custom loop with a richer harness, not an agent literally operating without any software. | https://github.blog/ai-and-ml/github-copilot/evaluating-performance-and-efficiency-of-the-github-copilot-agentic-harness-across-models-and-tasks/ |
| 2 | Your AI wrote code. Did it solve the problem? | Contrast a vague booking-app request with a spec stating cancellation and double-booking rules. Specs improve shared understanding but do not automatically guarantee quality. | https://github.github.com/spec-kit/ and https://github.com/github/spec-kit/blob/main/docs/concepts/sdd.md |
| 3 | Spec Kit in 40 seconds | A new feature moves from spec to plan to tasks to implementation and review; show real stages with a fictional feature. Confirm current commands and supported agent before recording. | https://github.com/github/spec-kit |
| 4 | GitHub Copilot from your phone | Explain the October 28 VS Code/GitHub Mobile agent-host option. The computer must remain running; the phone is a control surface, not free cloud compute. | https://github.blog/changelog/2026-10-28-github-copilot-in-vs-code-universe-releases/ |
| 5 | A shared Copilot harness: why it matters | Compare two apps using a common engine but different controls. Avoid implying outputs and policies are always identical across products. | https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/ and Oct 28 changelog |
| 6 | One agent, or a team of agents? | Restaurant-kitchen scenario: one person handles a simple sandwich; parallel specialists help with a complex order but add handoff overhead. | https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/ |
| 7 | Context is not memory | Two workers: one receives only today's page; another has access to a searchable filing cabinet. Show that retrieval can still select irrelevant or stale material. | Research and verify individual claims before scripting. |
| 8 | RAG is not a guarantee | An agent searches three manuals; one is outdated. Retrieval adds evidence but the answer can still be wrong. | Research official documentation and cite specific source before production. |
| 9 | What is an agent eval? | Test a support agent on 20 labeled scenarios including ambiguous refunds; compare expected behavior, unsafe actions and regressions. | Source a first-party eval guide before recording; illustrative sample size. |
| 10 | MCP explained with a real example | Model uses a common connector to ask a repository tool for files; a protocol is an interface, not automatic permission or trust. | https://modelcontextprotocol.io/ |
| 11 | HydraFusion: who picks the model? | Explain a routing decision using a dispatcher analogy; describe Project HydraFusion as announced Sept 10, 2026 in experimental mode, not as a current permanent setting. Recheck latest status. | https://github.blog/changelog/2026-09-10-github-copilot-weekly-releases-september-7/ |
| 12 | Copilot dynamic workflows vs delegation | Compare a code-defined restaurant order process with an agent choosing to call helpers. Public preview and CLI experimental configuration as of Oct 1; verify before publishing. | https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/ |
| 13 | Sandboxes: what can your agent touch? | A repair agent works in a restricted workshop; show files, network and secrets permissions as independent controls; no sandbox guarantees zero risk. | https://github.blog/changelog/2026-10-09-github-copilot-weekly-releases-october-5/ |
| 14 | A prompt, a skill and a harness | Compare a work request, a reusable task guide and the surrounding environment/tool loop. Skills may have bundled scripts; do not imply they are only prose. | Verify official documentation of the selected platform before publishing. |
| 15 | Why agent handoffs lose context | A staged code review example: pass only an objective, selected files and test evidence; compare missing constraints vs targeted context. No promise that less context always improves quality. | Original scenario; support design claims with primary sources when scripted. |

## Original draft scripts and scene directions

These scripts are newly written for this channel, not transcriptions or visual recreations. Timings are targets, not measured narration lengths.

### 1. Agent loop vs a stronger harness (~35–45 s)

Hook: “Your AI agent can delete files. But what stops it deleting the wrong ones?”

“A language model can suggest an action. An agent loop can call a tool and use the result. Imagine asking it to clean a project folder. In a minimal setup, it might call delete with little checking.

Now add a stronger harness: limit the folders it can access, ask for approval before risky actions, and record what happened. The agent can still make mistakes—but the system has more ways to catch or limit them.

So, when your AI takes action… who checks the action?”

Visual direction: one continuous workshop bench; a request card becomes a tool, file paths move into a highlighted permitted zone, an approval gate appears, and a receipt is stamped. Camera follows the same object; no flashing, page counters or copied visual metaphors. This is a hypothetical comparison; policies must actually be implemented and tested.

### 2. Spec-driven development (~30–40 s)

Hook: “Your AI built the booking app. Then two people booked the same seat.”

“The prompt said, ‘Build a booking app.’ It never said what should happen when two customers choose the last seat.

With spec-driven development, you spell out that behavior first: one booking succeeds, the other gets a clear response. Then you turn the spec into a plan, tasks, code and tests.

A spec isn’t magic; it can be incomplete. But it gives humans and coding agents the same problem to solve.

What rule would your AI miss?”

Visual direction: a single seat is claimed by two moving cards; freeze and rewind into a written acceptance rule, then the cards move through a test. Avoid copying any external tutorial, diagrams or branding.

### 3. GitHub Copilot and your phone (~30–40 s)

Time-sensitive: based on GitHub's October 28, 2026 announcement; verify feature availability, requirements and documentation just before production.

Hook: “Your phone can steer a coding agent running on your computer.”

“GitHub describes a way to check an agent’s progress, give it direction, or start work from GitHub Mobile. The important detail: the agent host runs on your development machine, and that machine needs to stay on.

Think of your phone as the remote control, and your computer as the engine. The phone isn’t replacing the computer.

Would you manage a coding task from your phone?”

Visual direction: an original stylized phone sends a signal to an illuminated computer; code and status are abstract shapes, not copied GitHub screenshots.

## Skills and tools research

These are candidates, not endorsements or installed integrations. Inspect source, license, external requests and maintenance before using third-party tools. Never execute an unreviewed install script.

| Candidate | What it could improve | Fit and next experiment |
|---|---|---|
| Existing Remotion video-production skill (installed) and official Remotion skills | Deterministic motion, editing, timing, layout and captions. | Keep as the foundation; design a single continuous camera and object handoffs for the next draft. https://www.remotion.dev/docs/ai/skills |
| Remotion Motion Graphics by haidrrrry | Motion vocabulary, staging and extracting frames for inspection. MIT repository. | Reviewed SKILL.md; useful as guidance, but reject blanket rules like making *everything* move. Not installed or tested in this project. https://github.com/haidrrrry/claude-remotion-skill |
| LottieFiles Motion Design Skill | Timing, easing and choreography principles. | UI-focused guidance; evaluate transfer to vertical explainers. Not installed or tested. https://github.com/LottieFiles/motion-design-skill |
| MotionCraft | Storyboards, motion-production workflow, optional audio cue tools and sampled pixel QA. MIT repository. | Promising but more moving parts; review the code, measure runner cost, and inspect outputs. Automated frame checks do not replace watching/listening. Not installed or tested. https://github.com/ahmdd4vd/MotionCraft |
| faster-whisper | Estimates word timestamps to make captions follow spoken words. MIT code. | Test small/int8 CPU inference on a single generated voice clip, measure time and caption errors; model and dependency licenses need separate checks. https://github.com/SYSTRAN/faster-whisper |
| WhisperX | Forced alignment and word-level captions. BSD-2 code. | Heavier potential dependencies; compare against faster-whisper in an isolated test, check model licenses and runtime before choosing. https://github.com/m-bain/whisperX |
| Kokoro ONNX (current) | Free local neural voice that user likes. | Keep as baseline. Adjust sentence chunking and pauses; compare other preset voices without replacing it automatically. https://github.com/thewh1teagle/kokoro-onnx |
| Chatterbox / Chatterbox Nano | Candidate for more expressive voice; upstream describes expression controls and a CPU-oriented model. | Run an isolated A/B test on the same short script, record CPU time/memory, check model and code licenses and listen. Do not assume it works acceptably on GitHub-hosted runners or is better without a test. https://github.com/resemble-ai/chatterbox |
| Original synthetic sound effects | Soft movement accents and emphasis without third-party music. | Optional sparse sound design; generate small original WAV sounds and review loudness and voice clarity. Avoid adding noise merely to fill silence. |

## Next experiments, in order

1. Make one original harness video with persistent objects, scene-to-scene continuity and narration-matched motion. Use existing voice and Remotion skill first.
2. Render 1080x1920 at 30fps, inspect transitions and representative frames, listen through actual audio, check captions and safe areas. Upload a review artifact only.
3. Compare voice A/B samples (current Kokoro voice versus a locally run candidate), using the same original script and respecting free runner limits. User chooses.
4. Test word-level alignment and quantify errors/time; avoid claiming perfect synchronization.
5. Prepare a repeatable topic-source research process. Date every release claim, record URLs and verify state again at production time. Do not invent trends, require paid APIs or silently enable publishing.

## Sources

- Spec Kit: https://github.com/github/spec-kit
- GitHub Copilot October 28 release: https://github.blog/changelog/2026-10-28-github-copilot-in-vs-code-universe-releases/
- Agent runtime: https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/
- Agentic harness: https://github.blog/ai-and-ml/github-copilot/evaluating-performance-and-efficiency-of-the-github-copilot-agentic-harness-across-models-and-tasks/
- Copilot dynamic workflows (public preview at announcement): https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/
- Project HydraFusion (experimental at announcement): https://github.blog/changelog/2026-09-10-github-copilot-weekly-releases-september-7/
- AI Engineer source reference: https://ai.engineer/talks/BInpv7lGp1o-your-agent-didnt-fail-your-harness-did

## Initial local voice feasibility check

On the local execution environment, Kokoro generated “What task would you trust an AI agent to do?” with af_heart (2.79 seconds of audio in 1.00 second) and af_bella (2.82 seconds in 1.03 seconds). These are single-run timings from this environment, not GitHub Actions benchmarks. Neither sample was evaluated by listening and this does not establish voice quality. The existing af_heart remains the default. No other voice engines were benchmarked.
