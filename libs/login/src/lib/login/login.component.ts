import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '@single-push/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #fb = inject(FormBuilder);
  loginForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.loginForm = this.#fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const { username, password } = this.loginForm.value;
      
      // Mock login simulation
      console.log('Login attempt:', { username, password });
      
      // Simulate API call delay
      setTimeout(() => {
        this.isSubmitting = false;
        alert(`Welcome, ${username}! (This is a mock login)`);
        const user:User = {
          username,
          password
        }
        this.#authService.login(user);
        this.loginForm.reset();
        this.#router.navigate(['/']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

