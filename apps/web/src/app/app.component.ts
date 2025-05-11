import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleSwitcherComponent } from './components/role-switcher/role-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RoleSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Task Management';
}
