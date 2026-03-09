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

## The good old times

Before AI started producing bad-quality code, every line of code was perfect and
software was reliable from the get-go. I mean, sometimes
[databases in production got deleted randomly](https://about.gitlab.com/blog/gitlab-dot-com-database-incident/),
[critical bugs in the most important security libraries went unnoticed for years](https://www.heartbleed.com/)
or a
[firewall update crashed 8 million devices](https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages).
But these are just minor exceptions... who are we trying to fool? As humans, we
constantly make mistakes. Now AI allows us to generate code faster and thus also
make mistakes faster.

## The bright side

It's not all bad. NASA's Space Shuttle Flight Software ran for 30 years with
close to no defects. SQLite, the database of choice in billions of devices, has
also been running for decades with a spotless record. And the Linux kernel, even
at the massive scale of 30+ million lines of code and thousands of contributors,
powers most of the world's servers with impressive stability. All of these
projects have achieved McDonald's-like levels of stability and reliability.

## Process over speed

How do these great projects deal with race conditions, type errors, missing
bounds checks, or architectural blind spots? With rigorous testing, peer review,
and monitoring, but most importantly, by setting a culture that **prioritizes
correctness over shipping fast**.

## How can we force good code

**Good code is simple and direct**; therefore, it is easy to read and
understand. Let's try to put processes in place to achieve that goal.

### Format

Let's start with the most basic stuff. **A consistent format makes code easier
to read**, so make sure you have a pre-commit hook, or, if you are working with
a team, a CI run that blocks PRs from being merged if they don't pass. Every
language nowadays has its formatter. In JavaScript, you can rely on
[Prettier](https://prettier.io/): `prettier --check .`. Remember, it isn't
important whether you prefer double quotes or single quotes. We just need to be
consistent, so stick to the defaults.

### Lint

Every programming language has its good and bad parts. For example, JavaScript
silently coerces types when comparing values: `0 == "0"` is `true`, but
`0 == ""` is also `true`, while `"0" == ""` is `false`. We can avoid that by
using the strict equality check `===`. You can also easily silence errors with
`catch (error) {}` or define infinite loops with `while (true)`. In rare cases,
we need these language features, so let's avoid them by default with a linter,
which will catch common issues and help prevent shooting yourself in the foot.
There are many linters out there. For example, in a web-based project you could
use [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/):
`eslint . && stylelint .'`

### Typechecking

Typed languages allow you to find mistakes early, like trying to access
properties that don't exist or calling functions with missing arguments. Even if
you aren't using a typed language, you can use tools to check the implied types.
For example, in JavaScript you can use
[TypeScript](https://www.typescriptlang.org/) to check the JavaScript code
([Sorbet](https://sorbet.org/) for Ruby,
[Python type hints](https://docs.python.org/3/library/typing.html), etc.).

### Limit file size

Another easy way to make code easier to read is to limit the lines of code per
file. It forces you to split and group functionality under descriptive file
names. It is much easier to read 500-line files than 3000-line files, and it is
less likely that you will read parts you don't need in order to understand the
specific path you are working through. Similar to humans, it also helps AI use
less context. In ESLint, you can easily set the
[`max-lines`](https://eslint.org/docs/latest/rules/max-lines) to the limit that
makes the most sense for your programming language. Some languages, like Java,
are much more verbose and higher limits are probably justified.

### Limit cyclomatic complexity

Even if you limit the lines of code, it is still pretty easy to cram a lot of
logic into a function. Unfortunately, our minds have a limit to how many
branches can fit in working memory. If there are too many, you will soon need to
start using a piece of paper to track it all. I personally like to limit the
[complexity](https://eslint.org/docs/latest/rules/complexity) to **10**, which
is also easy to do in many linters.

### Avoid bad architecture

At a higher level, even if you have small, simple files, you probably still want
to avoid cyclic dependencies, prevent your UI code from directly calling the
database, or enforce architectural boundaries. There is also a tool for that. If
you clearly define what you want, you can enforce it.
[Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) for
JavaScript will automatically detect orphan files, cyclic dependencies, or
imports that haven't been defined in the package file.

### Avoid duplicated code

**Every line of code is a liability**; most software cost comes from
maintenance. From my experience, the sweet spot is to allow 5% duplicated code
in a code base. Being too aggressive about avoiding any duplication can also
force unnecessary abstractions. These copy/paste detector tools were first
introduced in the Java ecosystem 20 years ago. Depending on the verbosity of the
language, you will tune them to your liking, but in JavaScript I like to limit
duplication to **100 tokens**: `jscpd src test --min-tokens 100 --threshold 5`.

## How can we force reliability

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
When you are just testing something out, you don't need to write tests. The most
important thing is putting a prototype in front of the customer as soon as
possible. As you start to grow your user base, you will cover the most critical
paths with tests. Eventually, as you reach the later stages of a project, when a
bug impacts thousands or millions of customers, you will shift toward adding
more and more coverage.

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
has been challenged a lot over the years. I would always encourage pushing for
tests that give you **maximum confidence as long as they are fast**. So instead
of aiming for a certain distribution, for every feature you want to verify,
think about what test can bring you the most confidence. In my experience
[unit tests can take you a long way in many situations](/blog/writing-good-unit-tests/).
I like to cover happy paths with UI tests, have **100% unit test coverage**, and
develop the habit to add a test for every bug reported by a customer.

## How can we force performance

Again, we just have to find the metrics to objectively track performance. If you
are building a game, you could probably measure frames per second. If you are
writing a web app, you can probably check the time it takes for your page to
load or react to every user action
([web vitals](https://web.dev/articles/vitals/)).

If performance worries you, then add a stress test. For example, if you are
running a game you could create a test where a bot plays the game for 3 minutes
and you verify that there are no FPS drops. If you are testing a web app,
generate a lot of dummy data and measure the loading times.

## Working in small batches

The smaller the changes, the easier they are to review, and once deployed, if
you find a problem, the easier it will be to identify the cause. That is why I
think enforcing a limit on change size can help a lot. It encourages shipping in
_small batches_, which shortens the feedback loop. The latest
[DORA report](https://dora.dev/research/2025/dora-report/) encourages working in
small batches and the latest
[DevEx report](https://linearb.io/resources/software-engineering-benchmarks-report)
shares metrics showing that elite teams have PR sizes **under 90 lines of
code**.

## What's left?

I honestly don't know how you can have these checks in place, solid tests, and
still be able to get AI slop. **These processes are the same ones we've been
using to produce solid software for decades, long before AI was involved.**

## Conclusion

Right now AI agents are mainly helping in the development stage when you are
converting design requirements into code, the processes and checks we've covered
will help you produce solid code, but there is still much more to software
lifecycle. You have to understand customer needs and translate them into a
working solution. You also have to operate the software, have correct monitoring
in place, make sure the costs are in budget, migrations are handled properly,
etc. Understanding how to design, build and operate software still is required
even if coding is a thing of the past.

[^1]:
    [The E-myth Revisited](https://michaelegerbercompanies.com/product/the-e-myth-revisited/)
    really struck me on the importance of processes to reliably manage a
    business.
