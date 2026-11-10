// Public CV, domain-neutral cut of cv-maestro.md (sections 2e, 11b, 4-9).
// Rebuild with `pnpm cv`. Never add a student ID or client names (the test suite checks the PDF).

#let accent = rgb("#2b59ff")
#let soft = rgb("#4a4d55")

#set document(title: "Juan Rodrigo Ferro - CV", author: "Juan Rodrigo Ferro")
#set page(paper: "a4", margin: (x: 1.5cm, y: 1.1cm))
#set text(font: ("Helvetica Neue", "Helvetica", "Arial"), size: 8.9pt, fill: rgb("#111214"))
#set par(leading: 0.55em, spacing: 0.7em)
#set list(indent: 0.2em, body-indent: 0.5em, spacing: 0.45em)

#let section(title) = {
  v(0.55em)
  text(size: 10.5pt, weight: "bold", fill: accent, title)
  v(-0.45em)
  line(length: 100%, stroke: 0.5pt + rgb("#e4e6ea"))
  v(-0.15em)
}

#let role(title, place, dates) = {
  grid(
    columns: (1fr, auto),
    text(weight: "bold", title) + text(fill: soft, [ · #place]),
    text(fill: soft, dates),
  )
}

#let project(title, status) = {
  v(0.2em)
  text(weight: "bold", title) + if status != [] { text(fill: soft, size: 8.6pt, [ · #status]) }
}

// Header
#text(size: 20pt, weight: "bold")[Juan Rodrigo Ferro]
#v(-0.6em)
#text(size: 11pt, fill: soft)[Software engineer · production GenAI, AWS/GCP architecture, full-stack TypeScript & Python]
#v(-0.3em)
#text(size: 8.8pt)[
  Sydney, NSW · ferro.rayon\@gmail.com ·
  #link("https://geekycrescent.github.io")[geekycrescent.github.io] ·
  #link("https://github.com/GeekyCrescent")[github.com/GeekyCrescent] ·
  LinkedIn: juan-rodrigo-ferro-rayón-7a0039334
]
#v(-0.3em)
#text(size: 8.8pt, fill: soft)[Student visa with work rights (48 h/fortnight during session, unrestricted in breaks)]

#section[Summary]
Software engineer who ships production systems end-to-end: LLM agents with tool-calling on AWS, Next.js applications with their own design systems, and the event-driven cloud architecture underneath. I work in regulated environments where the audit trail, the data-residency question and the cost model are part of the deliverable, and I take engagements from the first client meeting to a signed-off document set. I measure before I conclude.

#section[Experience]
#role[Software Engineer, Cloud & GenAI][BWR, software consultancy (Mexico), remote from Sydney][2025 - present]

#project[LLM agent with tool-calling][in production]
- Own the AI and serverless layer of a conversational booking agent: Amazon Bedrock Agent, Lambda action group with 4 tools, SQS FIFO, HMAC-signed calls to the product backend.
- Turned a live pilot into 5 shipped fixes; 3 were prompt changes that unit tests cannot cover, which required structured live conversation testing. Specified caller identity from webhook metadata only.

#project[Speech-to-text + LLM cost model][decision memo, system in production]
- Showed transcription is 80-99.9% of pipeline cost and recommended migrating it, not the LLM; modelled 6×-36× savings with break-even by volume, and gated the migration on a pilot because of Whisper's silence-hallucination risk.

#project[Event-driven integration with immutable audit][competitive tender, outcome pending]
- Owned the AWS design: mTLS ingress, format translation on Lambda, SQS FIFO, EventBridge, S3 Object Lock with hash chaining. 7 decisions with alternatives, 65 verified sources; committed a measured p95 SLO instead of an unbacked guarantee. Gap analysis found 4 disqualifying risks and 17 missing questions.

#project[Document AI with a human in the loop, federal agency][requirements and architecture]
- Took requirements from a client meeting to a v2.0 validated by a legal specialist, with evidence marking on every requirement; designed delivery waves where the first uses no AI as the permanent degraded path; 3 architecture variants, 3 ADRs, 15 technical decisions.

#project[Next.js web application][in development, deployed to QA]
- Built all 5 screens, the design system and Auth.js v5 authentication with lockout; led a security audit remediation, 20 of 24 findings closed (CSP nonces, rate limits, append-only audit via triggers).
- Diagnosed a production data bug by measurement: 13 rows to 5, payload 1,331 KB to 461 KB. Codebase at 842 tests green.

#project[Other platform work][]
- Backward-compatible API reorganisation in a multi-tenant PHP/Angular platform, keeping old routes alive for installed mobile clients; React Native features shipped with OTA release sequencing; data-platform architecture for 130 TB with a residency assumption invalidated by verification; found a seven-figure double-count in a commercial estimate before it reached the client.

#section[Independent projects]
#project[Factotum: infrastructure for AI coding agents][open source, daily use]
- Launch, follow and approve Claude Code agents from a phone PWA on your own hosts: modular core, headless CLI, Web Push approvals, append-only session logs. 1,607 tests, 16 ADRs.

#project[Book-collection RAG chatbot][volunteer, delivered]
- Qdrant + reranking for a community group of about 300 people; evaluated with deliberately confusable sources, then with 9 administrators.

#section[Education]
#role[Master of Information Systems Management][Macquarie University, Sydney][2026 - 2027 (in progress)]
#text(fill: soft, size: 8.8pt)[Security management (ISO 27001/27005, NIST CSF), project and risk management, enterprise strategy, IS design.]
#role[B.Eng. Computer Technology (Ingeniería en Tecnologías Computacionales)][Tec de Monterrey][2023 - 2027 (in progress)]

#section[Certifications]
AWS Certified Generative AI Developer, Professional · Oracle OCI 2025 Generative AI Professional · AWS Certified AI Practitioner · Oracle OCI 2025 AI Foundations Associate · AWS Certified Cloud Practitioner

#section[Skills]
#grid(
  columns: (auto, 1fr),
  column-gutter: 0.8em,
  row-gutter: 0.45em,
  text(weight: "bold")[Cloud], [AWS (Lambda, API Gateway, SQS, EventBridge, S3 Object Lock, KMS, Bedrock, Transcribe), GCP (Vertex AI, BigQuery, Cloud Run), Oracle Cloud],
  text(weight: "bold")[AI], [LLM agents and tool-calling, RAG, prompt regression testing, ASR, model cost and break-even modelling],
  text(weight: "bold")[Engineering], [TypeScript, Python, Node.js, PHP, SQL · React, Next.js, React Native · PostgreSQL, Redis · Vitest, Playwright, TDD, ADRs],
  text(weight: "bold")[Languages], [Spanish (native), English (full professional), German (limited working)],
)

#section[Awards]
DigiEduHack winner, 2025.
