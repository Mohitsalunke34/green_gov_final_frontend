// roleUtils.js
// ============================================
// Role and Authority checking utility functions
// 
// IMPORTANT: These utilities work with:
// - Roles: WITHOUT "ROLE_" prefix (e.g., "CITIZEN", "BUSINESS_OWNER")
// - Authorities: Exact names as from backend (e.g., "PROGRAM_MANAGER", "COMPLIANCE_OFFICER")
// 
// Prefer using useAuth() hook from AuthContext for real-time role/authority checking
// ============================================

/**
 * Check if user has a specific role
 * @param {string[]} userRoles - Array of user roles (without ROLE_ prefix)
 * @param {string} requiredRole - Required role name
 * @returns {boolean}
 */
export const hasRole = (userRoles, requiredRole) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    return userRoles.includes(requiredRole);
};

/**
 * Check if user has any of the specified roles
 * @param {string[]} userRoles - Array of user roles (without ROLE_ prefix)
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean}
 */
export const hasAnyRole = (userRoles, requiredRoles) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.some(role => userRoles.includes(role));
};

/**
 * Check if user has a specific authority
 * @param {string[]} userAuthorities - Array of user authorities
 * @param {string} requiredAuthority - Required authority name
 * @returns {boolean}
 */
export const hasAuthority = (userAuthorities, requiredAuthority) => {
    if (!userAuthorities || !Array.isArray(userAuthorities)) return false;
    return userAuthorities.includes(requiredAuthority);
};

/**
 * Check if user has any of the specified authorities
 * @param {string[]} userAuthorities - Array of user authorities
 * @param {string|string[]} requiredAuthorities - Required authority/authorities
 * @returns {boolean}
 */
export const hasAnyAuthority = (userAuthorities, requiredAuthorities) => {
    if (!userAuthorities || !Array.isArray(userAuthorities)) return false;
    const authoritiesArray = Array.isArray(requiredAuthorities) ? requiredAuthorities : [requiredAuthorities];
    return authoritiesArray.some(auth => userAuthorities.includes(auth));
};

/**
 * Get user claims from localStorage (fallback for components not using context)
 * @returns {Object|null} - Object with roles and authorities arrays
 */
export const getUserData = () => {
    try {
        const userClaims = localStorage.getItem("userClaims");
        return userClaims ? JSON.parse(userClaims) : null;
    } catch (err) {
        console.error("Error parsing user claims:", err);
        return null;
    }
};

/**
 * Get user roles from localStorage (fallback)
 * @returns {string[]} - Array of roles without ROLE_ prefix
 */
export const getUserRoles = () => {
    const user = getUserData();
    return user?.roles || [];
};

/**
 * Get user authorities from localStorage (fallback)
 * @returns {string[]} - Array of authorities
 */
export const getUserAuthorities = () => {
    const user = getUserData();
    return user?.authorities || [];
};
