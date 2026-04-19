# From Daily Crashes to 99.9% Uptime

A Slack notification poped up: "The site is down", "not again" I thought, rushed
into the AWS console to restart the EC2 instance, then I quickly ssh'd to check
the logs and try to find the unmanaged exception that crashed our backend again.
Customer support constantly reaching out with new user complaints, I'm ashamed
but we peaked at 94 technical tickets in march 2021. The whole deployment was
only partly automated happened once a week and we were all scared about it. Four
years later at may 2025 we reached our lowest technical tickets count with only
3 and had consistently achieved 99.9% uptime. It was all about building feedback
loops that reinforced our reliability.

## Reliability wasn’t owned

We were in the classic chaotic software project state. Engineers were constantly
fire fighting to fix issues but fixes were not long lasting. No knew if we were
improving, the only thing we were sure about is that our customers were angry.
Years later when I stumbled upon
[The Phoenix Projec](https://itrevolution.com/product/the-phoenix-project/) book
I couldn't stop smiling because it reminded so much of what we went through.

## What we tried that didn’t work

We kept fixing bugs as they came but we also kept introducing new bugs. On
refactorings old bugs kept comming back. We introduced unit tests but were an
after thought, brittle and provided little confidence. These felt productive but
barely moved the needle, the turning point was when managed to close the loop.
Along the way we learnt a lot on
[how to write good unit tests](/blog/writing-good-unit-tests).

## Feedback loops that compound

**Hook:** “We stopped thinking in tools and started thinking in loops.”

Introduce a simple diagram: **4 loops**. Each loop should be one section.

1. Detection loop (see reality fast)
2. Noise-control loop (only wake humans for real issues)
3. Learning loop (root cause)
4. Prevention loop (stop regressions)
5. Impact loop (prove ROI and steer priorities)

(Yes that’s 5; it’s fine. You can group noise-control into detection.)

**Visual:** one clean loop diagram. (More below.)

---

## 4) Detection loop: from “logs exist” to “we can answer questions”

**Hook:** “Logs weren’t the problem. The problem was we couldn’t _ask_ the
system anything.”

Cover:

- Structured logs (what changed, where, correlation IDs)
- Golden signals / key service health metrics
- Health metrics that reflect the user experience (not infra vanity)

**Concrete examples (super valuable):**

- “% of requests erroring”
- “p95 latency for critical endpoints”
- “queue backlog age”
- “DB error rate by region”
- “background jobs stuck”

**Keep-reading line:**

> But detection without noise-control just burns engineers out faster.

---

## 5) Noise-control: SLOs changed what “broken” means

**Hook:** “Our biggest reliability improvement came from alerting less.”

This is your “advanced” credibility section:

- Why raw alerts don’t work (too many false positives)
- SLOs make alerts meaningful: you page on “user pain,” not “CPU vibes”
- Error budgets force prioritization discussions with product/stakeholders

**Comment-bait line:**

> If you alert on symptoms, you train people to ignore alerts. If you alert on
> SLO burn, you train people to trust them.

**Optional:** Show a before/after on pages per week.

---

## 6) Learning loop: root cause analysis that actually changes the system

**Hook:** “Postmortems don’t work if they end in ‘be more careful’.”

Explain:

- Your RCA template in 6 bullets (short)
- Focus on _systemic contributors_ (missing tests, risky deploys, unclear
  ownership, data migration issues, etc.)
- Identify “top bug producers”: modules/endpoints that generate outsized pain
- Fix classes of failures (idempotency, retries, timeouts, schema drift, race
  conditions)

**Keep-reading line:**

> Once we knew where the bugs really came from, tests started paying off.

---

## 7) Prevention loop: tests that target risk, not ego

**Hook:** “We didn’t add ‘more tests’. We added tests where failure is
expensive.”

Structure this like:

### What we stopped doing

- Blanket “increase coverage” goals
- Endless low-value unit tests

### What we started doing

- Regression tests for known incident classes
- Contract tests / integration tests around critical boundaries
- E2E tests only for the happy paths that matter commercially

**Very HN-friendly:** include a table: “Test type → what it prevents → where
it’s worth it.”

---

## 8) The impact loop: tracking bug reports as a product metric

**Hook:** “We treated bug reports like revenue: a number that must go down.”

Explain:

- Bug reports/month as a proxy for quality + customer pain
- Tagging/triage discipline
- Segmenting by severity / area
- Correlating improvements with interventions
- Avoiding perverse incentives (don’t hide bugs)

**Comment-bait line:**

> If you don’t track the outcome metric, reliability work turns into folklore.

---

## 9) What changed culturally (the real reason it stuck)

**Hook:** “Tools didn’t save us. Habits did.”

Examples:

- Explicit on-call ownership and rotation health
- Reliability work becomes planned, not heroic
- Product tradeoffs discussed with error budgets
- Written decisions / RFCs for risky changes
- “Stop the line” authority when SLO is burning

This section makes you look like a leader, not just a debugger.

---

## 10) Results: show the receipts

**Hook:** “Here are the numbers. Feel free to judge.”

Put the charts here, but tease earlier with one chart up top.

Metrics to include:

- Bug reports/month: 60 → 5
- Uptime or availability trend
- Mean time to detect (MTTD) and recover (MTTR) if you have it
- Alerts/week or pages/week
- Deployment frequency (often improves when stability improves)

---

## 11) What I’d do differently next time

**Hook:** “If I could redo it, I’d do less work—and get results faster.”

Examples:

- Start with top 3 bug producers earlier
- Add SLOs earlier to stop alert fatigue
- Invest in observability conventions sooner
- Add 3–5 E2E smoke tests earlier (critical flows)

HN loves humility + decisive lessons.

---

## 12) The takeaway: reliability compounds (and unlocks speed)

**Hook:** “Reliability isn’t a cost center. It’s a throughput multiplier.”

Bring it home:

- Less fire-fighting → more deep work → more features
- Better morale → better retention
- Better predictability → better planning

End with a crisp model:

> If you want reliability, don’t start with tools. Start with feedback loops
> that force reality into the system every day.

---

# Graphs & visuals that increase frontpage odds

These are the visuals most likely to make people upvote + share.

## 1) Bugs/month over time (the hero chart)

**Format:** line chart, monthly. **Add annotations** when major interventions
happened:

- “Introduced SLO paging”
- “Top 3 bug producers RCA push”
- “Added E2E smoke tests”

This is your “proof” chart. Put a mini version near the top, full version in
Results.

---

## 2) Reliability flywheel diagram (simple)

A diagram with arrows:

**Detect → Decide → Fix root causes → Prevent regressions → Measure impact →
back to Detect**

Keep it clean, 1 image, 6 words per node max.

---

## 3) Alert volume before/after SLOs

**Format:** bars per week (pages/week). Show something like 30/week → 3/week.

This supports the contrarian “alert less” claim.

---

## 4) Pareto chart: “Top bug producers”

**Format:** bars sorted descending + cumulative line. Shows that a small set of
modules/endpoints produce most bugs.

HN eats this up because it’s data-driven prioritization.

---

## 5) A “test portfolio” table (not a chart)

A small table:

- Unit tests: logic + edge cases
- Integration tests: boundaries
- Contract tests: external APIs
- E2E smoke: money paths

Columns: “Catches”, “Cost”, “When worth it”.

This signals senior judgment.

---

## 6) Optional: Incident timeline “before vs after”

Two small timelines:

**Before:** chaotic, repeated incidents, long gaps to detection **After:**
faster detection + clear mitigations + fewer repeats

Only do this if you can keep it tight.

---

# Presentation tips that matter for HN/Reddit

- **Be concrete:** include 2–3 mini incident stories, even if short.
- **Name tradeoffs:** “We accepted X to get Y.”
- **Avoid vendor/tool worship:** mention tools lightly; focus on principles.
- **Write like an engineer:** crisp, honest, a bit opinionated.
- **No fluff intros:** start with the pain + numbers.

---

# If you want the highest probability of frontpage

Lead with:

1. Bugs/month chart (small)
2. The thesis: feedback loops
3. One uncomfortable mistake
4. A concrete incident story
5. Then the system

That sequence maximizes “I need to read this” momentum.

---

If you paste me your rough numbers (even approximate) for: bugs/month trend,
alert volume, and uptime definition, I can turn this into a tighter outline with
exact chart captions + “annotation points” that match your story.
