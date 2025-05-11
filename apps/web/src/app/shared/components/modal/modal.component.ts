import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  // styleUrls: ['./modal.component.scss'] // If needed
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() modalTitle?: string;
  @Input() closeOnOutsideClick = true;
  @Input() closeOnEscapeKey = true;

  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  // Optional: Close on Escape key press
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscapeKey) {
      this.onClose();
    }
  }

  // Optional: Handle clicks for closing when clicking outside the modal content
  // This requires careful handling in the template to distinguish content clicks from backdrop clicks.
  // For simplicity in this first pass, we'll rely on a close button.
  // A more robust implementation would check if event.target is the backdrop itself.
  onBackdropClick(): void {
    if (this.isOpen && this.closeOnOutsideClick) {
      this.onClose();
    }
  }
}
