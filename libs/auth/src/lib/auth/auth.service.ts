import { computed, Injectable, signal } from '@angular/core';
import { User } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #user = signal<User | null>(null);
  readonly user = this.#user.asReadonly();
  readonly isAuthenticated = computed(() => this.#user() !== null);

  login(user: User) {
    this.#user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  constructor() {
    console.log('AuthService constructor');
    this.checkCacheAuth();
  }

  logout() {
    this.#user.set(null);
    localStorage.removeItem('user');
  }

  checkAuth(): boolean {
    const user = this.user();
    const cacheUser = localStorage.getItem('user');
    if (user && cacheUser) {
      return true;
    }
    return false;
  }

  private checkCacheAuth() {
    const cacheUser = localStorage.getItem('user');
    if (cacheUser) {
      this.#user.set(JSON.parse(cacheUser));
    }
  }
}
