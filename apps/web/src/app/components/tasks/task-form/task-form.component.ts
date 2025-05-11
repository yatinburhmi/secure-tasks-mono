import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  UserDto,
  TaskStatus,
} from '@secure-tasks-mono/data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  // styleUrls: ['./task-form.component.scss'] // Add if specific styles are needed beyond Tailwind
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() taskToEdit: TaskDto | null = null;
  @Input() isLoading = false;
  @Input() assignableUsers: UserDto[] | null = [];

  @Output() saveTask = new EventEmitter<
    Partial<CreateTaskDto | UpdateTaskDto>
  >();
  @Output() formCancelled = new EventEmitter<void>();

  taskForm!: FormGroup;
  taskStatusOptions = Object.values(TaskStatus);
  // Priority options removed

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskForm) {
      this.patchForm();
    }
    // Could also handle changes to assignableUsers if needed, e.g., to reset assigneeId if current value is no longer valid
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [TaskStatus.PENDING, Validators.required],
      dueDate: [null],
      category: ['', [Validators.maxLength(50)]],
      tags: [''],
      // priority: [null], // Removed priority form control
      assigneeId: [null],
    });
    this.patchForm(); // Call patchForm in case taskToEdit was already set
  }

  private patchForm(): void {
    if (this.taskToEdit) {
      const patchData: any = {
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        status: this.taskToEdit.status,
        dueDate: this.taskToEdit.dueDate
          ? this.taskToEdit.dueDate.split('T')[0]
          : null,
        category: this.taskToEdit.category,
        tags: this.taskToEdit.tags ? this.taskToEdit.tags.join(', ') : '',
        assigneeId: this.taskToEdit.assigneeId,
      };
      // if ('priority' in this.taskToEdit && this.taskToEdit.priority !== undefined) { // Removed priority patching logic
      //   patchData.priority = (this.taskToEdit as any).priority;
      // }
      this.taskForm.patchValue(patchData);
    } else {
      this.taskForm.reset({
        title: '',
        description: '',
        status: TaskStatus.PENDING, // Default for new task
        dueDate: null,
        category: '',
        tags: '',
        // priority: null, // Removed priority from reset
        assigneeId: null,
      });
    }
  }

  handleSubmit(): void {
    if (this.taskForm.invalid || this.isLoading) {
      // Mark all fields as touched to show validation errors if not already
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = { ...this.taskForm.value }; // Create a copy to modify

    // Ensure dueDate is in a format the backend expects, or null
    // If your backend expects a full ISO string for dueDate, adjust accordingly.
    // For now, assuming the form value for date is acceptable if not null.

    // If category is an empty string, set it to null so it's handled by @IsOptional() on the backend
    if (formValue.category === '') {
      formValue.category = null;
    }

    // Process tags: convert comma-separated string to array of strings, or null if empty
    if (typeof formValue.tags === 'string') {
      if (formValue.tags.trim() === '') {
        formValue.tags = null; // Send null if the input was effectively empty
      } else {
        const processedTags = formValue.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
        // If after processing, the array is empty (e.g., input was ", ,"), also set to null
        formValue.tags = processedTags.length > 0 ? processedTags : null;
      }
    } else {
      // If tags is not a string (e.g. already null/undefined from form init, though unlikely with text input)
      formValue.tags = null;
    }

    this.saveTask.emit(formValue);
  }

  handleCancel(): void {
    this.formCancelled.emit();
  }

  // Helper for template to check form control errors
  isInvalid(controlName: string): boolean {
    const control = this.taskForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
