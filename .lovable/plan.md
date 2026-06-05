
# PayGrowa Expansion Plan

This is a large multi-section request. I'll implement it in focused, additive layers so no approved screen is redesigned. Existing Home, Contributor Auth, Wallet, Savings, Profile, Contributor Dashboard, and Admin screens stay locked. Only the changes below are made.

---

## 1. Roles & Routing Foundation

- Extend `AppContext` with a `role` field: `"contributor" | "client" | "admin"` (default `contributor`). No change to existing contributor flows.
- Add `ClientProtected.tsx` (mirrors `AdminProtected`) gating `/client/*` routes for users whose role is `client` (or via a simple allowlist fallback for MVP demo).
- Keep admin allowlist behavior unchanged.

## 2. Landing Page Navigation (Home Screen NOT redesigned)

- Add a responsive top nav inside the existing `HomePage` hero region (header only — hero, sections, layout untouched):
  - Desktop: horizontal links — Home, How It Works, For Contributors, For Organizations, About Us, Sign In, Get Started.
  - Mobile: hamburger using shadcn `Sheet`.
- "For Organizations" routes to `/organizations` (new page).
- All other links are anchor scrolls to existing sections or existing routes. Sign In → `/login`, Get Started → `/signup`.

## 3. Organization Landing Page (NEW)

- New route `/organizations` → `OrganizationsLandingPage.tsx` with sections:
  - Hero ("Collect Reliable Community Data Across Nigeria") with CTAs Create Organization Account / Book a Demo.
  - Who We Serve cards (NGOs, Research, Universities, Government, Businesses, Development Partners).
  - What You Can Do — 3 cards (Survey Research, Community Reporting, Field Data Collection) with bullet lists.
  - How It Works — 7 steps.
  - Features grid.
  - Final CTA.
- Mobile-first, container-constrained on desktop, reusing existing tokens (blue/green, radii, typography).

## 4. Organization Auth (NEW, contributor auth untouched)

- `/organization/signup` (alias `/client-signup` & `/organization-signup`) → `OrganizationSignupPage.tsx`
- `/organization/login` → `OrganizationLoginPage.tsx`
- Mirrors existing contributor sign-up layout (two-column desktop), new left-panel image generated for organizations.
- Fields per spec (Org Name, Org Type, Contact, Email, Phone, Country, State, Password, Confirm, Terms, Continue with Google).
- On success: sets role `client`, navigates to `/client/dashboard`.

## 5. Client Portal (NEW, separate from Contributor + Admin)

- `ClientLayout.tsx` with sidebar nav: Dashboard, Projects, Create Project, Analytics, Payments, Profile (mobile-first centered shell on desktop, hamburger on mobile).
- `ClientContext.tsx` manages `projects[]` in memory with statuses (Draft, Under Review, Approved, Live, Paused, Completed, Rejected) and computed analytics. Designed for future Supabase wiring.
- Screens:
  - `ClientDashboard` — KPI cards (Active/Draft/Under Review/Live/Completed projects, Total Spend, Responses Collected).
  - `ClientProjects` — list with View / Edit / Submit-for-Review.
  - `ClientCreateProject` — full form (title, objective, description, type Survey|Community Reporting, country, state, language, age range, gender, responses required, est. completion, budget, reward/response, deadline). Conditional Survey Question Builder or Community Reporting Builder. Live budget calculator (responses × reward + 15% platform fee).
  - `ClientProjectDetails` — View / Edit / Submit For Review.
  - `ClientAnalytics` — responses collected, completion rate, budget used/remaining, quality pass rate, avg completion time; CSV / Excel export buttons (client-side blob).
  - `ClientPayments` — simple ledger view (mock).
  - `ClientProfile` — org profile editor.

## 6. Admin Panel — Additive Updates Only

- Extend `AdminContext` with `clientProjects[]` mirrored from client submissions.
- Add **Project Review** screen `/admin/projects` (new) — list pending client projects with Approve / Reject / Request Changes. Approve converts project → task in existing admin tasks list.
- Add nav item "Projects" to existing `AdminLayout` sidebar (insertion only, no redesign).
- Extend dashboard metrics card row with: Total Contributors, Total Clients, Active Projects (additive cards — existing cards remain).
- No redesign of existing admin Tasks / Submissions / Payments / Users / Analytics / Settings.

## 7. Contributor Updates (Minimal, Additive)

- **Tasks tab in navigation** — add `Tasks` between Home and Wallet in both `BottomNav` (mobile) and `AppShell` sidebar (desktop). New route `/tasks` → `TasksHubPage.tsx` with category cards (Surveys, Local Community Reporting, Data Tagging, AI Annotation) each showing count / time / reward range / View Tasks. Clicking a category opens a listing view (reuses existing task card pattern); existing dashboard task lists are untouched.
- **Local Community Reporting submission flow** — after submit, route through the existing Confirm Submission → Success → Savings Allocation flow used by Surveys (reuses `SuccessPage`). Edit `CommunityTaskPage` only.
- **Verification copy** — replace all "20 minutes / 20 mins" user-facing strings with "5 minutes / 5 mins" across Wallet, Success, Task screens, notifications. (Internal `VERIFY_DURATION` already 5 min.)
- **Trust Score** — show numeric score + level (Trusted/Good/Under Review/Restricted) on Profile. Add scoring deltas in `AppContext` (approved +2, high quality +3, rejected -8, failed attention -5, fraud -20). No UI redesign — added as a small block on existing Profile.

## 8. Wallet & Savings Logic (no UI changes)

- Wallet: keep submission status flow (Submitted → Under Verification → Approved → Paid) — already in place; add "Pending Balance" derived value display in existing balance area (smallest possible insertion).
- Savings: on wallet withdrawal, if user has no autosave enabled, automatically move 10% to savings and show toast "We've set aside a small amount to help you build financial stability." Existing savings balance already counts toward goals via current logic; ensure progress recomputes when a goal is created after savings already exist.
- Goal categories list expanded per spec (Emergency Fund, Education, Business, Family Support, Personal Purchase, Travel, Other) — added in existing goal form select only.

## 9. Universal Error / Empty State

- Update `NotFound.tsx` to PayGrowa-styled fallback: "Oops! Nothing found here" + "Go to Dashboard" button using existing tokens.

## 10. Responsive Polish

- Audit new pages and ensure desktop uses centered ~460px mobile-app container (organization landing uses wider marketing sections per global rule). No edits to existing approved screens.

---

## Technical Notes

- All new state lives in new contexts (`ClientContext`) or additive fields on existing contexts — no breaking changes.
- Data shapes (Project, Submission, TrustEvent) defined as TS interfaces ready for Supabase mapping.
- CSV/Excel export: CSV via Blob; Excel via simple `xlsx` blob (lightweight) or `.csv` fallback labeled Excel-compatible.
- New image asset generated for organization signup left panel.
- No changes to: HomePage hero/body, contributor LoginPage/SignupPage, DashboardPage layout, WalletPage layout, SavingsPage layout, ProfilePage layout, SurveyPage, TaskDetailPage, existing admin screens.

## Out of Scope (explicit)

- Backend wiring to Supabase tables (structure ready, but not creating tables in this pass unless you confirm).
- Real Google OAuth provider config changes (uses existing managed flow).
- Identity verification document upload backend.

Confirm and I'll implement in this order: foundation/roles → org landing + auth → client portal → admin additions → contributor Tasks hub + community flow fix + copy/trust updates → NotFound + responsive polish.
