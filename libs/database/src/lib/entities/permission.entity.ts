import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role, RolePermission } from './index'; // Updated import

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid') // Using UUID for flexibility
  id!: string;

  @Column({ unique: true })
  key!: string; // e.g., task:create, user:delete

  @Column({ nullable: true })
  description?: string;

  // Link to roles via the join entity
  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions?: RolePermission[];

  // Define the owning side of the ManyToMany relationship
  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'role_permissions', // Explicitly name the join table
    joinColumn: { name: 'permissionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles?: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
