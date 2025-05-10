import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { StateNgrxModule } from '@secure-tasks-mono/state-ngrx'; // RESTORED

// REMOVED direct StoreModule, EffectsModule, and effects imports

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    DashboardComponent,
    LoginComponent,
    StateNgrxModule, // RESTORED
    // REMOVED StoreModule.forRoot and EffectsModule.forRoot from here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
