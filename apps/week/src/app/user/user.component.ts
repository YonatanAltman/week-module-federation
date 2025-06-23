import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { User } from '@single-push/auth';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [AsyncPipe],
  template: `
    <div class="user-container">
      <h1>User</h1>
      fullname: {{ fullname$ | async }}
      <div>user: {{ user() }}</div>

      <div>fullname {{ fullname() }}</div>
    </div>
  `,
  styleUrl: './user.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  readonly user = signal<User | null>(null);
  readonly brand= signal<any | null>(null);
  readonly fullname = computed(()=>{
    const user = this.user();
    const brand = this.brand();
    return userFullname(user, brand);
  });
  fullname2  = '';

  // user: User | null = null;
  user$ = new BehaviorSubject<User | null>(null);
  fullname$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      }
      return of(user.firstName + ' ' + user.lastName);
    }),
    tap((user) => {
      console.log(user);
    }),
    map((user) => user)
  );

  constructor() {
    effect(
      () => {
        const user = this.user();
        this.fullname2 = user?.firstName + ' ' + user?.lastName;
      }
    );


    setTimeout(() => {
      this.user.set({
        firstName: 'John',
        lastName: 'Doe',
        username: 'john.doe',
        password: 'password',
      });
    }, 5000);
  }
}



const userFullname = (user:User | null, brand?:any) => {
  if(!user) return '';
  return user?.firstName + ' ' + user?.lastName + ' ' + brand?.name;
}