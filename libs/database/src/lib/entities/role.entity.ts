import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User, RolePermission, Permission } from './index'; // Updated import
import { RoleType } from '@secure-tasks-mono/data';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: RoleType, unique: true })
  name!: RoleType;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.role)
  users?: User[];

  @OneToMany(() => RolePermission, (rp) => rp.role)
  rolePermissions?: RolePermission[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  // JoinTable is on the Permission entity
  permissions?: Permission[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
