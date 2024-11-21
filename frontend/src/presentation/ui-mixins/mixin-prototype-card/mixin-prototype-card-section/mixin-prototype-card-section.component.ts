import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mixin-prototype-card-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mixin-prototype-card-section.component.html',
})
export class MixinPrototypeCardSectionComponent {
    @Input() className?: string;
}
