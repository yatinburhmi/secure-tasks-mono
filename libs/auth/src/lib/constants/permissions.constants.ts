// Define permission keys as constants for consistency and type safety

// User Management Permissions (example, assuming these might exist)
export const PERM_USER_MANAGE = 'users:manage'; // General user management
export const PERM_USER_READ = 'users:read'; // View user list
export const PERM_USER_UPDATE_ROLE = 'users:update_role'; // Specific permission to change user roles

// Organization Permissions (assuming these might exist or were intended)
export const PERM_ORGANIZATION_CREATE = 'organization:create';
export const PERM_ORGANIZATION_VIEW = 'organization:view'; // General view of org details
export const PERM_ORGANIZATION_UPDATE = 'organization:update';
export const PERM_ORGANIZATION_VIEW_USERS = 'organization:view_users'; // View users within an organization
export const PERM_ORGANIZATION_MANAGE_ROLES = 'organization:manage_roles'; // If roles are org-specific

// Audit Log Permissions (example)
export const PERM_AUDIT_READ = 'audit:read';

// Task Permissions - Standardized to 'tasks:' prefix
export const PERM_TASK_CREATE = 'tasks:create';
export const PERM_TASK_VIEW_ASSIGNED = 'tasks:view_assigned'; // Viewers: see only tasks assigned to them
export const PERM_TASK_VIEW_ORG = 'tasks:view_org'; // Admins: see all tasks in their org
export const PERM_TASK_VIEW_ALL_ORGS = 'tasks:view_all_orgs'; // Owners: see tasks across all orgs
export const PERM_TASK_UPDATE = 'tasks:update';
export const PERM_TASK_DELETE = 'tasks:delete';
export const PERM_TASK_SEARCH = 'tasks:search'; // New permission for searching tasks

/**
 * List of all defined permissions.
 * Useful for seeding roles or for UIs that list all available permissions.
 * This list should reflect actual, defined permissions.
 */
export const AllPermissions = [
  PERM_USER_MANAGE,
  PERM_USER_READ,
  PERM_USER_UPDATE_ROLE,
  PERM_ORGANIZATION_CREATE,
  PERM_ORGANIZATION_VIEW,
  PERM_ORGANIZATION_UPDATE,
  PERM_ORGANIZATION_VIEW_USERS,
  PERM_ORGANIZATION_MANAGE_ROLES,
  PERM_AUDIT_READ,
  PERM_TASK_CREATE,
  PERM_TASK_VIEW_ASSIGNED,
  PERM_TASK_VIEW_ORG,
  PERM_TASK_VIEW_ALL_ORGS,
  PERM_TASK_UPDATE,
  PERM_TASK_DELETE,
  PERM_TASK_SEARCH,
];

// It might also be useful to group permissions by resource for easier management
export const UserPermissions = {
  MANAGE: PERM_USER_MANAGE,
  READ: PERM_USER_READ,
  UPDATE_ROLE: PERM_USER_UPDATE_ROLE,
};

export const OrganizationPermissions = {
  CREATE: PERM_ORGANIZATION_CREATE,
  VIEW: PERM_ORGANIZATION_VIEW,
  UPDATE: PERM_ORGANIZATION_UPDATE,
  VIEW_USERS: PERM_ORGANIZATION_VIEW_USERS,
  MANAGE_ROLES: PERM_ORGANIZATION_MANAGE_ROLES,
};

export const TaskPermissions = {
  CREATE: PERM_TASK_CREATE,
  VIEW_ASSIGNED: PERM_TASK_VIEW_ASSIGNED,
  VIEW_ORG: PERM_TASK_VIEW_ORG,
  VIEW_ALL_ORGS: PERM_TASK_VIEW_ALL_ORGS,
  UPDATE: PERM_TASK_UPDATE,
  DELETE: PERM_TASK_DELETE,
  SEARCH: PERM_TASK_SEARCH,
};

export const AuditPermissions = {
  READ: PERM_AUDIT_READ,
};

// Ensure all constants are exported if this file is directly imported elsewhere
// Or rely on index.ts barrel file if that's the pattern.
// The individual const exports above are usually sufficient.
