import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `<hr class="h-0 w-full border-bottom border-gray-300 shadow-lg" />`
})
export class DividerComponent {

}
