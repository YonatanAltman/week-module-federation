import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  name = input('');
  username = input<string | null>(null);
}
