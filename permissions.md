# AqarInn Admin - Role Permissions Matrix

## Source

Based on GitHub issues #1–#22, with resolved decisions:

- Issue #9 conflict resolved:
  - Operations Admin manages Investment Opportunities.
  - Investment Manager can only view IOs and manage profit distributions/net return.
- Issue #22 resolved:
  - Dashboard is Super Admin only.
- Users management is Super Admin only.
- Notifications are available to authenticated users unless a future role-specific rule is added.

---

# Roles

## 1. Super Admin

### Main Responsibility

Full system administration.

### Allowed Features

#### Authentication

- Login
- Logout
- Reset password

#### Dashboard

- View dashboard
- View platform KPIs:
  - Total Users
  - Verified Users
  - Total Invested Amount
  - Total Returns Distributed
  - Total Withdrawals Requested
  - Total Withdrawals Paid
  - IOs overview
  - Transactions overview
- Use dashboard filters:
  - Date range
  - IO
  - Status
  - City

#### Users Management

- View users list
- Search users
- Filter users
- Add new user
- Edit existing user
- Delete user
- View user details
- Manage user roles
- Assign multiple roles to user
- Assign Investment Opportunities when user has Investment Manager role

#### Investment Opportunities

Because Super Admin has full access, they can access all IO permissions unless intentionally restricted later.

- View IO list
- View IO details
- Create new IO
- Save IO as draft
- Review IO before publishing
- Publish IO
- Edit unpublished/draft IO
- Delete IO according to business rules
- See IO activity log

#### Profit Distributions

- View Profit Distribution tab
- View distributions list
- Add net return / distribution
- View specific distribution details
- View investors included in distribution

#### Notifications

- View notifications bar
- View notifications list
- Mark notifications as read

### Blocked Features

- None currently, unless business later restricts Super Admin from operational actions.

---

## 2. Operations Admin

### Main Responsibility

Manage the full lifecycle of Investment Opportunities.

### Allowed Features

#### Authentication

- Login
- Logout
- Reset password

#### Investment Opportunities List

- View IO list
- Search IOs by:
  - ID
  - Title
  - Location
  - Status
- Filter IOs by:
  - City
  - Status
- Sort IOs by recently updated

#### Investment Opportunity Management

- Create new Investment Opportunity
- Fill IO form sections:
  - Basic Information
  - Property Details
  - Operator Details
  - Financial Details
  - Investment Settings
- Save IO as Draft
- Review IO details before publish
- Publish IO
- Edit unpublished/draft IO
- Delete IO according to rules:
  - Can soft-delete Draft IO
  - Can soft-delete future scheduled IO where allowed
  - Cannot delete active/published/funded IO if business rule prevents it
- View IO details
- View IO activity log
- Continue to publish from draft/edit flow

#### Notifications

- View notifications bar
- View notifications list
- Mark notifications as read
- Receive operational notifications:
  - IO canceled due to not being funded
  - IO fully funded
  - Profit distribution completed

### Blocked Features

#### Dashboard

- Cannot view dashboard

#### Users Management

- Cannot view users list
- Cannot add users
- Cannot edit users
- Cannot delete users
- Cannot view user details

#### Profit Distribution Actions

Depends on final implementation, but based on current issues:

- Should not add net return unless also assigned Investment Manager role
- Can receive distribution notifications

---

## 3. Investment Manager

### Main Responsibility

View assigned Investment Opportunities and manage profit distributions/net return.

### Allowed Features

#### Authentication

- Login
- Logout
- Reset password

#### Investment Opportunities

- View IO list
- View IO details
- Search IOs
- Filter IOs
- Monitor IO status/progress
- Access Profit Distribution tab from IO details

Important:
Investment Manager can view IOs, but cannot manage the IO lifecycle.

#### Profit Distributions

- View Profit Distribution tab
- View list of distributions for selected IO
- View distribution details:
  - Net Profit Amount
  - Distribution Date
  - Distributed by User ID
  - Distributed by Full Name
- Add Distribution / Add Net Return
- Enter Net Profit Amount
- Use read-only Distribution Date
- Trigger Distribute action
- Send distribution notification to investors
- Send distribution notification to Operations Admin
- View specific distribution details
- View investors in distribution:
  - National ID
  - Full Name
  - Mobile No.
  - Number of Shares
  - Profit Amount

#### Notifications

- View notifications bar
- View notifications list
- Mark notifications as read

### Blocked Features

#### Dashboard

- Cannot view dashboard

#### Users Management

- Cannot view users list
- Cannot add users
- Cannot edit users
- Cannot delete users
- Cannot view user details

#### Investment Opportunity Lifecycle

- Cannot create IO
- Cannot save IO as draft
- Cannot review IO for publishing
- Cannot publish IO
- Cannot edit IO
- Cannot delete IO

---

## 4. Read-Only Viewer

### Main Responsibility

View-only system access.

### Allowed Features

#### Authentication

- Login
- Logout
- Reset password

#### View-Only Access

Read-only viewer should only access screens/actions that are safe to view.

Expected allowed actions:

- View available lists/details where read-only access is enabled by implementation
- View notifications bar
- View notifications list

### Blocked Features

#### Dashboard

- Cannot view dashboard unless future requirement explicitly allows it

#### Users Management

- Cannot add users
- Cannot edit users
- Cannot delete users
- Should not manage user roles

#### Investment Opportunities

- Cannot create IO
- Cannot save IO as draft
- Cannot review IO for publishing
- Cannot publish IO
- Cannot edit IO
- Cannot delete IO

#### Profit Distributions

- Cannot add net return
- Cannot distribute profits
- Cannot trigger investor wallet updates

---

# Feature Matrix

| Feature / Action                   | Super Admin |  Operations Admin | Investment Manager |     Read-Only Viewer |
| ---------------------------------- | ----------: | ----------------: | -----------------: | -------------------: |
| Login                              |          ✅ |                ✅ |                 ✅ |                   ✅ |
| Logout                             |          ✅ |                ✅ |                 ✅ |                   ✅ |
| Reset password                     |          ✅ |                ✅ |                 ✅ |                   ✅ |
| View Dashboard                     |          ✅ |                ❌ |                 ❌ |                   ❌ |
| View Users List                    |          ✅ |                ❌ |                 ❌ |                   ❌ |
| Add User                           |          ✅ |                ❌ |                 ❌ |                   ❌ |
| Edit User                          |          ✅ |                ❌ |                 ❌ |                   ❌ |
| Delete User                        |          ✅ |                ❌ |                 ❌ |                   ❌ |
| View User Details                  |          ✅ |                ❌ |                 ❌ |                   ❌ |
| Multi-select User Roles            |          ✅ |                ❌ |                 ❌ |                   ❌ |
| Assign IOs to Investment Manager   |          ✅ |                ❌ |                 ❌ |                   ❌ |
| View IO List                       |          ✅ |                ✅ |                 ✅ | View-only if enabled |
| Search / Filter IO List            |          ✅ |                ✅ |                 ✅ | View-only if enabled |
| View IO Details                    |          ✅ |                ✅ |                 ✅ | View-only if enabled |
| Create IO                          |          ✅ |                ✅ |                 ❌ |                   ❌ |
| Save IO as Draft                   |          ✅ |                ✅ |                 ❌ |                   ❌ |
| Review IO Before Publish           |          ✅ |                ✅ |                 ❌ |                   ❌ |
| Publish IO                         |          ✅ |                ✅ |                 ❌ |                   ❌ |
| Edit Draft / Unpublished IO        |          ✅ |                ✅ |                 ❌ |                   ❌ |
| Delete IO                          |          ✅ |                ✅ |                 ❌ |                   ❌ |
| View Profit Distribution Tab       |          ✅ |   Maybe view only |                 ✅ | View-only if enabled |
| Add Net Return / Distribution      |          ✅ | ❌ unless also IM |                 ✅ |                   ❌ |
| View Specific Distribution Details |          ✅ |   Maybe view only |                 ✅ | View-only if enabled |
| View Notifications Bar             |          ✅ |                ✅ |                 ✅ |                   ✅ |
| View Notifications List            |          ✅ |                ✅ |                 ✅ |                   ✅ |
| Mark Notifications as Read         |          ✅ |                ✅ |                 ✅ |                   ✅ |

---

# Final Business Rules

## User Management

Only Super Admin can manage users.

This includes:

- list
- add
- edit
- delete
- details
- assign roles
- assign IO checklist for Investment Manager users

---

## Dashboard

Only Super Admin can access dashboard.

Dashboard must not be shown in sidebar for:

- Operations Admin
- Investment Manager
- Read-Only Viewer

Unauthorized users should be redirected to unauthorized page.

---

## Investment Opportunities

### Operations Admin

Can manage IO lifecycle:

- create
- draft
- review
- publish
- edit
- delete
- view

### Investment Manager

Can only:

- view IO list/details
- access profit distribution flows
- add net return / distribute profits

Investment Manager cannot:

- create IO
- edit IO
- delete IO
- publish IO
- save draft

---

## Profit Distributions

Investment Manager owns distribution flows:

- view distributions
- add net return
- distribute profits
- view specific distribution details

Super Admin can also access due to full-access rule.

Operations Admin should not distribute profits unless they also have Investment Manager role.

---

## Multi-role Users

The system supports multiple roles per user.

Permission evaluation should use union behavior:

- If user has multiple roles, they get combined permissions.
- Example:
  - Operations Admin + Investment Manager
  - Can manage IO lifecycle
  - Can also manage profit distributions

Primary role should still be stored as `role` for backward compatibility.
All roles should be stored as `roles: string[]`.

---

## Notes for Codex

- Do not treat Issue #9 actions as available to Investment Manager.
- Issue #9 means OA and IM can both view IO list.
- IO management actions belong to Operations Admin based on Issues #10–16.
- Investment Manager actions belong to Issues #17–19.
- Dashboard belongs to Super Admin only based on Issue #22.
- Keep existing UI styling.
- Only change behavior, permissions, route guards, sidebar visibility, and action visibility.
