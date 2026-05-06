import { createContext, useContext, useState } from "react";

/*
|--------------------------------------------------------------------------
| 1. CREATE CONTEXT (Global Auth Channel)
|--------------------------------------------------------------------------
| This creates a global "container" that will hold authentication data.
| At this point, NO data is stored yet — this is just the channel.
|
| Think of it as:
| - a pipe
| - a wire
| - a broadcast channel
|
| `null` means: if someone tries to use it without a Provider,
| the default value will be null.
*/
const AuthContext = createContext(null);

/*
|--------------------------------------------------------------------------
| 2. AUTH PROVIDER COMPONENT  ✅ MUST START WITH CAPITAL LETTER
|--------------------------------------------------------------------------
| This is a NORMAL React component.
| React *only* allows Hooks (`useState`) inside:
|   - components (Capitalized)
|   - custom hooks (starting with `use`)
|
| This component:
| - holds the auth state
| - exposes login / logout logic
| - makes auth available to ALL children
*/
export const AuthProvider = ({ children }) => {

    /*
    |--------------------------------------------------------------------------
    | 3. AUTH STATE
    |--------------------------------------------------------------------------
    | This state holds the current JWT token INSIDE React.
    |
    | We initialize it from `localStorage` so that:
    | - on page refresh
    | - the app still knows the user is logged in
    |
    | localStorage = persistence
    | React state  = reactivity (UI updates)
    */
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    /*
    |--------------------------------------------------------------------------
    | 4. LOGIN FUNCTION
    |--------------------------------------------------------------------------
    | Called AFTER successful login (API returns JWT).
    |
    | We do TWO things:
    | 1. Save token permanently (localStorage)
    | 2. Update React state (causes re-render)
    */
    const login = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
    };

    /*
    |--------------------------------------------------------------------------
    | 5. LOGOUT FUNCTION
    |--------------------------------------------------------------------------
    | Called when:
    | - user clicks logout
    | - backend returns 401 (handled by Axios)
    |
    | Again, TWO things:
    | 1. Remove token from storage
    | 2. Update React state (UI updates everywhere)
    */
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    /*
    |--------------------------------------------------------------------------
    | 6. PROVIDE AUTH TO CHILD COMPONENTS
    |--------------------------------------------------------------------------
    | Everything inside <AuthProvider> can now access:
    | - token
    | - login()
    | - logout()
    |
    | This is the SINGLE SOURCE OF TRUTH for authentication.
    */
    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/*
|--------------------------------------------------------------------------
| 7. CUSTOM HOOK FOR EASY ACCESS
|--------------------------------------------------------------------------
| Instead of writing:
|   useContext(AuthContext)
| everywhere, we create a clean custom hook.
|
| Usage in any component:
|   const { token, login, logout } = useAuth();
*/
export const useAuth = () => useContext(AuthContext);