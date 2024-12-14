import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinStyledCard]',
    standalone: true
})
export class MixinStyledCardDirective implements OnInit {
    @Input() size: 'mixin-Scard-base' = 'mixin-Scard-base';
    @Input() theme: 'theme-Scard-generic-white' = 'theme-Scard-generic-white';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, 'mixin-Scard-like');
        // Apply size and theme classes
        this.renderer.addClass(this.el.nativeElement, this.size);
        this.renderer.addClass(this.el.nativeElement, this.theme);
    }
}
