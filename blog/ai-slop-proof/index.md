# AI Slop Proof

Why does McDonalds taste the same in every country, how have they managed to
reliable produce hamburgers all over the world with employees that come and go
and imperfect machines. I'll tell you how, they've exactly defined the work that
needs to be done to produce those burgers.

Detailing every aspect of the business, creating a replicable model from having
a clean kitchen to verifying every ingredient is fresh[ˆ1]. Sometimes with the
use of automatism like friers which automatically control the temperature of the
oil and other times with good processes to prevent the most common mistakes,
like double checking the ingredients of the burger before wrapping it.

Enough about burgers I'm getting hungry already, lets get back to software.
There's been a lot of noise about AI, specially about AI slop? What is AI slop
anyway? overcomplicated code? unreliable code? if you struggle to define it you
will struggle to deal with it.

## The good old times

Before AI came to produce bad quality code, every line of code was perfect and
software was reliable from the get go, I mean sometimes
[databases in production got deleted randomly](https://about.gitlab.com/blog/gitlab-dot-com-database-incident/),
[critical bugs in the most important security libraries are unnoticed for years](https://www.heartbleed.com/)
or a
[firewall update crashed 8 million devices](https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages).
But these are just minor exceptions... who are we trying to fool? As humans we
constantly make mistakes. Now with AI allow us to generate code faster and thus
also make mistakes faster.

## The bright side

Its not all bad NASA's Space Shuttle Flight Software ran 30 years close to no
defects, SQLite is the database of choice in billion of devices also has been
running for decades with an spotless record or the Linux kernel even with its
massive scale 30+ millions of lines of code and thousands of contributors powers
most of the worlds servers has imprerssive stability. All of these projects have
achieved the McDonald's levels of stability and reliability.

## Process over speed

How do these great projects deal race conditions, type errors, missing bounds
checks, or architectural blind spots? with rigorous testing, peer review,
monitoring but most importantly, setting a culture which prioritizes
correcteness over shippping fast.

## How can we force good code

Good code is simple and direct therefore it is easy to read an understand. Lets
try and put processes in place to achieve that goal.

### Format

Lets start with the most basic stuff. A consistent format makes code easier to
read so make sure you have a pre-commit hook or if you are working with a team
have a CI run that blocks PRs from being merged if they don't. Every language
nowadays have their format command in JavaScript you can rely on
[Prettier](https://prettier.io/): `prettier --check .`. Remember it isn't
important that you prefer double quotes to single quotes or vice versa we just
need to be consistent so stick to the defaults.

### Lint

Every programming language has its good and bad parts. For example, Like
JavaScript's type coercion, silently converting types when comparing: `0 == "0"`
is `true`, but `0 == ""` is also `true`, yet `"0" == ""` is `false`, we can just
use the strict equality check `===`. You can easily silence errors
`catch (error) {}` or defined infinite loops `while(true)`. In rare cases we
need these language features so lets avoid them entirely with a linter, which
will handle most common issues to avoid shooting yourself in the foot. There are
many linters out there for example in a web based project you could use
[ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/):
`eslint . && stylelint .'`

### Typechecking

Typed languages allow finding mistakes early, like trying to access properties
that don't exist of missing arguments in functions. Even if you aren't using a
typed language you can use tools to check the implied types for example in
JavaScript you can use [TypeScript](https://www.typescriptlang.org/) to check
the JavaScript code ([Sorbet](https://sorbet.org/) for Ruby,
[Python type hints](https://docs.python.org/3/library/typing.html), etc.).

### Limit file size

Another easy way to make code easier to read is to limit the lines of code per
file, it forces to split and group functionality under a descriptive file name.
It is much easier to read 500 line files than 3000 line files and it is less
likely that you read parts which you don't need to understand the specific path
you are trying to understand, similar to humans it helps AI too use less conext.
In Eslint you can easily set the
[`max-lines`](https://eslint.org/docs/latest/rules/max-lines) to the limit that
makes more sense for your programming languages, some languages like Java are
much more verbose and higher limits are probably justified.

### Limit cyclomatic complexity

Even if you limit the lines of code it is still pretty easy to cram a lot of
logic into a function. Unfortunately our minds have a limit of the amount of
branches you can have fit in your working memory, if there are too many soon you
will need to start using a piece of paper to track it all. I personally like to
limit the [complexity](https://eslint.org/docs/latest/rules/complexity) to 10,
which is also easy to do in many linters.

### Avoid bad architeture

At a higher level, even if you have small simple files you would probably like
to avoid cyclic dependencies or that your UI code is directly calling the
database, or maybe you have separate boundaries you want to enforce. There is
also a tool for that, if you clearly define what you want you will get it.
[Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) for
JavaScript will automatically detect orphan files, cyclic dependencies or
imports that haven't been defined in the packages file.

### Avoid duplicated code

Every line of code is a liability, most of software cost comes from mantainance.
From my experience the sweetspot is to allow a 5% of duplicated code in a code
base, being to aggressive to avoid any duplicated code can also force to
unnecessary abstractions. This copy/paste detector tools were first introduced
in the Java ecosystem 20 years ago, depending on the verbosity of the language
you will tune to your liking but in JavaScript I like to limit the duplication
to 100 tokens: `jscpd src test --min-tokens 100 --threshold 5`.

## How can we force reliability

I feel compelled to reference the remarkable fact that
[SQLite](https://sqlite.org/hirely.html) has 600 times more code in its tests
than in its implementation. The founder even said that once they forced 100%
[MCDC coverage](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)
the bugs stopped comming, this is mandatory in aviation software under the
process [DO-178C](https://en.wikipedia.org/wiki/DO-178C).

### How much do you really need?

I'm a fan of high reliability but there clearly tradeoffs, if no one uses your
software it clearly doesn't matter if it is reliable. Depending on the state of
the and type of project, different levels of reliability make sense. I really
like how Kent Beck describe the typical phase a project goes through:
[Explore, Expand and Extract](https://medium.com/@kentbeck_7670/fast-slow-in-3x-explore-expand-extract-6d4c94a7539).
When you are just testing out something you don't need to write tests, the most
important thing is putting a prototype in front of the customer as soon as
possible. As you start to grow your user base you will cover the most critical
paths with tests and eventually as you reach the later stages of a project when
a bug impacts thousands or millions of customers you will shift to add more and
more coverage.

Similarly if you are in the health sector where your mistakes be tragic you will
have more tests than if you are building a more standard web app.

### Enforce branch coverage

You can easily measure and enforce branch coverage, for example in Node you can
use [C8](https://github.com/bcoe/c8): `npx c8 --branches 80 node --test`. Take
into account that you can measure coverage not only of unit test but also of e2e
tests, once the code is instrumented you can record the coverage no matter how
it runs. You can also merge coverage reports, I tend to cover happy paths in e2e
test and then cover edge cases in unit tests.

### Types of tests

A decade ago the
[Testing Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
started becomming a thing, Google started mentioning it and it went viral. The
idea is simple, on one side unit tests are fast to run, provide the maximum
isolation but less confidence and on the other side UI tests mimic the real user
behavior which makes them slow and flaky compared to unit tests but give maximum
confidence. There are lots of in betweens and the pyramid distribution has been
challenged a lot during the years. I would encourage always to push for creating
tests that give you maximum confidence as long as they are fast. So instead of
aiming for a certain distribution, for every feature you want to verify think
what test can bring you the most confidence. In my experience
[unit tests can take you a long way in many situations](/blog/writing-good-unit-tests/).
I like to cover happy paths with UI tests and have 100% unit test coverage and
develop the habit to add a test for every bug reported by a customer.

## How can we force performance

Again we just have to find the metrics to objectively track your performance, if
you are building a game you could probably measure the frames per second if you
are writting a web app you can probably check the time for your page to load or
react on every user action ([web vitals](https://web.dev/articles/vitals/)).

If perfomance worries you then add a stress test, for example: if you are
running a game you could create a test where a bot plays the game for 3 minutes
and you track there are no FPS drops. If you are testing a web app generate a
lot of dummy data and measure the loading times.

## Working in small batches

The smaller the changes the easier it is to review and once deployed if you find
a problem the easier it will be to find the cause of the problem. That is why I
like enforcing a limit on the change size can help a lot. It encourages shipping
a lot of small changes which shortens the feedback loop. The latest
[DORA report](https://dora.dev/research/2025/dora-report/) encourages working in
small batches and the latest
[DevEx report](https://linearb.io/resources/software-engineering-benchmarks-report)
shares metrics of elite teams have PR sizes **under 90 lines of code**.

## What's left?

I honestly don't know how can you have these checks in place, solid tests and be
still be able to get AI Slop. These processes are the same we've been using to
produce solid software before AI was used for decades.

## Conclusion

Right now AI agents are mainly helping in the development stage when you are
converting design requirements into code, the processes and checks we've covered
will help you produce solid code but still there is much more to software
engineering. You have to know how to understand customer needs and translate
them in to a working solution.

[^1]:
    [The E-myth Revisited](https://michaelegerbercompanies.com/product/the-e-myth-revisited/)
    really struck me on the importance of processes to reliable manage a
    business.
