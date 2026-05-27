# 🎨 GreenGov Frontend - UI Documentation

**Version:** 1.0.0  
**Last Updated:** May 26, 2026  
**Project:** GreenGov Government Green Initiatives Platform

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Design System](#design-system)
3. [Component Library](#component-library)
4. [Page Components](#page-components)
5. [Layout Architecture](#layout-architecture)
6. [Styling Guidelines](#styling-guidelines)
7. [Permission-Based UI Control](#permission-based-ui-control)
8. [Toast Notifications](#toast-notifications)
9. [Best Practices](#best-practices)
10. [Responsive Design](#responsive-design)

---

## 📖 Introduction

### Overview
The GreenGov Frontend is a React-based administrative dashboard designed for managing government green initiatives. It provides a comprehensive interface for handling programs, applications, projects, incentives, and compliance management with role-based access control.

### Technology Stack
- **Framework:** React 19.2.5
- **UI Library:** Bootstrap 5.3.8
- **Routing:** React Router DOM 7.14.2
- **HTTP Client:** Axios 1.16.0
- **Icons:** React Icons 5.6.0, Lucide React 1.14.0
- **Charts:** Recharts 3.8.1
- **Notifications:** React Toastify 11.1.0

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#2d5016` | Buttons, links, primary actions |
| Light Green | `#4a7a28` | Hover states, secondary accents |
| White | `#FFFFFF` | Backgrounds, text on dark |
| Light Gray | `#f5f5f5` | Secondary backgrounds |
| Dark Gray | `#333333` | Primary text |
| Border Gray | `#ddd` | Borders, dividers |
| Success | `#28a745` | Success states, confirmations |
| Danger | `#dc3545` | Errors, deletions, warnings |
| Warning | `#ffc107` | Warnings, pending actions |
| Info | `#17a2b8` | Information, help text |

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
```

#### Heading Styles
- **H1:** 32px, Bold, Primary color
- **H2:** 24px, Bold, Primary color
- **H3:** 20px, Semi-bold, Dark gray
- **H4:** 16px, Semi-bold, Dark gray
- **H5:** 14px, Normal, Dark gray
- **H6:** 12px, Normal, Dark gray

#### Body Text
- **Regular:** 14px, Normal weight
- **Small:** 12px, Normal weight
- **Large:** 16px, Normal weight

### Spacing Scale
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **xxl:** 48px

### Border Radius
- **sm:** 4px (form inputs, small components)
- **md:** 8px (cards, buttons)
- **lg:** 12px (large containers)
- **xl:** 16px (full modals)
- **full:** 9999px (badges, pills)

### Shadows

```css
/* Shadow Levels */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);        /* Level 1 */
box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);        /* Level 2 */
box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);       /* Level 3 */
box-shadow: 0 10px 24px rgba(0, 0, 0, 0.20);      /* Level 4 */
```

---

## 🧩 Component Library

### Core Components

#### 1. **Button Component**
**File:** `src/components/Button.jsx`

**Props:**
```jsx
{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light',
  size?: 'sm' | 'md' | 'lg',
  disabled?: boolean,
  loading?: boolean,
  className?: string,
  onClick?: (e: Event) => void,
  children?: ReactNode,
  type?: 'button' | 'submit' | 'reset',
  fullWidth?: boolean,
  icon?: ReactNode,
}
```

**Usage Examples:**

```jsx
// Primary button
<Button variant="primary" onClick={handleSave}>Save</Button>

// Danger button with icon
<Button variant="danger" size="sm">
  <Trash2 size={16} /> Delete
</Button>

// Full width button
<Button variant="primary" fullWidth>Submit Form</Button>

// Loading state
<Button loading>Processing...</Button>
```

---

#### 2. **Alert Component**
**File:** `src/components/Alert.jsx`

**Props:**
```jsx
{
  type?: 'success' | 'danger' | 'warning' | 'info',
  title?: string,
  message: string,
  dismissible?: boolean,
  onDismiss?: () => void,
  icon?: ReactNode,
}
```

**Usage Examples:**

```jsx
// Info alert
<Alert 
  type="info"
  message="Your profile has been updated successfully."
  dismissible
/>

// Danger alert with title
<Alert
  type="danger"
  title="Error"
  message="Failed to save application. Please try again."
/>
```

---

#### 3. **Loading Component**
**File:** `src/components/Loading.jsx`

**Props:**
```jsx
{
  message?: string,
  size?: 'sm' | 'md' | 'lg',
  fullScreen?: boolean,
}
```

**Usage Examples:**

```jsx
// Inline loading
<Loading message="Loading applications..." />

// Full screen loading
<Loading fullScreen message="Initializing..." />

// Small spinner
<Loading size="sm" />
```

---

#### 4. **Toast Component**
**File:** `src/components/Toast.jsx`

**Props:**
```jsx
{
  type?: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration?: number,
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  action?: {
    label: string,
    onClick: () => void,
  },
}
```

**Usage Examples:**

```jsx
// Success toast
import { toast } from 'react-toastify';
toast.success('Application submitted successfully!');

// Error toast with action
toast.error('Failed to upload document', {
  position: 'bottom-right',
  autoClose: 5000,
});

// Info toast
toast.info('Document processing in progress...');
```

---

#### 5. **ContentGate Component**
**File:** `src/components/ContentGate.jsx`

Permission-based UI wrapper for conditional rendering based on user authorities.

**Props:**
```jsx
{
  authority: string | string[],
  children: ReactNode,
  fallback?: ReactNode,
}
```

**Usage Examples:**

```jsx
// Show only to admins
<ContentGate authority="ADMIN">
  <div>Admin only content</div>
</ContentGate>

// Multiple authorities (OR logic)
<ContentGate authority={['ADMIN', 'PROGRAM_OFFICER']}>
  <div>Accessible to admin or program officers</div>
</ContentGate>

// With fallback
<ContentGate 
  authority="SENIOR_OFFICER"
  fallback={<p>You don't have access to this section</p>}
>
  <SensitiveData />
</ContentGate>
```

---

#### 6. **ActionButton Component**
**File:** `src/components/ActionButton.jsx`

Permission-aware button that respects user authorities.

**Props:**
```jsx
{
  authority?: string | string[],
  action: 'edit' | 'delete' | 'view' | 'approve' | 'reject' | 'download',
  onClick: () => void,
  size?: 'sm' | 'md' | 'lg',
  disabled?: boolean,
  className?: string,
  tooltip?: string,
}
```

**Usage Examples:**

```jsx
// Edit button for officers
<ActionButton
  authority="PROGRAM_OFFICER"
  action="edit"
  onClick={handleEdit}
  tooltip="Edit this application"
/>

// Delete with confirmation
<ActionButton
  authority="ADMIN"
  action="delete"
  onClick={() => {
    if (window.confirm('Are you sure?')) {
      handleDelete();
    }
  }}
/>
```

---

#### 7. **DocumentUploadModal Component**
**File:** `src/components/DocumentUploadModal.jsx`

Modal for uploading documents with validation.

**Props:**
```jsx
{
  isOpen: boolean,
  onClose: () => void,
  onUpload: (files: File[]) => Promise<void>,
  title?: string,
  allowedFormats?: string[],
  maxFileSize?: number,
  multiple?: boolean,
}
```

**Usage Examples:**

```jsx
const [isOpen, setIsOpen] = useState(false);

<DocumentUploadModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onUpload={async (files) => {
    await uploadDocuments(files);
    toast.success('Documents uploaded successfully');
  }}
  title="Upload Project Documents"
  allowedFormats={['.pdf', '.doc', '.docx']}
  maxFileSize={5242880} // 5MB
  multiple={true}
/>
```

---

### Layout Components

#### 1. **MainLayout Component**
**File:** `src/components/MainLayout.jsx`

Master layout wrapper combining Navbar, Sidebar, Footer, and page content.

**Props:**
```jsx
{
  children: ReactNode,
  showSidebar?: boolean,
  showFooter?: boolean,
}
```

**Usage Examples:**

```jsx
// In App.js or route configuration
<MainLayout>
  <DashboardPage />
</MainLayout>

// Without sidebar (for auth pages)
<MainLayout showSidebar={false} showFooter={false}>
  <LoginPage />
</MainLayout>
```

---

#### 2. **Navbar Component**
**File:** `src/components/Navbar.jsx`

Top navigation bar with logo, navigation links, and user menu.

**Features:**
- Logo display
- Application title
- User profile dropdown
- Logout functionality
- Responsive mobile menu

**Usage:**
Automatically rendered in `MainLayout`.

---

#### 3. **Sidebar Component**
**File:** `src/components/Sidebar.jsx`

Left-side navigation with menu items based on user permissions.

**Menu Items:**
- Dashboard
- Programs
- Applications
- Projects
- Incentives
- Compliance
- Reports
- Resources
- Officers Management
- Profile
- Audit Logs

**Features:**
- Collapsible on mobile
- Active state highlighting
- Permission-based visibility
- Icons for each menu item

**Usage:**
Automatically rendered in `MainLayout`.

---

#### 4. **Footer Component**
**File:** `src/components/Footer.jsx`

Application footer with company information and links.

**Content Areas:**
- Company information
- Quick links
- Disclaimer
- Copyright notice

**Usage:**
Automatically rendered in `MainLayout`.

---

## 📄 Page Components

### 1. **LoginPage**
**File:** `src/pages/LoginPage.jsx`

Public authentication page for user login.

**Features:**
- Email/username input
- Password input
- "Remember me" checkbox
- "Forgot password" link
- Responsive form layout

**Props:** None (uses authentication context)

---

### 2. **DashboardPage**
**File:** `src/pages/DashboardPage.jsx`

Main dashboard overview with key statistics and charts.

**Sections:**
- Welcome message
- Statistics cards (Programs, Applications, Projects, Incentives)
- Activity charts
- Recent activities list
- Quick actions

**Features:**
- Real-time data updates
- Permission-based content visibility
- Responsive grid layout

---

### 3. **ProgramsPage**
**File:** `src/pages/ProgramsPage.jsx`

Programs management interface.

**Features:**
- Sortable/filterable table
- Add new program
- Edit existing programs
- Delete programs
- View program details
- Permission-based actions

---

### 4. **ApplicationsPage**
**File:** `src/pages/ApplicationsPage.jsx`

Applications management interface.

**Features:**
- Status filtering (Pending, Approved, Rejected)
- Sortable table
- View application details
- Download attachments
- Approve/reject applications
- Permission-based visibility

---

### 5. **ProjectsPage**
**File:** `src/pages/ProjectsPage.jsx`

Projects management interface.

**Features:**
- Project listing with status
- Create new project
- Edit project details
- Assign personnel
- Track progress
- Permission-based actions

---

### 6. **IncentivesPage**
**File:** `src/pages/IncentivesPage.jsx`

Incentives management interface.

**Features:**
- Incentives listing
- Create/edit incentives
- Disbursement tracking
- Permission-based visibility

---

### 7. **CompliancePage**
**File:** `src/pages/CompliancePage.jsx`

Compliance management interface.

**Features:**
- Compliance status overview
- Non-compliance alerts
- Documentation tracking
- Compliance history

---

### 8. **ReportsPage**
**File:** `src/pages/ReportsPage.jsx`

Reports and analytics interface.

**Report Types:**
- Program reports
- Application status reports
- Project progress reports
- Financial reports
- Compliance reports

**Features:**
- Report generation
- Export to PDF/Excel
- Date range filtering
- Custom report builder

---

### 9. **AuditPage**
**File:** `src/pages/AuditPage.jsx`

Audit logs and activity tracking interface.

**Features:**
- Activity log listing
- User action tracking
- Timestamp and details
- Filter by user/action/date
- Export audit reports

---

### 10. **ResourcesPage**
**File:** `src/pages/ResourcesPage.jsx`

Resource management interface.

**Features:**
- Resource listing
- Add/edit resources
- Delete resources
- Allocate resources to projects

---

### 11. **OfficersManagementPage**
**File:** `src/pages/OfficersManagementPage.jsx`

Officer and user management interface (Admin only).

**Features:**
- Add new officers
- Edit officer details
- Assign roles/authorities
- Deactivate officers
- View officer activity

---

### 12. **ProfilePage**
**File:** `src/pages/ProfilePage.jsx`

User profile and settings interface.

**Sections:**
- Profile information
- Change password
- Preferences
- Activity history

---

### 13. **EnvironmentalDashboard**
**File:** `src/pages/EnvironmentalDashboard.jsx`

Environmental metrics and sustainability tracking.

**Features:**
- Carbon footprint tracking
- Environmental impact metrics
- Project sustainability data
- Charts and visualizations

---

### 14. **Error Pages**

#### NotFoundPage
**File:** `src/pages/NotFoundPage.jsx`

404 error page for invalid routes.

#### NotFound
**File:** `src/pages/NotFound.jsx`

Alternative 404 error component.

---

### 15. **Authorization Pages**

#### ForgotPasswordPage
**File:** `src/pages/ForgotPasswordPage.jsx`

Password recovery interface.

#### SetupProfilePage
**File:** `src/pages/SetupProfilePage.jsx`

Initial profile setup for new users.

#### RegisterPage
**File:** `src/pages/RegisterPage.jsx`

User registration interface.

---

## 🏗️ Layout Architecture

### Layout Structure

```
MainLayout
├── Navbar
│   ├── Logo
│   ├── Title
│   └── User Menu
│
├── Container
│   ├── Sidebar
│   │   └── Navigation Menu (permission-based)
│   │
│   └── Main Content
│       └── Page Content (dynamic)
│
└── Footer
    ├── Company Info
    ├── Links
    └── Copyright
```

### Responsive Breakpoints

| Screen Size | Breakpoint | Layout |
|-------------|-----------|--------|
| Mobile | < 768px | Full-width, collapsed sidebar |
| Tablet | 768px - 992px | Flexible layout, sidebar on request |
| Desktop | > 992px | Fixed sidebar, full layout |

### CSS Files

**MainLayout.css**
```css
/* Layout grid system */
.main-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: absolute;
    width: 250px;
    z-index: 100;
  }
}
```

**Sidebar.css**
```css
/* Sidebar styling */
.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 0;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu-item {
  padding: 12px 16px;
  border-left: 3px solid transparent;
}

.sidebar-menu-item.active {
  background-color: #e8f5e9;
  border-left-color: #2d5016;
  color: #2d5016;
}
```

---

## 🎯 Styling Guidelines

### CSS Architecture

1. **Component-level CSS**
   - Each component has its own CSS file
   - Scoped to component's className
   - Follows BEM naming convention

2. **Bootstrap Utilities**
   - Use Bootstrap classes for spacing, sizing, alignment
   - Custom CSS only for component-specific styles
   - Maintain consistency with design system

3. **Inline Styles**
   - Minimal use, only for dynamic values
   - Prefer CSS classes for static styles

### CSS Naming Conventions

```css
/* BEM Naming */
.component-name {}
.component-name__element {}
.component-name__element--modifier {}

/* Examples */
.btn {}
.btn--primary {}
.btn__icon {}

.sidebar {}
.sidebar__menu {}
.sidebar__menu-item {}
.sidebar__menu-item--active {}
```

### Common CSS Classes

```jsx
// Spacing
className="mb-3"      // Margin bottom
className="mt-2"      // Margin top
className="p-4"       // Padding
className="mx-auto"   // Margin horizontal auto

// Layout
className="d-flex"                    // Flexbox
className="justify-content-between"   // Flex alignment
className="align-items-center"        // Align items

// Text
className="text-center"       // Text alignment
className="text-muted"        // Muted text
className="fw-bold"           // Font weight
className="text-danger"       // Colored text

// Display
className="d-none d-md-block"  // Hide on mobile, show on tablet+
className="d-md-none"          // Hide on tablet+, show on mobile
```

---

## 🔐 Permission-Based UI Control

### Permission System Overview

User permissions are managed through authorities and roles. The system supports three main approaches for permission-based UI control:

### 1. **usePermission Hook**
**File:** `src/hooks/usePermission.js`

The most flexible approach for permission checks in component logic.

**Available Methods:**
```javascript
const {
  isAdmin,                    // Check if user is admin
  isDisbursementOfficer,      // Check if disbursement officer
  isProgramOfficer,           // Check if program officer
  isSeniorOfficer,            // Check if senior officer
  hasAuthority,               // Check specific authority
  getAuthorities,             // Get all user authorities
  canPerformAction,           // Check if can perform action
} = usePermission();
```

**Usage Examples:**

```jsx
import { usePermission } from "../hooks/usePermission";

export default function AdminPanel() {
  const { isAdmin, hasAuthority } = usePermission();

  if (!isAdmin()) {
    return <p>Unauthorized</p>;
  }

  return (
    <div>
      {hasAuthority('DELETE_USER') && (
        <Button onClick={deleteUser}>Delete User</Button>
      )}
    </div>
  );
}
```

### 2. **ContentGate Component**
**File:** `src/components/ContentGate.jsx`

Wrapper for conditional rendering based on authorities.

**Usage Examples:**

```jsx
// Single authority
<ContentGate authority="ADMIN">
  <AdminSection />
</ContentGate>

// Multiple authorities (OR logic)
<ContentGate authority={['ADMIN', 'PROGRAM_OFFICER']}>
  <EditableContent />
</ContentGate>

// With fallback
<ContentGate 
  authority="SENIOR_OFFICER"
  fallback={<NoAccess />}
>
  <SensitiveData />
</ContentGate>
```

### 3. **ActionButton Component**
**File:** `src/components/ActionButton.jsx`

Permission-aware button for role-specific actions.

**Usage Examples:**

```jsx
// Officer-level edit
<ActionButton
  authority="PROGRAM_OFFICER"
  action="edit"
  onClick={handleEdit}
/>

// Admin-level delete
<ActionButton
  authority="ADMIN"
  action="delete"
  onClick={handleDelete}
/>

// Approve action (disbursement)
<ActionButton
  authority="DISBURSEMENT_OFFICER"
  action="approve"
  onClick={handleApprove}
/>
```

### Available Authorities

| Authority | Description | Level |
|-----------|-------------|-------|
| `ADMIN` | Full system access | 5 |
| `SENIOR_OFFICER` | Senior management | 4 |
| `PROGRAM_OFFICER` | Program management | 3 |
| `DISBURSEMENT_OFFICER` | Disbursement/Finance | 2 |
| `COMPLIANCE_OFFICER` | Compliance tracking | 2 |
| `USER` | Basic user | 1 |

---

## 🔔 Toast Notifications

### Toast System Architecture

**File:** `src/components/Toast.jsx`

Integrated with `react-toastify` for non-intrusive notifications.

### Toast Types

```jsx
import { toast } from 'react-toastify';

// Success notification
toast.success('Operation completed successfully!');

// Error notification
toast.error('An error occurred. Please try again.');

// Warning notification
toast.warning('Please review the information before proceeding.');

// Info notification
toast.info('This is an informational message.');

// Loading notification
const id = toast.loading('Processing your request...');
// Later...
toast.update(id, {
  render: 'Completed!',
  type: 'success',
  isLoading: false,
  autoClose: 3000,
});
```

### Toast Configuration

```jsx
// With options
toast.success('Saved successfully!', {
  position: 'top-right',           // top-left, top-right, bottom-left, bottom-right
  autoClose: 5000,                 // Auto-close after 5 seconds
  hideProgressBar: false,          // Show progress bar
  closeOnClick: true,              // Close on click
  pauseOnHover: true,              // Pause auto-close on hover
  draggable: true,                 // Enable drag to dismiss
});

// With action
toast.info('Click here to undo', {
  autoClose: false,
  closeButton: false,
  action: (props) => (
    <button onClick={handleUndo}>Undo</button>
  ),
});
```

### Toast Best Practices

1. **Use appropriate types**
   - Success: Positive actions completed
   - Error: Failed operations
   - Warning: Important information
   - Info: General notifications

2. **Keep messages short**
   - Max 60 characters for quick scanning
   - Use clear, action-oriented language

3. **Avoid overuse**
   - One notification at a time for critical info
   - Group related notifications

4. **Position strategically**
   - `top-right`: Most common for alerts
   - `bottom-left`: For form feedback
   - `top-center`: For system-wide notifications

---

## ✅ Best Practices

### Component Development

1. **File Organization**
   ```
   component/
   ├── ComponentName.jsx      # Component logic
   ├── ComponentName.css      # Styling
   └── ComponentName.test.js  # Tests
   ```

2. **Naming Conventions**
   - Components: PascalCase (`UserProfile.jsx`)
   - Files: Match component name
   - Props: camelCase
   - CSS classes: kebab-case (`user-profile`)

3. **Props Validation**
   ```jsx
   import PropTypes from 'prop-types';

   MyComponent.propTypes = {
     title: PropTypes.string.isRequired,
     count: PropTypes.number,
     onClick: PropTypes.func,
   };

   MyComponent.defaultProps = {
     count: 0,
   };
   ```

4. **State Management**
   - Use Context API for global state
   - Use local state for component-specific data
   - Avoid prop drilling

5. **Error Handling**
   ```jsx
   try {
     const response = await api.fetchData();
     setData(response);
   } catch (error) {
     toast.error('Failed to load data');
     console.error(error);
   }
   ```

### Performance Optimization

1. **Memoization**
   ```jsx
   const MemoizedComponent = React.memo(MyComponent);
   ```

2. **Code Splitting**
   ```jsx
   const LazyComponent = React.lazy(() => import('./Component'));
   ```

3. **Event Handler Optimization**
   ```jsx
   const handleClick = useCallback(() => {
     // Handle click
   }, [dependencies]);
   ```

### Accessibility (a11y)

1. **Semantic HTML**
   ```jsx
   <button>Click me</button>      // Correct
   <div onClick={handler}>Click</div>  // Avoid
   ```

2. **ARIA Labels**
   ```jsx
   <button aria-label="Close menu">×</button>
   <div role="alert" aria-live="polite">Message</div>
   ```

3. **Keyboard Navigation**
   - Tab order should be logical
   - Tab-trap in modals
   - Escape key to close

4. **Color Contrast**
   - Text: Minimum 4.5:1 ratio
   - Large text: Minimum 3:1 ratio

---

## 📱 Responsive Design

### Mobile-First Approach

Design starts with mobile (< 768px), then scales up.

### Breakpoint Strategy

```css
/* Mobile (default) */
.container { width: 100%; }

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop (992px and up) */
@media (min-width: 992px) {
  .container { width: 960px; }
}

/* Large Desktop (1200px and up) */
@media (min-width: 1200px) {
  .container { width: 1140px; }
}
```

### Bootstrap Grid System

```jsx
// Responsive grid
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">
    Content that spans full width on mobile,
    50% on tablet, 33% on desktop
  </div>
</div>
```

### Images and Media

```jsx
// Responsive images
<img 
  src="image.jpg" 
  className="img-fluid" 
  alt="Description"
/>

// Picture element for art direction
<picture>
  <source media="(max-width: 768px)" srcSet="mobile.jpg" />
  <source media="(max-width: 992px)" srcSet="tablet.jpg" />
  <img src="desktop.jpg" alt="Description" />
</picture>
```

### Touch-Friendly UI

- Minimum touch target: 44x44px
- Spacing between interactive elements: 8px minimum
- Consider thumb-reachable zones on mobile

---

## 🚀 Getting Started

### Installation

```bash
# Clone repository
git clone https://github.com/Mohitsalunke34/green_gov_final_frontend.git

# Navigate to project
cd green_gov_final_frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Development Workflow

```bash
# Start dev server (http://localhost:3000)
npm start

# Run tests
npm test

# Build for production
npm run build

# Analyze bundle size
npm run build -- --analyze
```

---

## 📞 Support & Contribution

For questions, bug reports, or contributions:

1. **Bug Reports:** Create an issue with detailed description
2. **Feature Requests:** Discuss in project discussions
3. **Pull Requests:** Follow PR template and code standards

---

## 📄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 26, 2026 | Initial UI documentation |

---

## 📝 License

GreenGov Frontend © 2026. All rights reserved.

---

**Last Updated:** May 26, 2026  
**Maintained By:** GreenGov Development Team
