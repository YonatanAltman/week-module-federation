import { Component, input, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  name = input('');
  username = input<string | null>(null);
  
  private location = inject(Location);
  
  goBack() {
    this.location.back();
  }
}
