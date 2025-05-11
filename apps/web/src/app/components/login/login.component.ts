import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
// import * as AuthActions from '../../store/auth/auth.actions'; // We will use this later
import { AuthService } from '../../services/auth.service'; // Uncommented

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store, // To be used later for dispatching actions
    private router: Router, // To be used later for navigation
    private authService: AuthService // Injected AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  handleLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.isLoading = false;
        // Token storage and NgRx dispatch are handled by AuthService
        this.router.navigate(['/dashboard']); // Redirect to dashboard
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        this.errorMessage = err.message || 'Login failed. Please try again.'; // Use err.message from throwError
      },
    });
  }
}
