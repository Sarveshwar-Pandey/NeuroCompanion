# NeuroCompanion

> A trustworthy, multi-agent personal cognitive companion for memory support, daily orientation, cognitive engagement, safety triage, and caregiver communication.

NeuroCompanion is a project build on**Cognizant AI Lab framework Neuro-SAN**  The product is designed around one central idea:

> **Use AI to help a person remember, orient, engage, and stay connected — while keeping sensitive decisions governed by deterministic software and humans.**

The application has two deliberately different experiences:

- **Patient experience:** calm, friendly, simple, reassuring, and low cognitive load.
- **Caregiver experience:** professional, information-dense, analytical, and focused on observable changes, alerts, summaries, and trends.

The underlying platform uses Neuro-SAN for agent orchestration, FastAPI as the Backend-for-Frontend (BFF), Python domain services, SQLite for the current development database, and a React/TypeScript/MUI application for the product UI.

---

## Table of Contents

1. [Why NeuroCompanion](#why-neurocompanion)
2. [Problem](#problem)
3. [What the Product Solves](#what-the-product-solves)
4. [Core Capabilities](#core-capabilities)
5. [Architecture](#architecture)
6. [Six-Agent System](#six-agent-system)
7. [Coded Tools and Domain Services](#coded-tools-and-domain-services)
8. [Safety Architecture](#safety-architecture)
9. [Personal Cognitive Context](#personal-cognitive-context)
10. [Governance and Trust](#governance-and-trust)
11. [Current Tech Stack](#current-tech-stack)
12. [Repository Structure](#repository-structure)
13. [Prerequisites](#prerequisites)
14. [Installation](#installation)
15. [Environment Configuration](#environment-configuration)
16. [Running the Project](#running-the-project)
17. [API Reference](#api-reference)
18. [Neuro-SAN Commands](#neuro-san-commands)
19. [Testing and Validation](#testing-and-validation)
20. [Hackathon Demo Flow](#hackathon-demo-flow)
21. [Current Demo Patient](#current-demo-patient)
22. [Important Current Limitations](#important-current-limitations)
23. [Troubleshooting](#troubleshooting)
24. [Development Rules](#development-rules)
25. [Roadmap](#roadmap)
26. [Future Architecture](#future-architecture)
27. [Safety and Non-Clinical Disclaimer](#safety-and-non-clinical-disclaimer)

---

# Why NeuroCompanion

Cognitive-support software often has one of two problems:

1. It is too simplistic to be genuinely useful.
2. It is too complex and clinical for the person actually using it.

NeuroCompanion tries to bridge that gap by separating the **human experience** from the **AI/engineering complexity underneath it**.

The patient does not need to understand agents, HOCON, tools, databases, vector search, or safety policies.

The system handles those internally and presents a simple experience such as:

> **Good morning, Sukhvinder.**  
> **Here is what is happening next.**

A caregiver, meanwhile, needs a very different view:

> **How has Sukhvinder been doing?**  
> **What changed?**  
> **Does anything need attention?**

The attached project plan explicitly separates those responsibilities and positions the caregiver layer as an information-compression mechanism rather than a diagnosis engine.

---

# Problem

People experiencing memory or cognitive difficulties may struggle with everyday tasks that are not inherently complicated but become difficult when context, memory, timing, and orientation are lost.

Examples include:

- remembering who someone is
- remembering relationships
- recalling what happened recently
- remembering what is supposed to happen today
- keeping track of routines
- deciding what to do next
- remembering appointments or tasks
- maintaining engagement through appropriate cognitive activities
- recognizing when something feels unusual or unsafe
- communicating important changes to a caregiver

The caregiver has the opposite problem: there can be **too much fragmented information** and not enough meaningful context.

NeuroCompanion therefore treats the problem as a combination of:

```text
PERSONAL MEMORY
       +
ORIENTATION & ROUTINE
       +
COGNITIVE ENGAGEMENT
       +
SAFETY TRIAGE
       +
CAREGIVER COMMUNICATION
       +
TRUST / GOVERNANCE
```

---

# What the Product Solves

NeuroCompanion combines multiple focused agents around a single person-centric context layer.

### For the patient

- remembers important people and relationships
- helps answer personal-memory questions
- explains what is happening today
- helps with routines, tasks, and reminders
- provides structured cognitive activities
- detects potential safety concerns
- presents support in simple language
- provides a consistent conversational companion

### For the caregiver

- compresses many observations into useful summaries
- surfaces recent safety observations
- exposes activity and weekly trends
- presents notifications
- distinguishes observable events from interpretation
- highlights situations that may require human review
- gives a clearer view of the patient's recent context

### For engineering / enterprise review

- multi-agent orchestration
- deterministic domain tools
- role-aware data access
- safety policy separation
- auditability
- observability
- clear architectural boundaries
- a FastAPI application boundary between UI and AI runtime

---

# Core Capabilities

## 1. Personal Memory

The Personal Memory Agent is responsible for retrieving and working with personal information such as:

- people
- relationships
- autobiographical facts
- events
- preferences
- episodic context

The key design principle is:

> **Never invent a memory when reliable evidence is unavailable.**

The system should prefer an honest uncertain answer over a plausible fabricated memory.

---

## 2. Routine Support

The Routine Support Agent helps with the person's present and upcoming day.

Conceptually:

```text
What time is it?
       ↓
What normally happens now?
       ↓
What is scheduled?
       ↓
What remains?
       ↓
What is relevant right now?
```

Routine logic belongs in deterministic tools/services wherever possible.

---

## 3. Cognitive Engagement

The Cognitive Engagement Agent selects and presents structured activities based on available context and previous performance.

The current activity subsystem includes:

- an activity library
- activity storage
- activity history
- performance logging
- cognitive service/repository logic

The frontend should present one activity at a time rather than a dense analytics screen.

---

## 4. Safety Triage

Safety is intentionally split into two layers.

### Layer 1 — Detection / assessment

The Safety Agent interprets the current situation and may consider:

- acute statements
- repeated confusion
- unusual behavioral deviation
- routine deviation
- orientation loss
- possible falls / wandering / safety concerns
- baseline context

### Layer 2 — Deterministic policy

A deterministic policy engine decides the permitted next step.

Conceptually:

```text
LOW
 ↓
ASSIST

MODERATE
 ↓
VERIFY

HIGH
 ↓
CAREGIVER

EMERGENCY
 ↓
HUMAN / CONFIGURED EMERGENCY PATH
```

The LLM does **not** directly execute emergency action.

This is one of the most important trust properties of the system.

---

## 5. Caregiver Communication

The Caregiver Communication Agent turns detailed patient-side observations into concise caregiver information.

Its intended outputs include:

- daily summaries
- weekly summaries
- significant changes
- safety notifications
- appointment concerns

The caregiver experience should expose **authorized summaries**, not a raw personal-memory dump.

---

# Architecture

The current application is organized around the following flow:

```text
                         PATIENT / CAREGIVER
                                  │
                                  ▼
                       React / TypeScript UI
                                  │
                                  ▼
                         FastAPI BFF Layer
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             Structured APIs              Neuro-SAN
                    │                           │
                    ▼                           ▼
               Domain Services            Front Agent
                    │                           │
                    ▼                ┌──────────┼──────────┐
                  SQLite              ▼          ▼          ▼
                                  Memory      Routine   Cognitive
                                       \         |          /
                                        \        |         /
                                         ▼       ▼        ▼
                                           Safety
                                              │
                                              ▼
                                         Caregiver
```

A more detailed conceptual architecture is:

```text
┌───────────────────────────────────────────────────────────┐
│                     PRODUCT EXPERIENCE                    │
│                                                           │
│  Patient UX                         Caregiver UX           │
│  - Home                             - Dashboard            │
│  - Companion                        - Safety               │
│  - Memories                         - Trends               │
│  - Activities                       - Notifications        │
│  - Help                             - AI / System Trace    │
└───────────────────────┬───────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────┐
│                         FASTAPI BFF                       │
│                                                           │
│  identity / request context / HTTP / validation / CORS   │
└───────────────┬───────────────────────────┬───────────────┘
                │                           │
                ▼                           ▼
         Structured APIs                Neuro-SAN
                │                           │
                ▼                           ▼
       Domain Services               Front Orchestrator
                                            │
             ┌──────────────────────────────┼────────────────┐
             │              │               │       │        │
             ▼              ▼               ▼       ▼        ▼
         Memory         Routine         Cognitive Safety Caregiver
             │              │               │       │        │
             └──────────────┴───────────────┴───────┴────────┘
                                    │
                                    ▼
                              Shared data layer
                                    │
                                    ▼
                                  SQLite
```

The project plan intentionally keeps clear boundaries between:

```text
Neuro-SAN Agents
→ what should happen?

CodedTools / Policy
→ what is allowed?

Data / Memory / RAG
→ what is known?

RBAC / Governance
→ who may access it?
```

---

# Six-Agent System

## Agent 1 — Front Orchestrator

The Front Agent is the conversational entry point.

Its job is to:

```text
Understand request
       ↓
Determine relevant domains
       ↓
Delegate
       ↓
Collect results
       ↓
Resolve context
       ↓
Check safety where relevant
       ↓
Compose response
```

The architecture supports selective routing rather than routing every request through every agent.

Example:

```text
"Who is Priya?"
        ↓
Memory Agent
```

versus:

```text
"Priya is coming at 4. What should I do before she arrives?"
        ↓
Memory Agent + Routine Agent
```

---

## Agent 2 — Personal Memory Agent

Responsibilities:

- retrieve personal information
- resolve relationships
- retrieve events
- maintain memory context
- distinguish evidence from inference
- avoid false memories

---

## Agent 3 — Routine Support Agent

Responsibilities:

- current-day orientation
- routines
- tasks
- reminders
- scheduled events
- date/time context

---

## Agent 4 — Cognitive Engagement Agent

Responsibilities:

- choose a suitable activity
- use structured activity definitions
- consider previous activity history
- track performance via deterministic tools
- provide an appropriately scoped activity experience

---

## Agent 5 — Safety Triage Agent

Responsibilities:

- interpret safety-related language
- retrieve baseline context
- inspect recent events
- produce a structured safety signal
- request policy evaluation

The Safety Agent does not own the final escalation decision.

---

## Agent 6 — Caregiver Communication Agent

Responsibilities:

- summarize patient observations
- produce caregiver-friendly updates
- identify significant changes for review
- generate notification content
- respect caregiver authorization boundaries

---

# Coded Tools and Domain Services

Neuro-SAN agents are intentionally separated from application business logic.

The basic execution chain is:

```text
Agent
  ↓
CodedTool
  ↓
Domain Service
  ↓
Repository / DB
```

A CodedTool is the bridge between Neuro-SAN's tool/function interface and the project's Python application logic.

Conceptually:

```python
class ExampleTool(CodedTool):
    async def async_invoke(self, args: dict, sly_data: dict) -> dict:
        ...
```

CodedTools should remain thin adapters.

They should not become the entire backend.

### Current tool families

```text
coded_tools/
├── memory/
├── routine/
├── cognitive/
├── safety/
└── caregiver/
```

### Current service families

```text
backend/services/
├── memory/
├── routine/
├── cognitive/
├── safety/
└── caregiver/
```

The service layer contains actual domain logic.

---

# Personal Cognitive Context

The long-term architecture treats the person's context as infrastructure rather than as another conversational agent.

A future production version can combine:

```text
                    PERSONAL COGNITIVE CONTEXT
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
       Structured Facts     Episodes        Semantic Memory
            │                 │                 │
            │                 │               pgvector
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                         Memory Service
                              │
                        Memory Agent
```

Potentially stored attributes include:

- fact
- event
- relationship
- timestamp
- provenance
- confidence
- verification state
- temporal validity
- source

The current hackathon implementation is intentionally simpler and uses SQLite.

PostgreSQL + pgvector is a future/full architecture direction rather than a requirement for the current MVP.

---

# Governance and Trust

NeuroCompanion is designed around a separation of concerns.

## Identity

The current development implementation uses a deterministic request context:

```text
user_id
actor_id
role
session_id
```

The current demo identity is the synthetic patient session.

This is **development/demo identity**, not production authentication.

---

## Role-based access

Conceptually:

```text
PATIENT
→ own personal context

CAREGIVER
→ authorized caregiver information

ADMIN / DEBUG
→ system-level capabilities
```

The caregiver layer should expose authorized summaries rather than unrestricted personal memory.

---

## Audit

The intended audit structure includes fields such as:

```text
timestamp
user_id
actor_id
actor_role
agent
tool
action
resource
reason
success
```

This makes it possible to answer:

> Who did what, to which resource, and why?

---

## Observability

The system is intended to make the agent flow observable.

Example:

```text
User Request
     ↓
FastAPI
     ↓
Front Orchestrator
     ↓
Memory Agent
     ↓
Memory Tool
     ↓
Safety Agent
     ↓
Policy
     ↓
Response
```

This can later be visualized using React Flow / AgentFlow or an observability platform.

---

# Current Tech Stack

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy / existing ORM layer
- SQLite (current development datastore)
- Neuro-SAN
- HOCON agent-network configuration

## Frontend

- React
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- Zustand where useful
- optional Recharts for caregiver visualizations
- React Flow / AgentFlow for system visualization where implemented

## AI runtime

- Neuro-SAN
- Front Orchestrator + specialized agents
- CodedTools
- LLM configuration through HOCON

The project plan identifies Cognizant's `@cognizant-ai-lab/ui-common` as a possible reusable React component library, but it should only be used if the installed package/version is compatible with the project.

---

# Repository Structure

The exact repository may evolve, but the current project is organized approximately as follows:

```text
neuro-companion/
│
├── registries/
│   ├── manifest.hocon
│   ├── manifest_fastapi.hocon
│   └── *.hocon
│
├── config/
│   └── llm_config.hocon
│
├── coded_tools/
│   ├── memory/
│   ├── routine/
│   ├── cognitive/
│   ├── safety/
│   └── caregiver/
│
├── backend/
│   ├── api/
│   │   ├── main.py
│   │   ├── context.py
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   ├── patient.py
│   │   │   ├── activities.py
│   │   │   ├── safety.py
│   │   │   └── caregiver.py
│   │   └── schemas/
│   │       ├── chat.py
│   │       ├── patient.py
│   │       ├── activities.py
│   │       ├── safety.py
│   │       └── caregiver.py
│   │
│   ├── integrations/
│   │   └── neuro_san_client.py
│   │
│   ├── services/
│   │   ├── memory/
│   │   ├── routine/
│   │   ├── cognitive/
│   │   ├── safety/
│   │   └── caregiver/
│   │
│   ├── db/
│   │   ├── database.py
│   │   └── models.py
│   │
│   └── config.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── theme/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   └── tsconfig*.json
│
├── data/
│   ├── activities/
│   │   └── cognitive_activities.json
│   └── neuro_companion.db
│
├── tests/
├── logs/
├── requirements.txt
├── .env
└── README.md
```

Some future/planned folders, such as middleware, repositories, documentation subfolders, or PostgreSQL infrastructure, may not yet exist in the current MVP.

---

# Prerequisites

Recommended development environment:

- Windows 10/11 or a comparable developer machine
- Python 3.10+ recommended
- Node.js 18+ recommended
- npm
- Git
- Neuro-SAN Studio / `ns` CLI
- Access to an LLM provider supported by the installed Neuro-SAN environment

Because Neuro-SAN versions can change, use the version approved/available in the Cognizant hackathon environment rather than blindly pinning a different release.

---

# Installation

## 1. Clone the repository

```powershell
git clone <YOUR_REPOSITORY_URL>
cd neuro-companion
```

If the repository is already present, skip this step.

---

## 2. Create a Python environment

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution in your environment, activate the environment using the method permitted by your machine policy.

---

## 3. Install Python dependencies

If the repository contains `requirements.txt`:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

The backend requires the FastAPI stack and the Neuro-SAN runtime/tooling used by this project.

---

## 4. Install Neuro-SAN Studio

The project plan uses the Neuro-SAN Studio workflow:

```powershell
pip install neuro-san-studio
```

Then verify the CLI:

```powershell
ns --version
```

The exact installed version should be kept compatible with the existing HOCON files and tool APIs.

---

## 5. Install frontend dependencies

```powershell
cd frontend
npm install
cd ..
```

The frontend is a Vite React TypeScript application using MUI and React Router, with additional state/chart/visualization packages depending on the current UI implementation.

---

# Environment Configuration

## Root `.env`

The backend/Neuro-SAN integration needs the LLM provider credentials expected by your installed environment.

For the current Gemini configuration, the important variable is:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Never commit real API keys to Git.**

Use `.env.example` for a shareable template if you add one to the project.

---

## LLM configuration

The current central configuration is conceptually:

```hocon
{
    "llm_config": {
        "model_name": "gemini-3-flash"
    }
}
```

The actual provider/model must remain compatible with the installed Neuro-SAN version and hackathon environment.

---

## Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This tells the React application where the FastAPI BFF is running.

Do not place backend secrets here. Vite environment variables are exposed to browser-side code.

---

# Running the Project

NeuroCompanion has three important runtime pieces:

```text
1. Neuro-SAN agent runtime / network
2. FastAPI BFF
3. React frontend
```

Depending on your exact project state, Neuro-SAN may be started separately using `ns run` while FastAPI connects to its configured network/session.

---

## Terminal 1 — Start Neuro-SAN

From the project root:

```powershell
ns run
```

Use this to validate the original six-agent network and the HOCON configuration.

The project may also have a dedicated manifest for the FastAPI integration, such as:

```text
registries/manifest_fastapi.hocon
```

This exists to avoid loading unrelated/legacy registries that can cause duplicate agent/tool definitions.

---

## Terminal 2 — Start FastAPI

From the project root:

```powershell
uvicorn backend.api.main:app --reload
```

or, if using an environment manager that supports it:

```powershell
uv run uvicorn backend.api.main:app --reload
```

Expected address:

```text
http://127.0.0.1:8000
```

Open Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Terminal 3 — Start React

```powershell
cd frontend
npm run dev
```

Vite will normally expose the frontend at something similar to:

```text
http://localhost:5173
```

Use the exact URL printed by Vite.

---

# API Reference

The current BFF surface is intentionally small.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| POST | `/chat` | Conversational request through Neuro-SAN |
| GET | `/patient/profile` | Structured patient profile |
| GET | `/activities/history` | Cognitive activity history |
| GET | `/safety/events` | Logged safety events |
| GET | `/caregiver/summary` | Authorized daily + weekly caregiver summary |
| GET | `/caregiver/notifications` | Authorized caregiver notifications |

The project plan intentionally prefers a small BFF surface rather than exposing internal services directly.

---

## `GET /health`

Example:

```http
GET http://127.0.0.1:8000/health
```

Expected shape:

```json
{
  "status": "ok",
  "service": "neurocompanion-api",
  "version": "0.1.0"
}
```

---

## `POST /chat`

Request:

```json
{
  "message": "Who is Harpreet?"
}
```

Response shape:

```json
{
  "success": true,
  "message": "Who is Harpreet?",
  "response": "...",
  "user_id": 1
}
```

The frontend should not need to know about:

- HOCON
- Front Man implementation
- agent names
- CodedTools
- LLM provider
- Neuro-SAN credentials

Those details are hidden behind the BFF.

---

## `GET /patient/profile`

Returns structured profile information without routing the request through an LLM.

Example shape:

```json
{
  "success": true,
  "id": 1,
  "name": "Sukhvinder Sahu",
  "age": 70
}
```

The age is derived from the stored date of birth rather than requiring a database age column.

---

## `GET /activities/history`

Returns recent cognitive activity history.

Example shape:

```json
{
  "success": true,
  "user_id": 1,
  "count": 3,
  "history": []
}
```

Actual contents depend on recorded activity data.

---

## `GET /safety/events`

Returns logged safety events from the Safety service.

Example shape:

```json
{
  "success": true,
  "user_id": 1,
  "count": 1,
  "events": [
    {
      "risk_level": "MODERATE",
      "reason": "...",
      "human_review_required": true
    }
  ]
}
```

The frontend must treat these as backend-produced observations and policy outcomes, not calculate risk itself.

---

## `GET /caregiver/summary`

Returns caregiver-facing daily and weekly information from the existing Caregiver service.

Conceptually:

```json
{
  "success": true,
  "patient_user_id": 1,
  "daily_events": {},
  "weekly_trends": {}
}
```

The route is intended to use the existing caregiver authorization logic rather than hard-coding authorization inside the API route.

---

## `GET /caregiver/notifications`

Returns caregiver notifications associated with the authorized patient/caregiver context.

Example structure:

```json
{
  "success": true,
  "patient_user_id": 1,
  "count": 0,
  "notifications": []
}
```

---

# Neuro-SAN Commands

Useful commands for the project include:

```powershell
ns --version
ns check-llm-keys
ns check-config
ns run
ns chat
```

For the original six-agent smoke test, useful conversational scenarios include:

```text
Who is Harpreet?
Who is my wife?
What is my morning routine?
Give me a cognitive activity.
```

More complete evaluation scenarios are listed below.

---

# Testing and Validation

The most important engineering rule is:

> **Never move forward with a broken layer.**

The project was intentionally built in checkpoints so that the working multi-agent core remains recoverable.

---

## Backend validation

From the root:

```powershell
python -m compileall backend
```

Start the API and verify:

```text
GET  /health
GET  /patient/profile
GET  /activities/history
GET  /safety/events
GET  /caregiver/summary
GET  /caregiver/notifications
```

Then test `/chat` when Neuro-SAN and the LLM provider are reachable.

---

## Frontend validation

```powershell
cd frontend
npm run build
```

A successful production build is the minimum TypeScript/React validation step.

Also visually test:

- `/`
- `/companion`
- `/caregiver`

and any additional routes added during UI development.

---

## Regression validation

After backend changes, the original Neuro-SAN workflow should still work:

```powershell
ns run
```

The goal is to have both paths working:

```text
                 ┌── ns run
Six-agent core ──┤
                 └── FastAPI → Neuro-SAN
```

---

# Recommended Evaluation Matrix

## Memory

```text
Known fact
Unknown fact
Conflicting fact
Stale fact
False user statement
```

Expected behavior:

- retrieve when evidence exists
- communicate uncertainty when evidence does not exist
- do not fabricate
- preserve provenance where available

## Routine

```text
Today
Tomorrow
Past event
Overlapping events
Mixed memory + routine question
```

## Cognitive

```text
Activity request
Different durations
Different activity types
Repeated activity
Activity history retrieval
Performance logging
```

## Safety

```text
Normal
Uncertain
Moderate
High
Emergency
```

Expected behavior:

```text
Language / signals
      ↓
Safety assessment
      ↓
Deterministic policy
      ↓
Permitted next step
```

## Privacy / access

```text
Patient
Authorized caregiver
Unauthorized user
```

The caregiver experience must not become a shortcut around authorization.

---

# Hackathon Demo Flow

The best demonstration is a **single person across a day**, not seven disconnected feature demos.

## Scene 1 — Morning orientation

Patient:

> "I just woke up. What do I have today?"

Flow:

```text
Front
  ↓
Routine
  ↓
Personal Context / routine data
  ↓
Simple patient-friendly answer
```

---

## Scene 2 — Personal memory

Patient:

> "Who is Priya?"

Flow:

```text
Front
  ↓
Memory Agent
  ↓
Memory Tool
  ↓
Verified personal information
```

---

## Scene 3 — Mixed reasoning

Patient:

> "Priya is coming at 4. What should I do before she arrives?"

Flow:

```text
Front
 ├── Memory Agent
 └── Routine Agent
```

This demonstrates selective multi-agent orchestration.

---

## Scene 4 — Honest uncertainty

Patient:

> "Did Rahul visit me yesterday?"

Expected behavior:

```text
Memory
  ↓
No reliable evidence
  ↓
Explicit uncertainty
```

This is more trustworthy than hallucinating a memory.

---

## Scene 5 — Cognitive engagement

Patient:

> "Give me something I can do for 10 minutes."

Flow:

```text
Cognitive Agent
  ↓
Activity selection
  ↓
Structured activity
  ↓
Performance logging
```

---

## Scene 6 — Safety deviation

Patient:

> "I feel unusually confused and I don't know where I am."

Flow:

```text
Front
  ↓
Safety Agent
  ↓
Baseline
  ↓
Layer 1 assessment
  ↓
Layer 2 deterministic policy
  ↓
Caregiver / human review pathway
  ↓
Audit
```

---

## Scene 7 — Caregiver view

Switch to the caregiver dashboard.

The caregiver should see relevant information such as:

```text
Significant deviation detected
Human review recommended
```

alongside:

- today's activity
- safety observations
- pending tasks/reminders
- weekly trends
- notifications

Then open the system trace / architecture view.

This makes the following visible:

```text
Memory
+
RAG / Personal Context
+
Tools
+
Multi-agent orchestration
+
Safety
+
Deterministic policy
+
Human-in-the-loop
+
Caregiver communication
+
Audit / Observability
```

---

# Current Demo Patient

The current project uses a synthetic patient profile.

```text
Name: Sukhvinder Sahu
Preferred name: Sukhvinder
Date of birth: 18 March 1956
Occupation: Retired Senior Technician
Retirement year: 2016
Former employer: Indian Railways
State: Uttar Pradesh
City: Lucknow
Primary language: Hindi
Gender: Male
```

The profile notes indicate that the synthetic patient benefits from:

- predictable routines
- short explanations
- gentle reminders
- repetition when needed
- confirmation of important facts before treating them as current

This information should shape the UX but should not be used to fabricate additional personal facts.

---

# Current Limitations

This section is intentionally explicit so that the project remains truthful.

## 1. Development identity is not production authentication

The current BFF uses deterministic development identity values rather than a full authentication provider.

Conceptually:

```text
user_id = 1
actor_id = 1
role = patient
```

This is only for the synthetic hackathon environment.

---

## 2. SQLite is the current development datastore

The fuller architecture points toward:

```text
PostgreSQL
+
pgvector
```

but the current working MVP uses SQLite.

Do not describe the current demo as PostgreSQL/pgvector-backed unless those components have actually been deployed and tested.

---

## 3. Routine adherence tracking is not currently available

Do not invent a routine-completion percentage.

The caregiver UI should not claim something like:

```text
85% adherence
```

unless the backend genuinely calculates and stores that metric.

A truthful UI should say that routine completion tracking is not currently available.

---

## 4. Neuro-SAN / LLM connectivity depends on the environment

The application requires the configured LLM provider to be reachable.

A successful local Neuro-SAN configuration check does not necessarily guarantee that outbound provider calls will work on every network.

For example, a DNS/network failure reaching the configured Google Generative Language endpoint is an infrastructure issue, not necessarily an application bug.

---

## 5. This is not a clinical diagnosis system

The product should not be presented as:

- a diagnostic tool
- a medical prediction engine
- an autonomous medical decision-maker
- a medication management system
- an autonomous emergency caller

It is a cognitive-support and caregiver-assistance prototype.

---

# Troubleshooting

## FastAPI will not start

Run:

```powershell
python -m compileall backend
```

Then check imports and the Python environment.

If `uvicorn` is not found:

```powershell
python -m pip install uvicorn
```

or activate the virtual environment first.

---

## React shows a white page

Run:

```powershell
cd frontend
npm run build
```

Fix every TypeScript/build error before testing the browser.

Then restart:

```powershell
npm run dev
```

Check the browser console for runtime errors.

---

## React cannot reach FastAPI

Confirm FastAPI is running:

```text
http://127.0.0.1:8000/health
```

Confirm `frontend/.env` contains:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart Vite after changing `.env`.

---

## CORS errors

The current development API explicitly allows the local frontend origins used by the project.

Typical development origins are:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Do not replace this with an unrestricted `*` policy simply to make an error disappear.

---

## `/chat` returns 502

This means the BFF could not successfully complete the Neuro-SAN request.

Check:

```powershell
ns --version
ns check-llm-keys
ns check-config
ns run
```

Then verify:

- `.env` contains the required provider key
- the configured model/provider is valid
- the Neuro-SAN network name is correct
- outbound network/DNS access is working

A DNS failure to the provider endpoint should be treated as an infrastructure/network problem.

---

## Neuro-SAN reports duplicate or conflicting tools/registries

Check which manifest is being loaded.

The project may use a dedicated FastAPI manifest such as:

```text
registries/manifest_fastapi.hocon
```

This can be necessary when legacy manifests load older networks containing duplicate names.

Do not blindly merge every historical `.hocon` network into one manifest.

---

## ImportError / ModuleNotFoundError in caregiver or safety code

Inspect the actual repository before creating a new module.

For example, the project already contains a `CaregiverService` that internally uses repository logic; do not invent a separate repository file simply because an import path seems architecturally attractive.

The same principle applies to Safety.

---

# Development Rules

These rules are important because the project contains several interconnected layers.

## Rule 1 — Preserve the working six-agent core

Do not rewrite agents unless an actual integration or functional test demonstrates a need.

The stable six-agent core is the foundation of the product.

---

## Rule 2 — Agents reason; code enforces

Use this mental model:

```text
LLM / Agents
→ decide what should happen

CodedTools / Services / Policy
→ decide what is allowed and perform deterministic work

Database / Context
→ determine what is known

Governance
→ determines who may access it
```

---

## Rule 3 — Do not put business logic in React

React should not:

- calculate safety risk
- decide if someone is safe
- perform caregiver authorization
- access the database directly
- execute medical policy
- retrieve unauthorized memory

React should display backend-produced results.

---

## Rule 4 — Do not put agent reasoning in FastAPI

FastAPI should manage:

- HTTP
- request validation
- identity context
- authorization boundaries
- structured data endpoints
- integration with Neuro-SAN
- error handling

FastAPI should not duplicate the Front Agent's reasoning logic.

---

## Rule 5 — Do not route everything through an LLM

Structured application data should usually be retrieved directly through services/APIs.

For example:

```text
GET /patient/profile
        ↓
FastAPI
        ↓
Profile service
        ↓
SQLite
```

There is no reason to ask an LLM to calculate a patient's stored age.

Conversational questions go through Neuro-SAN when agent reasoning is useful.

---

## Rule 6 — Never fake product data

Do not fabricate:

- metrics
- safety events
- agent traces
- activity results
- routine adherence
- caregiver notifications
- memory retrieval
- AI actions

A smaller truthful product is stronger than a larger fake demo.

---

## Rule 7 — Keep the patient experience simple

The patient UI should prioritize:

- clear language
- large controls
- consistency
- predictability
- reassurance
- one action at a time
- minimal cognitive load

The caregiver UI should prioritize:

- information hierarchy
- trends
- alerts
- summaries
- efficient scanning
- professional presentation

These are intentionally different experiences.

---

# Roadmap

The practical roadmap is:

```text
1. Stable Neuro-SAN core
          ↓
2. FastAPI BFF
          ↓
3. Patient UI
          ↓
4. Caregiver Dashboard
          ↓
5. Audit / Observability
          ↓
6. Product polish
```

The current product can evolve incrementally without replacing the underlying architecture.

---

## Near-term improvements

- stronger patient memory UI
- richer activity experience
- more complete routine integration
- real audit APIs
- richer agent execution traces
- voice input/output
- caregiver trend visualizations
- stronger role management
- more explicit consent flows

---

# Future Architecture

The fuller target architecture can evolve toward:

```text
                        React Application
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
        Patient UI        Caregiver UI       System UI
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                         FastAPI BFF
                               │
                ┌──────────────┼───────────────┐
                ▼              ▼               ▼
           Governance      Neuro-SAN       Structured APIs
                │              │               │
        ┌───────┼──────┐       ▼               ▼
        ▼       ▼      ▼   Multi-agent       Services
       RBAC   Consent Audit    graph            │
                               │                ▼
                               ▼           PostgreSQL
                             Tools              +
                               │            pgvector
                               ▼
                       External integrations
```

Potential future infrastructure:

- PostgreSQL
- pgvector
- richer personal-memory schema
- graph-style relationship representation
- real authentication
- stronger consent management
- production audit storage
- external calendar/integration APIs
- MCP where it provides real integration value
- Phoenix / Langfuse / equivalent observability

These should only be introduced when they solve a demonstrated problem.

---

# Safety and Non-Clinical Disclaimer

NeuroCompanion is a hackathon prototype built around a **synthetic patient** and is not a medical device or clinical decision-making system.

It should not be used as a substitute for professional medical care.

The system is specifically designed so that safety assessment and deterministic policy are separated from autonomous emergency action.

The intended safety philosophy is:

```text
AI interpretation
      ↓
structured signal
      ↓
deterministic policy
      ↓
human review / configured pathway
```

Any real-world deployment would require substantially stronger:

- clinical validation
- privacy controls
- security
- authentication
- consent management
- monitoring
- regulatory review
- human oversight
- integration testing

---

# Project Philosophy

The easiest way to remember the architecture is:

> **Neuro-SAN decides what should happen.**  
> **CodedTools and policy decide what is allowed.**  
> **Data determines what is known.**  
> **Governance determines who may access it.**

And the product itself has one human-centered goal:

> **Make a complicated AI system feel simple, safe, and useful to the person who needs it.**

---

## Useful Links / Developer Entry Points

During development, these are the most useful interfaces:

```text
Patient / Caregiver UI
→ http://localhost:5173

FastAPI
→ http://127.0.0.1:8000

FastAPI Swagger
→ http://127.0.0.1:8000/docs

FastAPI health
→ http://127.0.0.1:8000/health

Neuro-SAN developer workflow
→ ns run
```

---

## License

Add the project's actual license here before public distribution.

---

## Status

**Hackathon prototype / active development**

The architecture is intentionally designed so that the current working MVP can be demonstrated today while leaving a clean path toward stronger memory, governance, observability, and production infrastructure later.
