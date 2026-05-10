# Permission-Based UI Architecture Guide

## Overview

Instead of restricting sidebar/page access based on roles, all authenticated users can access all pages. Inside each page, specific UI elements and actions are conditionally rendered based on user authority/role using reusable components.

## Key Changes

### 1. Backend Security (Spring Security)
- All pages/routes are protected with `.authenticated()` - any logged-in user can access
- Specific endpoints enforce authority via `.hasAuthority()` or `.hasRole()`
- Example: POST `/api/programs/**` requires `PROGRAM_MANAGER` authority

### 2. Frontend Architecture

#### Components

**ActionButton** - Render buttons conditionally based on permissions
```jsx
<ActionButton
    authority="PROGRAM_MANAGER"
    onClick={handleCreate}
    className="btn btn-success"
>
    Create Program
</ActionButton>
```

**ContentGate** - Render entire content sections conditionally
```jsx
<ContentGate authority="PROGRAM_MANAGER">
    <CreateProgramForm />
</ContentGate>
```

## Usage Examples

### Example 1: Programs Page

```jsx
import ActionButton from "../components/ActionButton";
import ContentGate from "../components/ContentGate";

export default function ProgramsPage() {
    return (
        <div>
            {/* Button visible only to PROGRAM_MANAGER */}
            <ActionButton
                authority="PROGRAM_MANAGER"
                onClick={() => setShowForm(true)}
                className="btn btn-success"
            >
                + Create Program
            </ActionButton>

            {/* Form section visible only to PROGRAM_MANAGER */}
            <ContentGate authority="PROGRAM_MANAGER">
                <CreateProgramForm />
            </ContentGate>

            {/* Status dropdown visible only to PROGRAM_MANAGER */}
            <ContentGate authority="PROGRAM_MANAGER">
                <select onChange={(e) => updateStatus(e.target.value)}>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </ContentGate>

            {/* View button visible to everyone */}
            <ActionButton onClick={() => viewDetails()}>
                View Details
            </ActionButton>
        </div>
    );
}
```

### Example 2: Multi-Authority Access

```jsx
// Only PROGRAM_MANAGER or ADMIN can delete
<ActionButton
    authorities={["PROGRAM_MANAGER", "ADMIN"]}
    onClick={handleDelete}
    className="btn btn-danger"
>
    Delete Program
</ActionButton>

// Only officers can submit (COMPLIANCE_OFFICER OR AUDIT_MANAGER)
<ActionButton
    roles={["COMPLIANCE_OFFICER", "AUDIT_MANAGER"]}
    onClick={handleSubmit}
>
    Submit
</ActionButton>

// Require ALL authorities (both required)
<ContentGate
    authorities={["PROGRAM_MANAGER", "AUDIT_MANAGER"]}
    requireAll={true}
>
    <AdminReview />
</ContentGate>
```

### Example 3: With Fallback Content

```jsx
<ActionButton
    authority="PROGRAM_MANAGER"
    onClick={handleCreate}
    fallback={<p className="text-muted">Only Program Managers can create</p>}
>
    Create
</ActionButton>

<ContentGate
    authority="ADMIN"
    fallback={<p>Access Denied</p>}
>
    <AdminPanel />
</ContentGate>
```

## ActionButton Props

| Prop | Type | Description |
|------|------|-------------|
| `authority` | string | Single authority required (e.g., "PROGRAM_MANAGER") |
| `authorities` | array | Multiple authorities (OR by default) |
| `role` | string | Single role required |
| `roles` | array | Multiple roles |
| `requireAll` | boolean | If true, user must have ALL authorities/roles |
| `onClick` | function | Click handler |
| `className` | string | Button CSS classes |
| `disabled` | boolean | Disable button |
| `fallback` | ReactNode | Content to show if no permission |
| `...props` | any | Standard button props |

## ContentGate Props

| Prop | Type | Description |
|------|------|-------------|
| `authority` | string | Single authority required |
| `authorities` | array | Multiple authorities (OR by default) |
| `role` | string | Single role required |
| `roles` | array | Multiple roles |
| `requireAll` | boolean | If true, user must have ALL authorities/roles |
| `fallback` | ReactNode | Content to show if no permission |
| `children` | ReactNode | Content to render if permission granted |

## Authority/Role Reference

### Authorities (from backend enums)
- `ADMIN` - System administrator
- `PROGRAM_MANAGER` - Can create and manage programs
- `COMPLIANCE_OFFICER` - Can create compliance records
- `AUDIT_MANAGER` - Can initiate and manage audits
- `DISBURSEMENT_OFFICER` - Can process incentives

### Roles (from backend PrimaryRole)
- `CITIZEN` - Regular citizen user
- `BUSINESS_OWNER` - Business entity
- `OFFICER` - Government officer

## Best Practices

1. **Always show pages** - Don't block page access via components
2. **Use ActionButton for actions** - Buttons, links for specific operations
3. **Use ContentGate for sections** - Forms, panels, cards that should be hidden
4. **Provide feedback** - Use titles and fallback content for disabled features
5. **Keep it simple** - Use single authority checks when possible
6. **Reuse components** - These are framework components, use everywhere

## Migration Checklist

- [ ] Remove `RequiredPermission` wrapper from page components
- [ ] Replace `PermissionGate` with `ContentGate`
- [ ] Add `ActionButton` for all user-action elements
- [ ] Test with different user roles
- [ ] Update all page-level access controls
- [ ] Add appropriate titles to buttons for UX

## Backend Endpoint Security

```java
// Programs - Everyone can view
.requestMatchers(HttpMethod.GET, "/api/programs/**").permitAll()

// Programs - Only PROGRAM_MANAGER can create
.requestMatchers(HttpMethod.POST, "/api/programs/**")
.hasAuthority("PROGRAM_MANAGER")

// Programs - Only PROGRAM_MANAGER can update/delete
.requestMatchers(HttpMethod.PUT, "/api/programs/**")
.hasAuthority("PROGRAM_MANAGER")
.requestMatchers(HttpMethod.DELETE, "/api/programs/**")
.hasAuthority("PROGRAM_MANAGER")
```

The frontend mirrors this - buttons for create/update/delete are hidden, but even if someone tries to bypass them, the backend will reject the request.

