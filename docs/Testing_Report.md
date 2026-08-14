# FindBack Testing Report

**Project:** FindBack — Campus Lost & Found  
**Course:** CSCD602: Advanced Software Engineering  
**Test environment:** Local managed development environment, Chromium responsive previews, MySQL-compatible managed database  
**Date:** [Enter examination date]

## Test Strategy

Testing combines automated unit and authorization tests, production-build validation, responsive interface inspection, and a manual acceptance-test checklist. Automated results are recorded only where they were actually executed. The manual checks must be completed with the student’s own live deployment before final submission; they are intentionally marked **Not yet executed** rather than represented as completed.

## Executed Automated Tests

| Test area | Evidence | Actual result | Status |
|---|---|---|---|
| Exact item-status rule | `server/domainRules.test.ts` verifies the exact list: lost, found, resolved, archived. | Passed. | Pass |
| Contact-disclosure rule | `server/domainRules.test.ts` verifies that only an administrator or an approved claimant can reveal reporter contact details. | Passed. | Pass |
| Claim eligibility | `server/domainRules.test.ts` verifies that only active found reports may receive claims. | Passed. | Pass |
| Authentication | `server/auth.logout.test.ts` verifies session-cookie clearing and success response. | Passed. | Pass |
| Student protection | `server/accessControl.test.ts` verifies that an anonymous visitor cannot create a report. | Passed. | Pass |
| Administrator protection | `server/accessControl.test.ts` verifies that a student cannot change an item status. | Passed. | Pass |
| Test suite execution | `pnpm test` | 3 test files and 6 tests passed. | Pass |
| Production build | `pnpm build` | Client bundle and server bundle completed successfully. | Pass |

## Responsive System Test Evidence

| Scenario | Expected result | Actual result | Status |
|---|---|---|---|
| Mobile browse page | Filter controls stack cleanly, with an understandable empty state. | Verified through 375 × 812 responsive preview. | Pass |
| Mobile reporting form | Required inputs, image attachment area, and controls remain usable without horizontal overflow. | Verified through 375 × 812 responsive preview. | Pass |
| Mobile profile | User report/claim/notification areas stack cleanly and retain empty states. | Verified through 375 × 812 responsive preview. | Pass |
| Mobile admin workspace | Navigation, overview cards and management controls remain readable on narrow screens. | Verified through 375 × 812 responsive preview. | Pass |
| Unknown item detail route | A missing item produces a safe not-found path rather than exposing data. | Server returned an explicit `NOT_FOUND` result for `/items/1`; loading guard displayed first. | Pass |

## Manual Functional and Acceptance Tests to Execute on the Live Deployment

| ID | Test case | Expected result | Actual result | Status |
|---|---|---|---|---|
| TC-01 | Sign in as a student. | Profile is available; admin dashboard remains unavailable. | [Record after live test] | Not yet executed |
| TC-02 | Submit a valid lost-item report with no image. | Report is created with status `lost`; a success toast appears. | [Record after live test] | Not yet executed |
| TC-03 | Submit a valid found-item report with a PNG/JPEG/WebP image below 4 MB. | Image is stored, report is created with status `found`, and a success toast appears. | [Record after live test] | Not yet executed |
| TC-04 | Submit an invalid image type or a file above 4 MB. | Submission is blocked and an error toast appears. | [Record after live test] | Not yet executed |
| TC-05 | Filter and paginate the public browse directory. | Only matching reports are displayed and empty states are clear. | [Record after live test] | Not yet executed |
| TC-06 | View a found report as a student without an approved claim. | Reporter contact details are hidden. | [Record after live test] | Not yet executed |
| TC-07 | Submit an ownership claim with at least 20 characters of proof. | One pending claim is stored and a success toast appears. | [Record after live test] | Not yet executed |
| TC-08 | Attempt a second claim for the same item from the same student. | Duplicate claim is blocked with an explanatory toast. | [Record after live test] | Not yet executed |
| TC-09 | Sign in as an admin and approve a pending claim. | Claim becomes approved, the claimant receives an in-app notification, and contact details become visible only to that claimant/admin. | [Record after live test] | Not yet executed |
| TC-10 | Reject a pending claim with an optional note. | Claim becomes rejected and the claimant receives an in-app notification and note. | [Record after live test] | Not yet executed |
| TC-11 | Set each allowed item status. | Only `lost`, `found`, `resolved`, and `archived` can be selected. | [Record after live test] | Not yet executed |
| TC-12 | Attempt direct admin access as a student. | Server rejects the request with a forbidden response. | [Record after live test] | Not yet executed |

## Defects and Corrective Actions

During browser inspection, a duplicate React navigation key warning was observed in the initial administrator sidebar. The duplicate menu entry was removed, then TypeScript, automated tests, production build, and responsive previews were re-run. No unresolved build or type-check defects remain in the development environment.

## Test Conclusion

The implemented rules and access controls have automated evidence, the production build passes, and key responsive states have been visually inspected. Before submission, the student must complete the live manual checklist above using separate student and admin accounts and replace the “Not yet executed” entries with observed results.
