# Validation — 7 October 2026

`npm test`: **16 tests passed** (15 backend/panel integration tests and one offline
setup-tool test). Tests use a temporary PostgreSQL
WASM instance (PGlite) with the pg TCP client, the installed Better Auth library,
Express HTTP routes and jsdom form interactions.

Verified:

- First manager provisioning, migration/redeploy idempotence, password hashing.
- Valid signed bearer sessions; anonymous, unsigned, invalid and expired/revoked access denied.
- Origin validation and GitHub Pages CORS preflight/header exposure.
- Closed registration, role-setting and impersonation routes; member cannot provision accounts.
- Shared record persistence and edits across separate authenticated clients.
- Server-stamped ownership/timestamps, rejected client ownership/history fields.
- Member/private denial, manager ownership checks, no search/count/export private leaks.
- Idempotent creates, mismatched retry conflict, current authorization checked on replay.
- Required versions and stale edit rejection.
- Transitive privacy through contacts → opportunities → meetings → reports/tasks.
- Rejected unavailable links/cycles and safe HTTPS URLs.
- Visibility changes applied to linked reads, counts and exports.
- Manager trash/restore/purge, hidden deleted parents, blocked purge with dependents.
- Immediate session revocation on account disable and prevention of self-disable.
- Caller-only preferences; private export restrictions.
- HTML test panel: login, private contact creation, edit saved to DB, XSS-safe display,
  and clearing displayed data on sign-out without browser-storage persistence.
- Password change revokes other sessions; sign-out revokes current signed bearer.
- Offline setup generates independent 256-bit secrets without network requests.

`npm audit --omit=dev --audit-level=high`: **0 reported runtime vulnerabilities**
at the time checked. This is a dependency advisory check, not a security guarantee.
Runtime versions are pinned in package-lock.json; Docker uses npm ci.

Not verified in this workspace:

- Live Railway deployment, its private Postgres connection and account variables.
- Native PostgreSQL concurrency/load behavior or multiple deployed replicas.
- Actual browser screenshots, responsive visual rendering or cross-site login
  in the user's browser. jsdom exercises the forms, not browser layout/CSP.
- Existing GitHub Pages frontend integration (it is not part of this package).
- Microsoft/Lists/email/attachments/legacy-data import or automatic DB backups.

Better Auth's migration inspection logs an int8/number type warning for its own
rateLimit.lastRequest column on a second migration in the WASM test. The generated
column is BIGINT (appropriate for millisecond timestamps), and all auth/rate-limit
requests and repeated migrations completed. We have not changed the vendor schema
to suppress this warning.

See README.md for the required live two-account checks after deployment.
