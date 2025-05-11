import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskDto, TaskStatus } from '@secure-tasks-mono/data';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: TaskDto;
  @Input() viewContext: 'list' | 'board' = 'board';

  // Expose TaskStatus to the template
  TaskStatusEnum = TaskStatus;

  // Helper to get a specific border color for the card based on task status
  getCardBorderColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'border-yellow-500';
      case TaskStatus.IN_PROGRESS:
        return 'border-blue-500';
      case TaskStatus.DONE:
        return 'border-green-500';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  }

  isTaskOverdue(task: TaskDto): boolean {
    if (!task.dueDate) {
      return false;
    }
    // Ensure dueDate is a Date object before calling getTime()
    const dueDate =
      typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate;
    return (
      dueDate.getTime() < Date.now() && task.status !== this.TaskStatusEnum.DONE
    );
  }
}
