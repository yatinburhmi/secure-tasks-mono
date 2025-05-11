import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleSwitcherComponent } from '../../components/role-switcher/role-switcher.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RoleSwitcherComponent],
  templateUrl: './layout.component.html',
  styleUrls: [], // Using Tailwind, so no specific component styles needed here
})
export class LayoutComponent {
  // constructor() {} // Removed empty constructor
}
