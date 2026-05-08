import { useAuth } from "../auth/AuthContext";

/**
 * Custom hook for permission checking
 * Simplifies role and authority checks in components
 */
export const usePermission = () => {
    const { getRoles, getAuthorities } = useAuth();

    const roles = getRoles();
    const authorities = getAuthorities();

    return {
        // Role checks
        hasRole: (role) => roles.includes(role),
        hasAnyRole: (rolesList) => rolesList.some(r => roles.includes(r)),
        hasAllRoles: (rolesList) => rolesList.every(r => roles.includes(r)),

        // Authority checks
        hasAuthority: (authority) => authorities.includes(authority),
        hasAnyAuthority: (authoritiesList) => authoritiesList.some(a => authorities.includes(a)),
        hasAllAuthorities: (authoritiesList) => authoritiesList.every(a => authorities.includes(a)),

        // Combined checks
        isProgramManager: () => authorities.includes("PROGRAM_MANAGER"),
        isComplianceOfficer: () => authorities.includes("COMPLIANCE_OFFICER"),
        isAuditManager: () => authorities.includes("AUDIT_MANAGER"),
        isDisbursementOfficer: () => authorities.includes("DISBURSEMENT_OFFICER"),
        isCitizenOrBusiness: () => roles.includes("CITIZEN") || roles.includes("BUSINESS_OWNER"),
        isAdmin: () => authorities.includes("ADMIN"),

        // Get all roles and authorities
        getRoles: () => roles,
        getAuthorities: () => authorities,
    };
};
