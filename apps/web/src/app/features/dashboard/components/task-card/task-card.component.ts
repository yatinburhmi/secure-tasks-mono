import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskDto, TaskStatus, UserDto } from '@secure-tasks-mono/data';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Import your actual RootState and the selector
import { RootState } from '../../../../store';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) task!: TaskDto;
  @Input() viewContext: 'list' | 'board' = 'board';
  @Output() statusChanged = new EventEmitter<{
    taskId: string;
    newStatus: TaskStatus;
  }>();
  @Output() editClicked = new EventEmitter<TaskDto>();
  @Output() deleteRequested = new EventEmitter<TaskDto>();

  // Expose TaskStatus to the template
  TaskStatusEnum = TaskStatus;

  public canModifyTask = false;
  // Renamed subscription for clarity as it's based on the user object
  private userSubscription: Subscription | undefined;

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.userSubscription = this.store
      .pipe(
        select(selectCurrentUser), // Use the actual selector from auth.selectors
        tap((user) => console.log('[TaskCard] Current user from store:', user)), // For debugging
        map((user: UserDto | null | undefined) => {
          // Explicitly type the user parameter
          if (user && typeof user.roleId === 'number') {
            const canModify = user.roleId === 1 || user.roleId === 2; // Owner or Admin
            console.log(
              `[TaskCard] User Role ID: ${user.roleId}, Can Modify: ${canModify}`
            );
            return canModify;
          }
          console.log(
            '[TaskCard] No user or invalid roleId in store; defaulting to cannot modify.'
          );
          return false;
        })
      )
      .subscribe((canModify: boolean) => {
        console.log(`[TaskCard] Setting canModifyTask to: ${canModify}`);
        this.canModifyTask = canModify;
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private categoryColorPalette: string[] = [
    'bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100',
    'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100',
    'bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100',
    'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100',
    'bg-lime-100 text-lime-700 dark:bg-lime-700 dark:text-lime-100',
    'bg-rose-100 text-rose-700 dark:bg-rose-700 dark:text-rose-100',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-700 dark:text-cyan-100',
    // Add more curated color combinations as needed
  ];

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

  getCategoryBadgeClasses(category?: string): string {
    const baseClasses =
      'text-xs font-medium inline-flex items-center px-2 py-0.5 rounded-full';
    if (!category || this.categoryColorPalette.length === 0) {
      return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200`; // Default/fallback
    }

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    const colorIndex = Math.abs(hash) % this.categoryColorPalette.length;

    return `${baseClasses} ${this.categoryColorPalette[colorIndex]}`;
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

  onEditClick(): void {
    if (this.task) {
      this.editClicked.emit(this.task);
    }
  }

  onDeleteClick(): void {
    if (this.task) {
      this.deleteRequested.emit(this.task);
    }
  }
}
