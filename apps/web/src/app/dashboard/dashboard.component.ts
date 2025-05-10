import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@secure-tasks-mono/ui-angular';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
