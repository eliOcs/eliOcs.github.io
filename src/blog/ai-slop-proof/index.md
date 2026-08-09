# AI Slop Proof

Why does McDonald's taste the same in every country? How have they managed to
reliably produce hamburgers all over the world with employees who come and go
and imperfect machines? I'll tell you how: they've exactly defined the work that
needs to be done to produce those burgers.

They detail every aspect of the business, creating a replicable model for
everything from keeping the kitchen clean to verifying that every ingredient is
fresh[^1]. Sometimes they use automation, like fryers that automatically control
the temperature of the oil, and other times they rely on good processes, like
double-checking the ingredients of the burger before wrapping it.

Enough about burgers. I'm getting hungry already, so let's get back to software.
There's been a lot of noise about AI, especially about AI slop. What is _AI
slop_ anyway? _Overcomplicated code? Unreliable code?_ If you struggle to define
it, you will struggle to deal with it.

## What is AI slop anyway?

Before AI started producing bad-quality code, every line of code was perfect and
software was reliable from the get-go. I mean, sometimes
[databases in production got deleted randomly](https://about.gitlab.com/blog/gitlab-dot-com-database-incident/),
[critical bugs in the most important security libraries went unnoticed for years](https://www.heartbleed.com/)
or a
[firewall update crashed 8 million devices](https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages).
But these are just minor exceptions... _who are we trying to fool?_ As humans,
we constantly make mistakes. Now AI allows us to generate code faster and thus
also make mistakes faster.

Coding agents without the full context and without guardrails will indeed
produce massive amounts of code that can quickly become unmanageable. This used
to be called "spaghetti code" or "big ball of mud" before we could blame AI.

_AI slop is not just ugly code_. It is code that is hard to trust, hard to
change, and hard to recover when something breaks.

## The bright side

It's not all bad. NASA's Space Shuttle Flight Software ran for 30 years with
close to no defects. SQLite, the database of choice in billions of devices, has
also been running for decades with a spotless record. And the Linux kernel, even
at the massive scale of 30+ million lines of code and thousands of contributors,
powers most of the world's servers with impressive stability. All of these
projects have achieved McDonald's-like levels of stability and reliability.

## Speed needs guardrails

How do these great projects deal with race conditions, type errors, missing
bounds checks, or architectural blind spots? With rigorous testing, peer review,
and monitoring, but most importantly, by setting a culture that **treats
correctness as the default and speed as a constraint, not the ultimate goal**.

If you are a solo builder or part of a small team, you do not need enterprise
process to get there. But you do need guardrails. The goal is not perfect code.
The goal is to ship **useful software that is reliable and easy to change** a
few weeks down the road.

My default is to enforce these guardrails with a pre-commit hook or, if you are
working with a team, a CI run that blocks PRs from being merged if they don't
pass.

## How to keep code readable

My default is that **good code is simple and direct**; that usually makes it
easier to read, review, maintain, and change. This matters not only for humans
but also for AI. If your codebase is split into reasonably sized files, logic is
kept in the right place, and naming is consistent, the agent gets better
context, makes fewer wrong assumptions, and has a much better chance of editing
the right thing without creating new messes somewhere else. **Readable code is
also better context for AI.** Let's try to put processes in place to achieve
that goal.

### Format

Let's start with the most basic stuff. **A consistent format makes code easier
to read**. Every language nowadays has its formatter. In JavaScript, you can
rely on [Prettier](https://prettier.io/): `prettier --check .`. It isn't
important whether you prefer double quotes or single quotes. We just need to be
consistent, so I would usually stick to the defaults.

### Lint

Every programming language has its good and bad parts. For example, JavaScript
silently coerces types when comparing values: `0 == "0"` is `true`, but
`0 == ""` is also `true`, while `"0" == ""` is `false`. We can avoid that by
using the strict equality check `===`. You can also easily silence errors with
`catch (error) {}` or define infinite loops with `while (true)`. In rare cases,
you may need these language features, but my default is to avoid them with a
linter, which will catch common issues and help prevent shooting yourself in the
foot. There are many linters out there. For example, in a web-based project you
could use [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/):
`eslint . && stylelint .'`

### Typechecking

Typed languages allow you to find mistakes early, like trying to access
properties that don't exist or calling functions with missing arguments. Even if
you aren't using a typed language, you can use tools to check the implied types.
My default is to use some kind of type checking unless the project is still in a
very early exploratory phase. For example, in JavaScript you can use
[TypeScript](https://www.typescriptlang.org/) to check the JavaScript code
([Sorbet](https://sorbet.org/) for Ruby,
[Python type hints](https://docs.python.org/3/library/typing.html), etc.). Types
also help AI agents a lot. If a third-party library has good type definitions,
the agent can often understand how to call it correctly just from the local code
and editor feedback, without searching the internet or making silly mistakes.
That **saves cycles and reduces guesswork**.

### Limit file size

Another easy way to make code easier to read is to limit the lines of code per
file. My default is to enforce a limit because it forces you to split and group
functionality under descriptive file names. It is much easier to read 500-line
files than 3000-line files, and it is less likely that you will read parts you
don't need in order to understand the specific path you are working through.
Similar to humans, it also helps AI use less context. In ESLint, you can easily
set the [`max-lines`](https://eslint.org/docs/latest/rules/max-lines) to the
limit that makes the most sense for your programming language. Some languages,
like Java, are much more verbose and higher limits are probably justified.

### Limit cyclomatic complexity

Even if you limit the lines of code, it is still pretty easy to cram a lot of
logic into a function. Unfortunately, our minds have a limit to how many
branches can fit in working memory. If there are too many, you will soon need to
start using a piece of paper to track it all. My default is to limit the
[complexity](https://eslint.org/docs/latest/rules/complexity) to **10**. I am
not claiming that 10 is a universal truth, but it is a reasonable forcing
function and easy to enforce in many linters.

### Keep code in the right place

At a higher level, even if you have small, simple files, you probably still want
to avoid cyclic dependencies, prevent your UI code from directly calling the
database, or enforce a few clear architectural boundaries. This does not need to
be a huge-enterprise thing. Even as a solo builder, you want to be clear about
where logic belongs so your app does not slowly collapse into one giant pile of
handlers and helpers. There is also a tool for that. If you clearly define what
you want, you can enforce it. This also helps AI agents make smaller and more
reliable edits, because they are less likely to touch unrelated files or invent
new layers when the existing boundaries are already obvious.
[Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) for
JavaScript will automatically detect orphan files, cyclic dependencies, or
imports that haven't been defined in the package file.

### Avoid duplicated code

**Every line of code is a liability**; most software cost comes from
maintenance. My default is to allow a small amount of duplication instead of
trying to eliminate it entirely. From my experience, the sweet spot is around 5%
in a codebase. Being too aggressive about avoiding any duplication can also
force unnecessary abstractions. These copy/paste detector tools were first
introduced in the Java ecosystem 20 years ago. Depending on the verbosity of the
language, you will tune them to your liking, but in JavaScript I like to limit
duplication to **100 tokens**: `jscpd src test --min-tokens 100 --threshold 5`.

## How to keep behavior reliable

I feel compelled to reference the remarkable fact that
[SQLite](https://sqlite.org/hirely.html) has **600 times more code in its
tests** than in its implementation. The founder even said that once they forced
100%
[MCDC coverage](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)
the bugs stopped coming. This is mandatory in aviation software under the
process [DO-178C](https://en.wikipedia.org/wiki/DO-178C).

### How much do you really need?

I'm a fan of high reliability, but there are clearly tradeoffs. **If no one uses
your software, it clearly doesn't matter if it is reliable**. Depending on the
stage and type of project, different levels of reliability make sense. I really
like how Kent Beck describes the typical phases a project goes through:
[_Explore, Expand and Extract_](https://medium.com/@kentbeck_7670/fast-slow-in-3x-explore-expand-extract-6d4c94a7539).
When you are just testing something out, my default is to optimize for learning
speed, not test coverage. The most important thing is putting a prototype in
front of the customer as soon as possible. As you start to grow your user base,
you should cover the most critical paths with tests. Eventually, as you reach
the later stages of a project, when a bug impacts thousands or millions of
customers, you will shift toward adding more and more coverage.

Similarly, if you are in the health sector, where mistakes can be tragic, you
will have more tests than if you are building a more standard web app.

### Enforce branch coverage

You can easily measure and enforce branch coverage, for example in Node you can
use [C8](https://github.com/bcoe/c8): `npx c8 --branches 80 node --test`. Take
into account that you can measure coverage not only of unit tests but also of
e2e tests. Once the code is instrumented, you can record coverage no matter how
it runs. You can also merge coverage reports. I tend to cover happy paths in e2e
tests and then cover edge cases in unit tests.

### Types of tests

A decade ago the
[Testing Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
started becoming a thing. Google started mentioning it, and it went viral. The
idea is simple: on one side, unit tests are fast to run, provide maximum
isolation, but offer less confidence; on the other side, UI tests mimic real
user behavior, which makes them slower and flakier than unit tests but gives
maximum confidence. There are lots of in-betweens, and the pyramid distribution
has been challenged a lot over the years. My default is to push for tests that
give you **maximum confidence as long as they are fast**. So instead of aiming
for a certain distribution, for every feature you want to verify, think about
what test can bring you the most confidence. In my experience
[unit tests can take you a long way in many situations](/blog/writing-good-unit-tests/).
I like to cover happy paths with UI tests, push for **very high unit test
coverage on core logic**, and develop the habit of adding a test for every bug
reported by a customer.

## How to keep performance acceptable

Again, we just have to find the metrics to objectively track performance. If you
are building a game, you could probably measure frames per second. If you are
writing a web app, you can probably check the time it takes for your page to
load or react to every user action
([web vitals](https://web.dev/articles/vitals/)).

If performance worries you, then add a stress test. For example, if you are
running a game you could create a test where a bot plays the game for 3 minutes
and you verify that there are no FPS drops. If you are testing a web app,
generate a lot of dummy data and measure the loading times.

## How to keep shipping safely

The smaller the changes, the easier they are to review, and once deployed, if
you find a problem, the easier it will be to identify the cause. That is why my
default is to enforce some limit on change size. It encourages shipping in
_small batches_, which shortens the feedback loop. The latest
[DORA report](https://dora.dev/research/2025/dora-report/) encourages working in
small batches and the latest
[DevEx report](https://linearb.io/resources/software-engineering-benchmarks-report)
shares metrics showing that elite teams have PR sizes **under 90 lines of
code**.

Change sizes tend to get very big when the current codebase doesn't accommodate
the change you are trying to make. That's why I like to do the
[structural changes first](https://www.oreilly.com/library/view/tidy-first/9781098151232/)
before starting with behavioral changes: _"Make the change easy and then make
the easy change."_

## How to notice when things break

When adding observability, don’t
[scatter vague log messages through the codebase](https://loggingsucks.com/).
For example, for each backend request, produce a structured event that captures
the full story: who triggered it, what path it took, what dependencies were
involved, what business context mattered, how long it took, and how it ended.
**Our goal is not to create more logs, but to create logs that can answer
questions without guesswork.** A good log event should let someone filter by
meaningful fields, group failures by cause, correlate issues across services,
and understand customer impact without stitching together dozens of unrelated
lines.

## Conclusion

Right now AI agents are mainly helping in the development stage when you are
converting design requirements into code. The processes and checks we've covered
will help you produce solid code, but there is still much more to building
software that customers can rely on. You still have to understand customer
needs, decide what matters, keep the system understandable, and operate it when
things go wrong.

I don't think the point of these guardrails is to slow AI down, but rather guide
it down the right path. If you can define the behavior you want, measure it with
deterministic tests, and observe it properly in production, you can let agents
move much faster. The hard part shifts from typing code to specifying what good
looks like.

**Define the behavior you want, measure it with deterministic tests, and observe
it properly in production.**

These processes are the same ones we've been using to produce solid software for
decades, long before AI was involved. AI does not remove the need for them. It
makes them more valuable.

**The bottleneck is no longer typing, it is judgment and taste**.

[^1]:
    [The E-myth Revisited](https://michaelegerbercompanies.com/product/the-e-myth-revisited/)
    really drove home the importance of processes to reliably manage a business.
