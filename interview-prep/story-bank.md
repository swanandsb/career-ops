# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Production AI Delivery] UiPath Process Mining — Mortgage & Fraud/Claims
**Source:** Report #060 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Mortgage origination and fraud/claims workflows at a financial-services client had unmeasured cycle-time bleed and SLA violations with no process visibility.
**T (Task):** Deploy UiPath Process Mining inside the client's live systems; surface deviation patterns and hand off to automation team.
**A (Action):** Instrumented live workflows, built "as-is" process visualizations, identified deviation triggers, built Streamlit/Flask predictive analytics service for standardized retraining and self-service decision support.
**R (Result):** 26.4% cycle-time reduction; 37.2% regulatory SLA compliance improvement; 24.7% manual-intervention reduction; 10,000+ annual hours saved.
**Reflection:** Earlier investment in process documentation before deployment would have cut the discovery phase by 30%. Now it's the first thing I scope.
**Best for questions about:** Production systems inside customer environments, client-facing delivery, measurable impact, process automation, AI in regulated industries

---

### [Enterprise Scale / Ambiguity] Celonis OCPM — $60M+ Customer Savings
**Source:** Report #060 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Enterprise clients with siloed process data, manual exception handling, and no audit trail. No existing deployment playbook.
**T (Task):** Lead end-to-end Celonis deployments: kickoff → model build → validation → cross-functional adoption.
**A (Action):** Developed, documented, validated, and streamlined 91TB of data models/analyses; built value roadmaps pairing process insights with UiPath automation priority backlog; managed execution from discovery through adoption.
**R (Result):** $60M+ in customer-savings initiatives supported across engagements.
**Reflection:** Adoption is harder than deployment. Would prioritize stakeholder alignment in week 1, not week 8. Delivery without adoption is a dashboard no one opens.
**Best for questions about:** Navigating ambiguity, complex organizations, cross-functional leadership, enterprise scale, finding impact

---

### [Production LLM / GenAI] Local-First RAG Pipeline
**Source:** Report #060 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Private-corpus document QA needed sub-10s latency and high retrieval precision without cloud dependency or data egress.
**T (Task):** Build a production-grade RAG system with local inference, hybrid retrieval, agent loop, and measurable eval.
**A (Action):** LangGraph orchestration → Ollama local inference → embedded Qdrant → hybrid BM25 + dense retrieval → cross-encoder rerank → Plan-Execute-Verify agent loop. Removed Docker from critical path. Added retrieval-stage precision/recall eval loop.
**R (Result):** End-to-end latency 28.7s → under 10s. Retrieval precision improved via rerank. Agents handle multi-step queries with verifiable output.
**Reflection:** The eval loop (measuring precision/recall at retrieval, not just final answer quality) was the unlock. Without it, I was optimizing blind. Eval infrastructure is not a nice-to-have — it's what makes optimization possible.
**Best for questions about:** LLM/GenAI engineering, production systems, agent development, technical depth, latency optimization, retrieval-augmented generation

---

### [Repeatable Patterns / Documentation] Streamlit/Flask Predictive Service
**Source:** Report #060 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Different client teams at Ashling had one-off notebooks for predictive tasks — no reuse, no retraining standard, analyst bottleneck.
**T (Task):** Standardize ML ops into a documented, repeatable service business users could run.
**A (Action):** Built Streamlit/Flask service with data consolidation, retraining hooks, API-based prediction, and revenue-per-head self-service analytics. Documented the pattern for reuse across clients.
**R (Result):** Business users run predictions independently; pattern reused across clients; analyst bottleneck removed.
**Reflection:** Naming it "predictive service" instead of "notebook" changed how leadership budgeted for it. Framing shapes investment. Call the thing what it is at production quality, even early.
**Best for questions about:** Scalable delivery, documentation, productionizing ML, stakeholder communication, pattern identification
