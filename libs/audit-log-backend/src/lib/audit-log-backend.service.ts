import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  MoreThanOrEqual,
  LessThanOrEqual,
  ILike,
  Between,
} from 'typeorm'; // Added Between
import { AuditLogEntity } from '@secure-tasks-mono/database';
import { FindAuditLogQueryDto } from '@secure-tasks-mono/data';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>
  ) {}

  /**
   * Creates a new audit log entry.
   * This is a fire-and-forget style method for now.
   * @param logData - Data for the audit log entry.
   */
  public async createLog(
    logData: Partial<AuditLogEntity>
  ): Promise<AuditLogEntity | null> {
    try {
      const newLog = this.auditLogRepository.create(logData);
      return await this.auditLogRepository.save(newLog);
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      return null;
    }
  }

  /**
   * Finds all audit logs for a given organization, with pagination and filtering.
   * @param organizationId - The organization's UUID.
   * @param queryDto - DTO containing pagination and filter parameters.
   */
  public async findAllLogs(
    organizationId: string,
    queryDto: FindAuditLogQueryDto
  ): Promise<{ logs: AuditLogEntity[]; total: number }> {
    const { page = 1, limit = 10, userId, action, dateFrom, dateTo } = queryDto;

    const whereConditions: any = { organizationId };

    if (userId) {
      whereConditions.userId = userId;
    }
    if (action) {
      whereConditions.action = ILike(`%${action}%`);
    }

    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999); // Include the whole end day
      whereConditions.timestamp = Between(startDate, endDate);
    } else {
      if (dateFrom) {
        whereConditions.timestamp = MoreThanOrEqual(new Date(dateFrom));
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        whereConditions.timestamp = LessThanOrEqual(endDate);
      }
    }

    const findOptions: FindManyOptions<AuditLogEntity> = {
      where: whereConditions,
      take: limit,
      skip: (page - 1) * limit,
      order: {
        timestamp: 'DESC',
      },
    };

    const [logs, total] = await this.auditLogRepository.findAndCount(
      findOptions
    );
    return { logs, total };
  }
}
