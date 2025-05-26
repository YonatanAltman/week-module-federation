import { Component } from '@angular/core';
import { HeaderComponent } from '@single-push/header';

@Component({
  imports: [ HeaderComponent],
  selector: 'app-friday-entry',
  template: `<lib-header/>`,
})
export class RemoteEntryComponent {}
