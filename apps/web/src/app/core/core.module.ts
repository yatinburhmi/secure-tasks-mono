import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// LayoutComponent is now standalone, no longer declared or exported by CoreModule
// RoleSwitcherComponent is imported directly by LayoutComponent

@NgModule({
  declarations: [
    // LayoutComponent, // Removed
  ],
  imports: [
    CommonModule, // Retained for other potential core functionalities
    RouterModule, // Retained for other potential core functionalities
    // RoleSwitcherComponent, // Removed, LayoutComponent imports it directly
  ],
  exports: [
    // LayoutComponent, // Removed
  ],
})
export class CoreModule {}
