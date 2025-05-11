import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UsersHttpService } from '../../core/services/users-http.service';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersHttpService = inject(UsersHttpService);

  loadOrgUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadOrgUsers),
      switchMap((action) =>
        this.usersHttpService
          .getUsersByOrganization(action.organizationId)
          .pipe(
            map((users) => UsersActions.loadOrgUsersSuccess({ users })),
            catchError((error) =>
              of(UsersActions.loadOrgUsersFailure({ error }))
            )
          )
      )
    )
  );
}
