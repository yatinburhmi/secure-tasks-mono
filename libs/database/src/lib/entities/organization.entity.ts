import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, Task } from './index';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // Self-referencing relationship for hierarchy
  @Column({ type: 'uuid', nullable: true })
  parentOrganizationId?: string | null;

  @ManyToOne(() => Organization, (org) => org.childOrganizations, {
    nullable: true,
    onDelete: 'SET NULL', // If a parent is deleted, set child's parentOrganizationId to NULL
  })
  @JoinColumn({ name: 'parentOrganizationId' })
  parentOrganization?: Organization | null;

  @OneToMany(() => Organization, (org) => org.parentOrganization)
  childOrganizations?: Organization[];

  // Other relationships
  @OneToMany(() => User, (user) => user.organization)
  users?: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks?: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
