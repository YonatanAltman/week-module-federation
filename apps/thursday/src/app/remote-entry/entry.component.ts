import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '@single-push/header';
import { AuthService } from '@single-push/auth';

@Component({
  imports: [HeaderComponent],
  selector: 'app-thursday-entry',
  template: `<lib-header [name]="name" [username]="username()"/>`,
})
export class RemoteEntryComponent {
  readonly #authService = inject(AuthService);
  readonly username = computed(() => this.#authService.user()?.username ?? null)
  readonly name = 'Thursday';
}
