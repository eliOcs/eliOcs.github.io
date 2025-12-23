# Blog

Goal "Silicon Valley-caliber leader based in Europe.".

- "How we built AI-powered review at Filestage"
  BRIEF:
  When we built AI-powered image analysis for Filestage, the "perfect" solution would have been a custom-trained model, GPU infrastructure, a dedicated vector database, and a new ML pipeline. That would have taken months.
  We scoped down to one specific use case: checking for mandatory images. In packaging design, certain icons must always be present, eg: recycling symbols, vegan certifications, compliance marks. Our AI reviewer would automatically verify these.

We shipped in weeks by making deliberate trade-offs:

- Used DINOv2 (open-source vision model) instead of training our own: accurate enough for real customer files, skipped months of ML work
- Ran inference on CPU instead of GPU: sufficient for our volume, reused existing background job infrastructure with zero new ops
- Stored feature vectors in MongoDB instead of a dedicated vector database: leveraged its recently added vector search, no new infrastructure to operate
- Simple cosine similarity with a fixed threshold instead of sophisticated matching logic

The goal was real user feedback fast. We validated the approach worked, discovered edge cases from actual customer documents, and learned where accuracy needed improvement.

Next steps if usage grows: GPU inference for throughput and video support. Our trade-offs made sense: we shipped, learned, and can invest where it actually matters.

- Realibility mesures that work: monitoring, alerts, health metrics, reduce noise with SLO (advanced). Root cause analysis.
- Writing good unit tests: mock the edges of your system not the implementation details or internal layers. Don't write unit tests per function or file write them per feature or behavior. In memory databases. HTTP mocking libraries. Why I dislike jest. Testing that you can trust. Why I think 100% coverage is a good idea.
- Default to action, product minded
- Pen tests in startups
- Moving up to enterprise customers: SSO, compliance, security, audits
- Hiring remotely
- Roles and permissions:
  https://github.com/PostHog/posthog/blob/master/ee/models/rbac/access_control.py
  https://www.figma.com/blog/how-we-rolled-out-our-own-permissions-dsl-at-figma/

# Resume

- B2B Contractor (Autónomo)
- Add testimonials

# Improvements

The Conversion Asset: "How I Build Engineering Culture"
Optimization Requirement: It needs to be tightly coupled with the resume. The resume should link directly to this post as evidence of "Leadership Philosophy."

3.3 The Technical Credibility Asset: "Simple JavaScript Toolkit"
Optimization Requirement: This post should be shared in niche communities (e.g., functional programming subreddits, JavaScript newsletters) rather than broad channels.

# Promotion

Show more blog posts on the end of the page.

Best time to post:
12:00 PM and 3:00 PM CET
The comment section on Hacker News is where the real value is captured. The author must remain active in the thread for the first 4-6 hours.

r/ExperiencedDevs: This is a high-value community for Senior+ engineers and managers. The content here must be framed as a "Case Study" or "Lessons Learned," not a blog promotion.

Strategy: Post a text-only thread titled "Case Study: Integrating AI agents into a legacy migration workflow (900+ files)." Copy the core insights of the blog post into the Reddit thread itself. Do not force users to click away to read the value. Put the link at the bottom: "Full write-up with code samples here: [Link]." This "value-first" approach is respected and often leads to high engagement.

r/EngineeringManagers: This is the target for the "Culture" post.

Strategy: Start a discussion. Title: "How do you measure 'culture' in a remote team? My attempt at a framework." Share the key points from the "How I Build Engineering Culture" post (Kindness, Pragmatism). Ask for feedback. This positions the candidate as a thought leader seeking peer review, which is a powerful networking stance.

r/reactjs / r/javascript: These are larger, noisier communities. Direct links are more acceptable here, but the title must be technical. "We migrated to RTL v14 using this specific AI workflow.".

# Optimizations

The "Available" Widget: Implement a sticky banner or a prominent sidebar widget on the blog.

Copy: "🟢 Status: Open for Business. I help remote organizations scale engineering culture and modernize legacy stacks. Available for B2B Contracting & Interim Leadership roles.".

Psychology: The use of "Discovery Call" rather than "Interview" frames the interaction as a B2B consultation, which immediately elevates the candidate's perceived status and justifies a higher rate.

Contextual CTAs: At the end of the "AI Migration" post, add a specific CTA: "Struggling with a massive technical debt repayment? I specialize in designing high-velocity migration strategies. Let's talk about your backlog." This targets the specific pain point the reader just experienced.

Headline Remodeling: Instead of just "Head of Engineering," the resume headline should be "Head of Engineering | Distributed Systems & Remote Leadership | AI-Driven Modernization."

Quantification of Impact: US resumes are obsessed with metrics. The current description of the Filestage role is good ("reduced codebase complexity by 25K LOC"), but it can be stronger.

Add: "Managed a fully remote engineering team across X time zones, maintaining 99.9% uptime while increasing feature velocity by Y%."

Add: "Architected the AI-assisted migration workflow that reduced a projected 3-month timeline to 7 days, saving approx. €XXk in engineering hours.".

The "Remote" Keyword: Ensure the word "Remote" appears frequently in job titles and descriptions. "Senior Software Engineer (Remote)" is better than just "Senior Software Engineer." This reassures the ATS (Applicant Tracking System) and the recruiter that the candidate is a "remote native".

# 6.3 The "Work With Me" Page

Create a dedicated page (/services or /hire-me) that acts as a sales brochure.

Value Proposition: "I bridge the gap between technical execution and strategic business goals."

Engagement Models: Explicitly list:

Fractional CTO / Interim Head of Eng: For startups needing immediate leadership.

Staff+ Individual Contributor: For scale-ups needing high-level architectural hands.

Logistics: "Based in Madrid (CET). Available for 4 hours of daily EST overlap. Seamless B2B invoicing via US-compliant contractor agreements." This answers the "logistics" question before it is even asked.

# Promoting in newsletters

Software Lead Weekly: Curated by Oren Ellenbogen. This is the "bible" for engineering managers.

Action: Submit the "How I Build Engineering Culture" post directly via the suggestion form or email. The focus on "Kindness" and "Pragmatism" aligns perfectly with the newsletter's ethos.

Pointer.io: A reading club for developers and leaders.

Action: Submit the "Simple JavaScript Toolkit" or the "AI Migration" post. They value high-quality, non-promotional technical writing.

The Pragmatic Engineer (Gergely Orosz): The largest newsletter in the tech space.

Action: While direct submission is difficult, engaging with Gergely's content on LinkedIn/Twitter by sharing the "AI Migration" case study as a response to his posts on "Developer Productivity" or "AI Tools" can attract his attention.

# Positioning for Head of Engineering roles

8.1 The "Manager of Managers" Signal
In the "Culture" post and resume, emphasize experience with hiring, firing, budgeting, and strategy.

Content Tweak: Add a section to the Culture post about "Making Hard Decisions." Discuss how to handle underperformance or budget cuts with kindness. This shows the "grit" required for leadership roles.

8.2 The "Business Alignment" Signal
Engineers talk about code; leaders talk about business.

Content Tweak: In the "AI Migration" post, translate the technical achievement into business terms. "By reducing the migration time, we unblocked the product roadmap for Q4, allowing the sales team to demo the new features 2 months early." This language resonates with CEOs who sign the €120k checks.
