import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@single-push/auth';
import { UserComponent } from "./user/user.component";

@Component({
  imports: [RouterModule, UserComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly username = computed(
    () => this.#authService.user()?.username ?? null
  );
  title = 'week';

  constructor() {
    this.checkAuth();
  }

  private checkAuth() {
    const isAuthenticated = this.#authService.checkAuth();
    if (!isAuthenticated) {
      this.#router.navigate(['/login']);
    }
  }

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/login']);
  }
}
