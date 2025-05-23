import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TaskDto,
  TaskStatus,
  CreateTaskDto,
  UpdateTaskDto,
  UserDto,
  OrganizationDto,
} from '@secure-tasks-mono/data';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TaskFormComponent } from '../../components/tasks/task-form/task-form.component';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { RootState } from '../../../../store';
import * as TasksActions from '../../../../store/tasks/tasks.actions';
import * as UsersActions from '../../../../store/users/users.actions';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectTasksCreating,
  selectTasksUpdating,
} from '../../../../store/tasks/tasks.selectors';
import {
  selectOrganizationUsersList,
  selectIsLoadingOrganizationUsers,
} from '../../../../store/users/users.selectors';
import {
  selectOrganization,
  selectCurrentUser,
} from '../../../../store/auth/auth.selectors';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskCardComponent,
    ModalComponent,
    TaskFormComponent,
    ConfirmationDialogComponent,
    DragDropModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  pageTitle = 'Task Management';
  currentView: 'list' | 'board' = 'board';

  public TaskStatusEnum = TaskStatus;

  statusFilters: string[] = ['All', ...Object.values(TaskStatus)];
  selectedStatusFilter = 'All';

  allTasks: TaskDto[] = [];
  pendingTasks: TaskDto[] = [];
  inProgressTasks: TaskDto[] = [];
  doneTasks: TaskDto[] = [];
  listTasks: TaskDto[] = [];

  allTasks$!: Observable<TaskDto[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  isTaskModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  taskToEdit: TaskDto | null = null;
  taskToDelete: TaskDto | null = null;
  assignableUsers$!: Observable<UserDto[]>;
  isLoadingAssignableUsers$!: Observable<boolean>;
  isTaskFormLoading$!: Observable<boolean>;

  private currentOrganizationId: string | null = null;
  private currentUserId: string | null = null;
  private subscriptions = new Subscription();

  public canCreateTasks = false;
  public searchControl = new FormControl('');

  @ViewChild(ConfirmationDialogComponent)
  private deleteConfirmDialog!: ConfirmationDialogComponent;

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.pageTitle =
      this.currentView === 'board' ? 'Task Board' : 'Task Management';
    this.store.dispatch(TasksActions.loadTasks({ queryParams: {} }));

    this.allTasks$ = this.store.select(selectAllTasks);
    this.isLoading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);

    this.assignableUsers$ = this.store.select(selectOrganizationUsersList);
    this.isLoadingAssignableUsers$ = this.store.select(
      selectIsLoadingOrganizationUsers
    );

    this.isTaskFormLoading$ = combineLatest([
      this.store.pipe(select(selectTasksCreating)),
      this.store.pipe(select(selectTasksUpdating)),
    ]).pipe(map(([creating, updating]) => creating || updating));

    const tasksSubscription = this.allTasks$.subscribe((tasks) => {
      this.allTasks = tasks;
      this._filterTasksByStatus();
      this._updateListTasks();
    });
    this.subscriptions.add(tasksSubscription);

    const orgSubscription = this.store
      .pipe(
        select(selectOrganization),
        filter((org): org is OrganizationDto => !!org)
      )
      .subscribe((organization: OrganizationDto) => {
        this.currentOrganizationId = organization.id;
      });
    this.subscriptions.add(orgSubscription);

    const userSubscription = this.store
      .pipe(
        select(selectCurrentUser),
        filter((user): user is UserDto => !!user)
      )
      .subscribe((user: UserDto) => {
        this.currentUserId = user.id;
        if (typeof user.roleId === 'number') {
          this.canCreateTasks = user.roleId === 1 || user.roleId === 2;
        } else {
          this.canCreateTasks = false;
        }
      });
    this.subscriptions.add(userSubscription);

    const searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => console.log('[DashboardSearch] Term:', term))
      )
      .subscribe((term) => {
        const searchTerm = term?.trim();
        this.store.dispatch(
          TasksActions.loadTasks({
            queryParams: { searchTerm: searchTerm ? searchTerm : undefined },
          })
        );
      });
    this.subscriptions.add(searchSubscription);

    this.statusFilters = ['All', ...Object.values(TaskStatus)];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    } else {
      this._filterTasksByStatus();
    }
  }

  selectStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    this._updateListTasks();
  }

  openCreateTaskModal(): void {
    if (!this.currentOrganizationId) {
      console.error(
        'Organization ID not available to create task or fetch users.'
      );
      return;
    }
    this.store.dispatch(
      UsersActions.loadOrgUsers({ organizationId: this.currentOrganizationId })
    );
    this.modalMode = 'create';
    this.taskToEdit = null;
    this.isTaskModalOpen = true;
  }

  openEditTaskModal(task: TaskDto): void {
    if (!this.currentOrganizationId) {
      console.error(
        'Organization ID not available to fetch users for editing task.'
      );
      return;
    }
    this.store.dispatch(
      UsersActions.loadOrgUsers({ organizationId: this.currentOrganizationId })
    );
    this.modalMode = 'edit';
    this.taskToEdit = { ...task };
    this.isTaskModalOpen = true;
  }

  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.taskToEdit = null;
  }

  handleTaskFormSave(formData: Partial<CreateTaskDto | UpdateTaskDto>): void {
    if (!this.currentOrganizationId) {
      console.error('Cannot save task: Organization ID is missing.');
      return;
    }
    if (!this.currentUserId && this.modalMode === 'create') {
      console.error('Cannot create task: Creator ID is missing.');
      return;
    }

    if (this.modalMode === 'create') {
      const createTaskPayload: CreateTaskDto = {
        title: '',
        description: '',
        status: TaskStatus.PENDING,
        ...(formData as Partial<CreateTaskDto>),
        organizationId: this.currentOrganizationId,
        creatorId: this.currentUserId!,
      };
      if (!createTaskPayload.title) {
        console.error('Title is required to create a task.');
        return;
      }
      this.store.dispatch(
        TasksActions.createTask({ taskData: createTaskPayload })
      );
    } else if (this.modalMode === 'edit' && this.taskToEdit) {
      this.store.dispatch(
        TasksActions.updateTask({
          id: this.taskToEdit.id,
          changes: formData as UpdateTaskDto,
        })
      );
    }
    this.closeTaskModal();
  }

  handleTaskFormCancelled(): void {
    this.closeTaskModal();
  }

  public requestTaskDelete(task: TaskDto): void {
    if (!task || !task.id) {
      console.error('Task or Task ID is missing, cannot request deletion.');
      return;
    }
    this.taskToDelete = task;
    if (this.deleteConfirmDialog) {
      this.deleteConfirmDialog.title = 'Confirm Deletion';
      this.deleteConfirmDialog.message = `Are you sure you want to delete the task "${task.title}"?\nThis action cannot be undone.`;
      this.deleteConfirmDialog.confirmButtonText = 'Delete';
      this.deleteConfirmDialog.confirmButtonClass =
        'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      this.deleteConfirmDialog.show();
    } else {
      console.error('Delete confirmation dialog not available.');
      if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        this.confirmTaskDelete();
      }
    }
  }

  public confirmTaskDelete(): void {
    if (this.taskToDelete && this.taskToDelete.id) {
      this.store.dispatch(
        TasksActions.deleteTask({ id: this.taskToDelete.id })
      );
    } else {
      console.error('No task selected for deletion or task ID is missing.');
    }
    this.taskToDelete = null;
  }

  public cancelTaskDelete(): void {
    this.taskToDelete = null;
  }

  public clearSearch(): void {
    this.searchControl.setValue('');
  }

  public drop(event: CdkDragDrop<TaskDto[]>): void {
    if (this.currentView !== 'board') {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const taskToUpdate = event.container.data[event.currentIndex];
      const newStatus = event.container.id as TaskStatus;

      if (taskToUpdate && newStatus && taskToUpdate.status !== newStatus) {
        this.store.dispatch(
          TasksActions.updateTask({
            id: taskToUpdate.id,
            changes: { status: newStatus },
          })
        );
      }
    }
  }

  public taskTrackByFn(index: number, item: TaskDto): string {
    return item.id;
  }
}
