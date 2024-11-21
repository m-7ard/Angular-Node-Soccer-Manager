import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cover-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cover-image.component.html',
})
export class CoverImageComponent {
    @Input() src?: string;
    @Input() className: string = '';
}
