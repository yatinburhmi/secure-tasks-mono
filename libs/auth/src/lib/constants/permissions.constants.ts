// Define permission keys as constants for consistency and type safety

// Task Permissions
export const PERM_TASK_CREATE = 'task:create';
export const PERM_TASK_READ_ALL = 'task:read:all'; // Read all tasks in org
export const PERM_TASK_READ_ASSIGNED = 'task:read:assigned'; // Read only assigned/created tasks
export const PERM_TASK_UPDATE = 'task:update';
export const PERM_TASK_DELETE = 'tasks:delete';

// New permission for viewing tasks across all organizations
export const PERM_TASK_VIEW_ALL_ORGS = 'tasks:view_all_orgs';

// User Permissions (Example)
export const PERM_USER_MANAGE = 'user:manage'; // Invite, update roles, remove users
export const PERM_USER_READ = 'user:read';

// Organization Permissions (Example)
export const PERM_ORG_UPDATE = 'org:update';
export const PERM_ORG_MANAGE_ROLES = 'org:manage_roles';

// Audit Log Permissions
export const PERM_AUDIT_READ = 'audit:read';

// Add more permissions as needed...
