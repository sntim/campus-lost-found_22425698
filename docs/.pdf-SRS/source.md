# Software Requirements Specification: FindBack

**System:** FindBack — Campus Lost & Found  
**Version:** 1.0  
**Course:** CSCD602: Advanced Software Engineering  
**Prepared by:** [Enter your name and student ID]

## 1. Purpose and Scope

FindBack provides a trusted campus workflow for reporting lost or found property, discovering relevant reports, proving ownership, approving or rejecting claims, and protecting reporter contact details. Its users are students and administrators. The system is intentionally limited to a 48-hour capstone scope: a responsive web interface, managed sign-in, report and claim workflows, optional single-image attachment, in-app notifications and administrator control.

## 2. Users and Roles

| Role | Capabilities |
|---|---|
| Public visitor | Browse, search and filter reports; view non-sensitive item details. |
| Student | Use all public features; create reports; submit claims; view personal reports, claims and notifications. |
| Admin | View protected reporter contact data; review claims; update item statuses; manage report lifecycle. |

## 3. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The system shall authenticate users and enforce `student` and `admin` roles at the server. | Must |
| FR-02 | A student shall create a lost-item report with title, description, category, date, location and optional permitted image. | Must |
| FR-03 | A student shall create a found-item report with the same required fields. | Must |
| FR-04 | The system shall store an optional PNG, JPEG or WebP image no larger than 4 MB in managed object storage. | Must |
| FR-05 | Public visitors shall browse reports by keyword, category, status and date using paginated results. | Must |
| FR-06 | An authenticated student shall submit a single claim with ownership evidence for an active found report they did not create. | Must |
| FR-07 | An admin shall approve or reject a pending claim and may provide a decision note. | Must |
| FR-08 | An admin shall update a report only to `lost`, `found`, `resolved` or `archived`. | Must |
| FR-09 | Reporter contact information shall remain hidden unless the requester is an admin or holds an approved claim for the exact item. | Must |
| FR-10 | The system shall create an in-app notification when a claim is approved or rejected. | Must |
| FR-11 | A student shall view own reports, claims, decision notes and notifications on a profile page. | Must |
| FR-12 | Mutating actions shall provide clear success or error feedback through toast notifications. | Should |

## 4. Non-Functional Requirements

| ID | Requirement | Acceptance measure |
|---|---|---|
| NFR-01 | Responsive experience | Important pages remain usable at mobile and desktop widths. |
| NFR-02 | Security | Role checks and contact-data policy are enforced in server procedures. |
| NFR-03 | Input integrity | Schemas validate required text, dates, status values, ownership proof and image data. |
| NFR-04 | Privacy | Public results never include reporter e-mail/contact data. |
| NFR-05 | Usability | Forms use labels, actionable errors, loading states, empty states and visible feedback. |
| NFR-06 | Maintainability | Typed contracts, small domain rules, automated tests and documented technical debt support future maintenance. |

## 5. Data Requirements

The core data entities are Users, Items, Claims and Notifications. An Item belongs to a reporting User. A Claim belongs to a claimant User and an Item; the `(itemId, claimantId)` pair is unique to prevent duplicate claims. A Notification belongs to a User and references the decision-related Item and Claim. Actual image bytes are stored outside the relational database, while only image identifiers and URLs are persisted.

## 6. Constraints and Assumptions

The system relies on the managed platform’s OAuth session, relational database and object storage. A user can have either `student` or `admin` role. In-app notifications are delivered when the recipient next opens the application; the system does not send e-mail, SMS or push notifications in version 1.0. The item directory is intentionally simplified for the expected examination-scale data volume.

## 7. Acceptance Summary

The application is acceptable when authenticated report creation, public discovery, claim restriction, admin decision, in-app notification, privacy-controlled contact revelation and permitted-status validation all operate on the published URL. The final live acceptance tests are recorded in `Testing_Report.pdf`.
