import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Organization, Role, Task } from './index';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  passwordHash!: string; // To be set by AuthService, not directly here

  @Column()
  roleId!: number;

  @ManyToOne(() => Role, (role) => role.users, { eager: false })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column('uuid')
  organizationId!: string;

  @ManyToOne(() => Organization, (org) => org.users, { eager: false })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks?: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks?: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
