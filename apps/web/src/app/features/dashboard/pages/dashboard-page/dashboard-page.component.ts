import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto, TaskStatus } from '@secure-tasks-mono/data';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootState } from '../../../../store'; // Corrected path
import * as TasksActions from '../../../../store/tasks/tasks.actions'; // Corrected path
// Assuming these selectors exist or will be created. If not, we'll need to adjust.
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from '../../../../store/tasks/tasks.selectors'; // Corrected path

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  pageTitle = 'Task Management';
  currentView: 'list' | 'board' = 'list';

  statusFilters: string[] = ['All', ...Object.values(TaskStatus)];
  selectedStatusFilter = 'All';

  // These will be populated from the store via allTasks$
  allTasks: TaskDto[] = [];
  pendingTasks: TaskDto[] = [];
  inProgressTasks: TaskDto[] = [];
  doneTasks: TaskDto[] = [];
  listTasks: TaskDto[] = [];

  // Observables from the store
  allTasks$!: Observable<TaskDto[]>; // Added ! for definite assignment in constructor/ngOnInit
  isLoading$!: Observable<boolean>; // Added !
  error$!: Observable<string | null>; // Added !

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());

    this.allTasks$ = this.store.select(selectAllTasks);
    this.isLoading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);

    // Subscribe to tasks from the store to update local component arrays
    // This maintains compatibility with existing filtering logic.
    // A more advanced refactor could move filtering into selectors or use async pipe more directly.
    this.allTasks$.subscribe((tasks) => {
      this.allTasks = tasks;
      this._filterTasksByStatus(); // For board view columns
      this._updateListTasks(); // Initialize for list view
    });

    // Keep status filters initialization
    this.statusFilters = ['All', ...Object.values(TaskStatus)];
  }

  private _filterTasksByStatus(): void {
    this.pendingTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.PENDING
    );
    this.inProgressTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    );
    this.doneTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.DONE
    );
  }

  private _updateListTasks(): void {
    if (this.selectedStatusFilter === 'All' || !this.selectedStatusFilter) {
      this.listTasks = [...this.allTasks];
    } else {
      this.listTasks = this.allTasks.filter(
        (task) => task.status === (this.selectedStatusFilter as TaskStatus)
      );
    }
  }

  setView(view: 'list' | 'board'): void {
    this.currentView = view;
    this.pageTitle = view === 'board' ? 'Task Board' : 'Task Management';
    if (view === 'list') {
      this._updateListTasks();
    }
  }

  selectStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    this._updateListTasks();
  }

  // TODO: Implement other methods for filters, new task, etc.
}
