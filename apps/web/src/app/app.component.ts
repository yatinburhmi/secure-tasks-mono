import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './core/layout/layout.component';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'web';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }
}
