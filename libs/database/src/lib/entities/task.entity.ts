import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from '@secure-tasks-mono/data';
import { User, Organization } from './index'; // Updated import

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dueDate?: Date;

  @Column('uuid')
  creatorId!: string;

  @ManyToOne(() => User, (user) => user.createdTasks)
  @JoinColumn({ name: 'creatorId' })
  creator!: User;

  @Column({ type: 'uuid', nullable: true })
  assigneeId?: string | null;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User | null;

  @Column('uuid')
  organizationId!: string;

  @ManyToOne(() => Organization, (org) => org.tasks)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
