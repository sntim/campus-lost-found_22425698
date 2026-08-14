# FindBack Technical Debt Plan

FindBack was deliberately scoped for a 48-hour individual capstone. The following debt is visible, classified, and planned rather than concealed. No critical debt is knowingly left unresolved in the implemented privacy, authentication, role-check, or allowed-status rules.

| Debt | Cause | Impact | Priority | Classification | Proposed resolution and release |
|---|---|---|---|---|---|
| In-app-only claim alerts | The time-box excluded e-mail, push, and SMS integrations. | A claimant must return to FindBack to read a decision. | Medium | Scheduled | Add verified e-mail/push channels and notification preferences in v1.1. |
| One image per report | A single upload path reduces storage and validation complexity. | A student cannot add multiple angles or supporting images. | Low | Temporarily acceptable | Add an `item_images` relation, gallery UI, and file-ordering support in v1.1. |
| Basic relational foreign-key enforcement | The initial schema prioritises rapid, portable deployment. | Orphaned references would require application-level safeguards if data is changed outside the application. | Medium | Scheduled | Add FK constraints and deletion/retention rules after confirming migration compatibility in staging. |
| Simplified keyword search | The expected examination data volume is small. | No ranking, typo tolerance, synonym matching, or full-text index. | Low | Temporarily acceptable | Add database full-text search, ranking, and searchable field indexes in v1.2. |
| Manual content moderation | The project does not include a paid or trained moderation service. | Administrators must recognise unsuitable text/images. | Medium | Scheduled | Add report-abuse workflow, moderation queue, audit log, and content-policy review before wider rollout. |
| Manual acceptance-test evidence | Separate accounts and a deployed URL are needed for authentic end-to-end validation. | The final manual test table is incomplete until deployment. | Medium | Requires attention before submission | Execute the recorded live checklist with one student and one admin account, then attach final evidence. |
| Single deployable bundle | A 48-hour project uses a compact frontend bundle. | Initial load is larger than an enterprise-scale app should target. | Low | Scheduled | Add route-level dynamic imports and assess bundle-size improvements in v1.1. |

## Repayment Order

The project must first complete the manual live test evidence because it affects examination readiness. The next release should introduce notification delivery and data-integrity constraints because they improve operational reliability. Search, multi-image support, moderation, and code splitting follow in value-driven increments, informed by real usage and administrator feedback.

## Maintenance Link

Technical-debt reviews will occur during each release-planning cycle. Every debt item will be reassessed for impact, priority, owner, due release, and verification result. New shortcuts must be added to this register before release approval.
