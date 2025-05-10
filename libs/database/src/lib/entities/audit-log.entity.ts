import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
@Index(['organizationId', 'timestamp']) // Index for efficient querying by org and time
@Index(['userId', 'action']) // Index for filtering by user and action
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp!: Date;

  @Column('uuid', { nullable: true })
  @Index() // Individual index on userId might be useful
  userId?: string | null;

  @Column('uuid')
  organizationId!: string;

  @Column({ type: 'varchar', length: 255 })
  action!: string; // e.g., TASK_CREATED, USER_LOGIN_SUCCESS

  @Column({ type: 'simple-json', nullable: true })
  details?: Record<string, any> | null; // Flexible JSONB/TEXT for context
}
