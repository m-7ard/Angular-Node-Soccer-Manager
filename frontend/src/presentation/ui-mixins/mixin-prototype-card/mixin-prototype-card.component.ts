import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-mixin-prototype-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mixin-prototype-card.component.html',
})
export class MixinPrototypeCardComponent {
    @Input() options: { size: 'mixin-Pcard-base'; theme: 'theme-Pcard-generic-white' } = {
        size: 'mixin-Pcard-base',
        theme: 'theme-Pcard-generic-white',
    };
    @Input() className: string = '';
}
