import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Role, Permission } from './index';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn()
  roleId!: number;

  @PrimaryColumn('uuid')
  permissionId!: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission!: Permission;
}
