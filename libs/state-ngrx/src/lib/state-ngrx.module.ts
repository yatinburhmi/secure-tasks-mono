import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromAuth from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { authFeatureKey } from './auth/auth.actions';

import * as fromTasks from './tasks/tasks.reducer';
import { TasksEffects } from './tasks/tasks.effects';
import { tasksFeatureKey } from './tasks/tasks.actions';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}), // Root reducers remain empty for now
    EffectsModule.forRoot([]), // Root effects remain empty for now

    // Feature Modules
    StoreModule.forFeature(authFeatureKey, fromAuth.authReducer),
    StoreModule.forFeature(tasksFeatureKey, fromTasks.tasksReducer),

    EffectsModule.forFeature([AuthEffects, TasksEffects]),
  ],
  declarations: [],
  // No providers needed here unless AuthEffects has its own dependencies not provided elsewhere
})
export class StateNgrxModule {}
