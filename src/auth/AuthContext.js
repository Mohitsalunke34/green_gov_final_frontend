
import { createContext, useContext, useState, useCallback, useMemo } from "react";

/*
|---------------------------------------------------------------------------
| JWT PARSING UTILITY
|---------------------------------------------------------------------------
| Decodes JWT payload to extract claims
*/
const parseJwt = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replaceAll("-", "+").replaceAll("_", "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.codePointAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
};

/*
|---------------------------------------------------------------------------
| CREATE CONTEXT (Global Auth Channel)
|---------------------------------------------------------------------------
*/
const AuthContext = createContext(null);

/*
|---------------------------------------------------------------------------
| AUTH PROVIDER COMPONENT
|---------------------------------------------------------------------------
| Token now includes: userId, roles, authorities, sub, exp, iat...
*/
export const AuthProvider = ({ children }) => {
  // Read token from localStorage on first load
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Decode token (also from localStorage on first load)
  const [decodedToken, setDecodedToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? parseJwt(savedToken) : null;
  });

  /*
  |---------------------------------------------------------------------------
  | TOKEN EXPIRY CHECK (Optional but recommended)
  |---------------------------------------------------------------------------
  */
  const isTokenExpired = useMemo(() => {
    const exp = decodedToken?.exp;
    if (!exp) return false; // if exp missing, treat as non-expired
    return Date.now() >= exp * 1000; // exp is usually in seconds
  }, [decodedToken]);

  /*
  |---------------------------------------------------------------------------
  | LOGIN FUNCTION
  |---------------------------------------------------------------------------
  | Stores token, decodes it, stores claims in localStorage
  */
  const login = useCallback((jwtToken) => {
    // Save token
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    // Decode token
    const decoded = parseJwt(jwtToken);
    setDecodedToken(decoded);

    // Store important fields for quick access (optional)
    if (decoded) {
      localStorage.setItem(
        "userClaims",
        JSON.stringify({
          userId: decoded.userId ?? null,
          roles: decoded.roles || [],
          authorities: decoded.authorities || [],
          username: decoded.sub || "",
          exp: decoded.exp ?? null,
        })
      );
    } else {
      // If decode fails, still remove claims so you don't keep stale values
      localStorage.removeItem("userClaims");
    }
  }, []);

  /*
  |---------------------------------------------------------------------------
  | LOGOUT FUNCTION
  |---------------------------------------------------------------------------
  */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userClaims");
    setToken(null);
    setDecodedToken(null);
  }, []);

  /*
  |---------------------------------------------------------------------------
  | GETTERS
  |---------------------------------------------------------------------------
  */
  const getUserId = useCallback(() => {
    return decodedToken?.userId ?? null;
  }, [decodedToken]);

  const getUsername = useCallback(() => {
    return decodedToken?.sub ?? null;
  }, [decodedToken]);

  const getRoles = useCallback(() => {
    const roles = decodedToken?.roles || [];
    return roles.map((r) => (typeof r === "string" ? r.replace("ROLE_", "") : r));
  }, [decodedToken]);

  const getAuthorities = useCallback(() => {
    return decodedToken?.authorities || [];
  }, [decodedToken]);

  const getBeneficiaryId = useCallback(() => {
    return decodedToken?.beneficiaryId ?? null;
  }, [decodedToken]);

  /*
  |---------------------------------------------------------------------------
  | CONVENIENCE HELPERS
  |---------------------------------------------------------------------------
  */
  const hasRole = useCallback(
    (role) => {
      if (!role) return false;
      return getRoles().includes(role);
    },
    [getRoles]
  );

  const hasAuthority = useCallback(
    (authority) => {
      if (!authority) return false;
      return getAuthorities().includes(authority);
    },
    [getAuthorities]
  );

  /*
  |---------------------------------------------------------------------------
  | AUTH STATE
  |---------------------------------------------------------------------------
  | Only authenticated if token exists AND is not expired
  */
  const isAuthenticated = !!token && !isTokenExpired;

  /*
  |---------------------------------------------------------------------------
  | PROVIDE AUTH TO CHILD COMPONENTS (MEMOIZED)
  |---------------------------------------------------------------------------
  */
  const contextValue = useMemo(
    () => ({
      // raw token + decoded payload
      token,
      decodedToken,

      // actions
      login,
      logout,

      // getters
      getUserId,
      getUsername,
      getRoles,
      getAuthorities,
      getBeneficiaryId,

      // helpers
      hasRole,
      hasAuthority,

      // auth flags
      isAuthenticated,
      isTokenExpired,
    }),
    [token, decodedToken, login, logout, getUserId, getUsername, getRoles, getAuthorities, getBeneficiaryId, hasRole, hasAuthority, isAuthenticated, isTokenExpired]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/*
|---------------------------------------------------------------------------
| CUSTOM HOOK
|---------------------------------------------------------------------------
*/
export const useAuth = () => useContext(AuthContext);