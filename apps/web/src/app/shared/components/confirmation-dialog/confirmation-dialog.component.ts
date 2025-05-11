import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  // styleUrls: ['./confirmation-dialog.component.css'] // Add if you need specific non-Tailwind styles
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';
  @Input() confirmButtonClass =
    'bg-red-600 hover:bg-red-700 focus:ring-red-500'; // Default to destructive action

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  public isVisible = false;
  public readonly dialogTitleId = 'app-confirmation-dialog-title'; // Added for ARIA

  public show(): void {
    this.isVisible = true;
  }

  public hide(): void {
    this.isVisible = false;
  }

  public onConfirm(): void {
    this.confirmed.emit();
    this.hide();
  }

  public onCancel(): void {
    this.cancelled.emit();
    this.hide();
  }
}
