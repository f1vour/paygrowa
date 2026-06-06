
This is a large multi-part build. I'll execute it in phases, in this order. Each phase is shippable on its own.

## Phase 1 — Route wiring & navigation (foundation)

- **App.tsx**: register the previously-built pages that aren't wired:
  - `/organizations` → `OrganizationsLandingPage`
  - `/organization/signup`, `/organization/login`
  - `/organization` (protected, wrapped in `ClientLayout`) → dashboard, projects, projects/new, analytics, payments, profile
  - `/tasks` → `TasksHubPage` (inside `AppShell`)
  - `/admin/projects` → `AdminProjects` (already exists, not wired)
- **AdminLayout nav**: add "Project Review" entry pointing to `/admin/projects`.
- **NotFound page**: replace "Back to dashboard" CTA with a simple **Back** button that calls `navigate(-1)` (history fallback to `/`).
- **Terminology pass**: all user-facing strings in the Client/Org area say "Organization / Organizations". Internal route prefix becomes `/organization` (singular, user-facing). Keep `ClientContext`/`ClientLayout` file names internal — only UI copy changes.

## Phase 2 — Contributor Profile (expanded)

Rebuild `ProfileSetupPage` and `ProfilePage` as a single profile hub with sections:

1. **Basic Information** — full name (prefilled), email (prefilled, read-only), phone, profile photo (upload/take), country (Nigeria/Uganda/Zambia, default Nigeria), state (all 36 NG states alphabetical), languages (multi-select: Hausa, Igbo, Yoruba, English), DOB (date picker), gender, education level. Save Changes button.
2. **Account Security** — password field (masked) + Change Password modal (current / new / confirm).
3. **Identity Verification** — status card (Not Verified / Pending / Verified / Rejected). "Verify Identity" opens a 4-step modal: ID type → ID number → upload doc (or take picture) → upload selfie → Submit. Updates status to Pending Review.

`AppContext` gains: `profile` (extended fields), `identityStatus`, `setIdentityStatus`, `submitIdentity()`, `changePassword()`. All state local (no backend writes yet — UI-only persistence in context like existing pattern).

Dashboard cards:
- "Complete your profile" → `/profile-setup` (already correct, just confirm).
- "Verify your identity" → routes to `/profile` Identity section (anchor). Hidden when verified.

## Phase 3 — Trust Score & Leaderboard UI

- **Trust Score Card** on dashboard: numeric score (e.g. 85/100), level badge, progress bar to next level, expandable breakdown (Task Completion Rate, Quality Approval Rate, Verification Status, Consistency, On-Time Submission Rate — mocked values for now).
- Update `trustLevel()` to new 6-tier scheme: New (0–20), Verified (21–40), Bronze (41–60), Silver (61–80), Gold (81–95), Elite (96–100).
- **Leaderboard widget** on dashboard: top 3 + "Your Rank #47 of 2,315" + "View Leaderboard" link.
- **Leaderboard page** (`/leaderboard`): table with Rank, Username (masked), Level, Trust Score, Tasks Completed. Mocked data.

## Phase 4 — Dashboard restructure

- Welcome toast on first dashboard visit per session.
- Profile Completion Card with sub-progress (Profile Info %, ID Verification status).
- Available Tasks **preview only** (3 surveys, 3 community) with "View All Tasks →".
- When profile incomplete: show 2 unlocked tasks + remaining tasks **blurred/locked** with "Complete Profile" CTA.
- Eligibility hint: when a locked task is tapped, show modal listing missing requirements ("Age 18–35, Lagos State, English, Verified Profile").

## Phase 5 — Tasks Hub page

Rebuild `TasksHubPage` to mirror dashboard structure: sections for Survey Tasks and Local Community Reporting (subcategories: Waste, Road, NGO, Government Data). Each task card shows eligibility lock state.

## Phase 6 — Local Community Reporting flow (dedicated)

Replace current `CommunityTaskPage` with a 6-step wizard with stepper UI:

1. **Task Overview** — title, category, reward, est. time, deadline, location requirement, description → "Start Task".
2. **Requirements checklist** → "I Understand, Continue".
3. **Evidence Collection** — multi-photo upload (min count), optional video, GPS capture button (mock) with timestamp.
4. **Observation Form** — category-specific fields (Waste, Road, Government Data, NGO templates).
5. **Review** — summary of all collected data, Back / Submit.
6. **Submission Confirmation** — Pending Review, 24–48h, "Return to Dashboard".

Validation per step; cannot advance with missing data. Submitted reports stored in `AppContext.communitySubmissions` with status (Submitted/Under Review/Approved/Rejected/Paid). New "My Reports" section on Wallet/Profile to view status.

## Phase 7 — Organization verification (UI)

Add Verification section to `ClientProfile`: org name, type, contact person, email, phone, country, status badge, "Verify Organization" button → modal with uploads (Cert of Registration, NGO doc, Business Reg, Govt Auth Letter). Status: Pending / Verified / Rejected. Banner across org screens: "Only verified organizations can publish live projects" — disables publish action when unverified.

## Phase 8 — Polish

- Every button verified to route or perform an action (no Coming Soon).
- Currency check: all ₦, no `$`.
- Mobile-first; constrained desktop container preserved via existing `AppShell`.

---

## Technical notes

- **No backend changes** in this pass. All new state lives in `AppContext` / `ClientContext` (in-memory, matching existing pattern). Real persistence (Supabase tables for profiles, identity submissions, trust events, community reports, org verification) is a follow-up phase that needs RLS design.
- File uploads use object URLs locally (no storage bucket yet).
- GPS uses `navigator.geolocation` with graceful fallback to mocked coords.
- Stepper component built locally (no new dependency).
- 6-tier `trustLevel` is a breaking change to existing call sites — I'll update `ProfilePage` accordingly.
- Existing locked surfaces (Home, Auth, Wallet structure, Savings structure) are not modified beyond what's explicitly listed (dashboard restructure is in-scope per the spec).

## Out of scope (call out explicitly)

- Actual backend persistence / RLS for profiles, identity docs, trust events, leaderboard, community submissions, org verification documents. These need a follow-up Supabase migration phase.
- Admin moderation screens for identity verification and org verification approval (UI exists for submission only; admin approval screens to be added in a follow-up).
- Real eligibility matching engine — Phase 4/5 use a simple client-side rule set (verified + profile complete) as a placeholder.

Given the size, I recommend shipping Phases 1–3 first (foundation + visible trust UI + profile expansion), then 4–5 (dashboard/tasks restructure), then 6 (community flow), then 7–8.
