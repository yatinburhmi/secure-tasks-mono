import { auditLogBackend } from './audit-log-backend';

describe('auditLogBackend', () => {
  it('should work', () => {
    expect(auditLogBackend()).toEqual('audit-log-backend');
  });
});
