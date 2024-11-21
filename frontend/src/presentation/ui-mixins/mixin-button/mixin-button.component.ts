import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, input, Input, OnInit, ViewChild } from '@angular/core';

type ButtonHTMLAttributes = Partial<Pick<HTMLButtonElement, 'type' | 'disabled' | 'ariaLabel' | 'title'>> & {
    [attribute: string]: string;
};

@Component({
    selector: 'app-mixin-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mixin-button.component.html',
})
export class MixinButtonComponent implements OnInit {
    @Input() options!: {
        size: 'mixin-button-sm' | 'mixin-button-base';
        theme:
            | 'theme-button-generic-white'
            | 'theme-button-generic-yellow'
            | 'theme-button-generic-green'
            | 'theme-button-generic-red';
    };
    @Input() className: string = '';
    @Input() isActive: boolean = false;
    @Input() buttonAttrs?: ButtonHTMLAttributes;
    
    ngOnInit(): void {
    }

    @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;
}
