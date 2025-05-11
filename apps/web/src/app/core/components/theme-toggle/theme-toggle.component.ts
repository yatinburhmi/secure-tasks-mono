import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: [], // No specific styles, using Tailwind
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  currentTheme: Theme;

  constructor() {
    // Signals are reactive, so we can read the current value directly for the initial state,
    // or use computed() if we need to derive state reactively in the template.
    // For simplicity here, we'll just grab it. The template will use themeService.currentTheme() directly.
    this.currentTheme = this.themeService.currentTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.currentTheme(); // Update local copy if needed, or template uses signal directly
  }

  // Helper for template to access signal directly
  get themeSignal() {
    return this.themeService.currentTheme;
  }
}
