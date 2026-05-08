import { usePermission } from "../hooks/usePermission";

/**
 * PermissionGate Component
 * Conditionally renders children based on role/authority requirements
 * 
 * Usage:
 * <PermissionGate authority="PROGRAM_MANAGER">
 *   <button>Create Program</button>
 * </PermissionGate>
 * 
 * <PermissionGate role={["CITIZEN", "BUSINESS_OWNER"]}>
 *   <div>User options</div>
 * </PermissionGate>
 * 
 * <PermissionGate requireAll authorities={["PROGRAM_MANAGER", "COMPLIANCE_OFFICER"]}>
 *   <div>Requires ALL authorities</div>
 * </PermissionGate>
 */
export const PermissionGate = ({
    children,
    role,
    roles,
    authority,
    authorities,
    requireAll = false,
    fallback = null
}) => {
    const permission = usePermission();

    // Check role-based access
    if (role) {
        if (!permission.hasRole(role)) return fallback;
    }

    if (roles) {
        const hasAccess = requireAll
            ? permission.hasAllRoles(roles)
            : permission.hasAnyRole(roles);
        if (!hasAccess) return fallback;
    }

    // Check authority-based access
    if (authority) {
        if (!permission.hasAuthority(authority)) return fallback;
    }

    if (authorities) {
        const hasAccess = requireAll
            ? permission.hasAllAuthorities(authorities)
            : permission.hasAnyAuthority(authorities);
        if (!hasAccess) return fallback;
    }

    return children;
};

/**
 * RequiredPermission Component
 * Shows error message when user doesn't have permission
 */
export const RequiredPermission = ({
    children,
    role,
    roles,
    authority,
    authorities,
    requireAll = false,
    message = "You don't have permission to access this."
}) => {
    return (
        <PermissionGate
            role={role}
            roles={roles}
            authority={authority}
            authorities={authorities}
            requireAll={requireAll}
            fallback={
                <div className="alert alert-warning" role="alert">
                    {message}
                </div>
            }
        >
            {children}
        </PermissionGate>
    );
};
