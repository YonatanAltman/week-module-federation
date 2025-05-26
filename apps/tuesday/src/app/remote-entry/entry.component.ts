import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@single-push/auth';
import { HeaderComponent } from '@single-push/header';

@Component({
  imports: [HeaderComponent],
  selector: 'app-tuesday-entry',
  template: `<lib-header [name]="name" [username]="username()"/>`,
})
export class RemoteEntryComponent {
  readonly #authService = inject(AuthService);
  readonly username = computed(() => this.#authService.user()?.username ?? null)
  readonly name = 'Tuesday';
}
