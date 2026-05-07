# 🌱 GreenGov Frontend

A clean, simple, and professional React frontend for the GreenGov Government Green Initiatives Platform. Built with React, Bootstrap 5, and React Router.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Visit `http://localhost:3000` and login to see the layout.

---

## 📁 Project Structure

```
src/
├── components/              # Reusable components
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Left navigation menu
│   ├── Footer.jsx          # Bottom footer
│   ├── MainLayout.jsx      # Master layout wrapper
│   ├── Alert.jsx           # Alert notifications
│   ├── Loading.jsx         # Loading spinner
│   └── Button.jsx          # Custom button component
│
├── pages/                   # Page components
│   ├── LoginPage.jsx       # Login (public)
│   ├── DashboardPage.jsx   # Dashboard overview
│   ├── ProgramsPage.jsx    # Programs list
│   ├── ApplicationsPage.jsx# Applications list
│   ├── ProjectsPage.jsx    # Projects list
│   ├── IncentivesPage.jsx  # Incentives list
│   ├── ProfilePage.jsx     # User profile
│   └── NotFound.jsx        # 404 error page
│
├── styles/                  # CSS files
│   └── MainLayout.css      # Layout styles
│
├── api/                     # API integration
│   ├── api.js              # General API calls
│   └── authApi.js          # Auth API calls
│
├── auth/                    # Authentication
│   ├── AuthContext.js      # Auth state management
│   └── PrivateRoute.js     # Protected route wrapper
│
├── App.js                  # Main app with routing
└── index.js                # Entry point
```

---

## ✨ Features

### Layout Components
- **Navbar** - Professional header with logo, user display, and logout
- **Sidebar** - Left navigation with 6 menu items (Dashboard, Programs, Applications, Projects, Incentives, Profile)
- **Footer** - Footer with company info and links
- **MainLayout** - Master layout combining all above components

### Reusable Components
- **Alert** - Dismissible alert notifications
- **Loading** - Loading spinner with custom messages
- **Button** - Custom button with variants (primary, secondary, danger, etc.)

### Pages
- **Dashboard** - Overview with statistics cards
- **Programs** - Programs list with table
- **Applications** - Applications list with table
- **Projects** - Projects list with table
- **Incentives** - Incentives list with table
- **Profile** - User profile with settings
- **404** - Error page for invalid routes

---

## 🎨 Design

- **Framework**: Bootstrap 5.3.8
- **Responsive**: Mobile, tablet, and desktop optimized
- **Simple**: Clean folder structure, easy to navigate
- **Reusable**: Components used across multiple pages
- **Professional**: Production-ready code

### Responsive Breakpoints
- **Mobile** (< 768px): Full-width, grid sidebar
- **Tablet** (768px - 992px): Flexible layout
- **Desktop** (> 992px): Sidebar on left, content on right

---

## 🔐 Security

- Protected routes with PrivateRoute wrapper
- AuthContext for state management
- Token storage in localStorage
- Automatic redirect to login if not authenticated
- Logout functionality in navbar

---

## 📝 Usage Examples

### Using MainLayout for Pages
```jsx
import MainLayout from "../components/MainLayout";

export default function MyPage() {
  return (
    <MainLayout>
      <h2>My Page Title</h2>
      <p>Your content here...</p>
    </MainLayout>
  );
}
```

### Using Reusable Components
```jsx
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import Button from "../components/Button";

// Alert
<Alert type="success" message="Action completed!" />

// Loading
<Loading message="Fetching data..." />

// Button
<Button variant="primary" size="lg">Click Me</Button>
```

### Using Bootstrap Classes
```jsx
// Grid system
<div className="row">
  <div className="col-md-6">Column 1</div>
  <div className="col-md-6">Column 2</div>
</div>

// Card component
<div className="card">
  <div className="card-header">Title</div>
  <div className="card-body">Content</div>
</div>

// Table with Bootstrap styling
<table className="table table-striped">
  <thead>
    <tr><th>Name</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Item</td><td><span className="badge bg-success">Active</span></td></tr>
  </tbody>
</table>

// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-danger">Danger</button>
```

---

## 🛣️ Routing

| Route | Component | Type | Description |
|-------|-----------|------|-------------|
| `/` | - | - | Redirects to `/login` |
| `/login` | LoginPage | Public | Login page |
| `/dashboard` | DashboardPage | Protected | Dashboard overview |
| `/programs` | ProgramsPage | Protected | Programs list |
| `/applications` | ApplicationsPage | Protected | Applications list |
| `/projects` | ProjectsPage | Protected | Projects list |
| `/incentives` | IncentivesPage | Protected | Incentives list |
| `/profile` | ProfilePage | Protected | User profile |
| `*` | NotFound | - | 404 error page |

---

## 📱 Mobile Responsive

All components are fully responsive:
- Navbar collapses to hamburger menu on mobile
- Sidebar converts to grid layout on mobile
- Content area expands to full width on mobile
- All tables and cards adapt to mobile screens

---

## 🎯 Adding New Pages

1. Create file in `src/pages/YourPage.jsx`
2. Wrap with MainLayout:
   ```jsx
   import MainLayout from "../components/MainLayout";
   
   export default function YourPage() {
     return (
       <MainLayout>
         {/* Your content */}
       </MainLayout>
     );
   }
   ```
3. Add route in `App.js`:
   ```jsx
   <Route
     path="/your-page"
     element={
       <PrivateRoute>
         <MainLayout>
           <YourPage />
         </MainLayout>
       </PrivateRoute>
     }
   />
   ```
4. Add menu item in `Sidebar.jsx` menuItems array:
   ```jsx
   { path: "/your-page", label: "📄 Your Page" }
   ```

---

## 🎨 Adding New Components

1. Create file in `src/components/YourComponent.jsx`
2. Use Bootstrap classes for styling
3. Make it reusable
4. Import and use across pages

Example:
```jsx
export default function Card({ title, content }) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {content}
      </div>
    </div>
  );
}
```

---

## 🔗 API Integration

Use the API functions in `src/api/api.js`:

```jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import MainLayout from "../components/MainLayout";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/endpoint")
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      {error && <Alert type="danger" message={error} />}
      {loading && <Loading />}
      {!loading && <div>{/* Render data */}</div>}
    </MainLayout>
  );
}
```

---

## 🧪 Testing

Run tests with:
```bash
npm test
```

Test file: `src/__tests__/Sidebar.test.js`

Tests cover:
- Sidebar component rendering
- Menu items display
- Active route highlighting
- Mobile responsive behavior

---

## 📦 Technologies

- **React**: 19.2.5
- **Bootstrap**: 5.3.8
- **React Router**: 7.14.2
- **Axios**: 1.16.0

---

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The `build` folder contains optimized production files ready for deployment.

---

## 📚 File Descriptions

### Components
- **Navbar.jsx** - Sticky top navigation with user and logout
- **Sidebar.jsx** - Left sidebar with responsive menu
- **Footer.jsx** - Footer with links and info
- **MainLayout.jsx** - Combines Navbar, Sidebar, Footer
- **Alert.jsx** - Alert notifications (success, danger, warning, info)
- **Loading.jsx** - Loading spinner component
- **Button.jsx** - Custom button with variants and sizes

### Pages
- **LoginPage.jsx** - Login form (public route)
- **DashboardPage.jsx** - Overview with stat cards
- **ProgramsPage.jsx** - Programs table
- **ApplicationsPage.jsx** - Applications table
- **ProjectsPage.jsx** - Projects table
- **IncentivesPage.jsx** - Incentives table
- **ProfilePage.jsx** - User profile and settings
- **NotFound.jsx** - 404 error page

### Styles
- **MainLayout.css** - Layout, flexbox, responsive design

### Auth
- **AuthContext.js** - Authentication state management
- **PrivateRoute.js** - Protected route wrapper

### API
- **api.js** - General API calls with axios
- **authApi.js** - Authentication API calls

---

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm start
```

### Bootstrap classes not working
- Make sure Bootstrap CSS is imported in `index.js`
- Use valid Bootstrap class names
- Check Bootstrap 5 documentation

### Sidebar not showing menu items
- Check `Sidebar.jsx` menuItems array
- Verify routes exist in `App.js`
- Check browser console for errors

### Not responsive on mobile
- Clear browser cache
- Use DevTools mobile view
- Check CSS media queries in MainLayout.css

---

## 🎯 Common Tasks

### Change navbar logo
Edit `Navbar.jsx`:
```jsx
<a className="navbar-brand fw-bold" href="/dashboard">
  Your Logo Here
</a>
```

### Add new sidebar menu item
Edit `Sidebar.jsx` menuItems array:
```jsx
{ path: "/new-page", label: "📌 New Page" }
```

### Change color scheme
Modify Bootstrap classes in components:
- `bg-primary` → `bg-success`, `bg-danger`, etc.
- `btn-primary` → `btn-secondary`, `btn-danger`, etc.

### Customize footer
Edit `Footer.jsx` with your company info

---

## 📞 Support

Refer to component files for examples and implementation details. Each component is well-commented and straightforward.

For React help: https://react.dev
For Bootstrap help: https://getbootstrap.com
For React Router help: https://reactrouter.com

---

## 📄 License

This project is part of the GreenGov initiative.

---

**Happy Coding! 🚀**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
