import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinStyledCard]',
    standalone: true,
})
export class MixinStyledCardDirective implements OnInit {
    @Input() size: 'mixin-Scard-base' = 'mixin-Scard-base';
    @Input() theme: 'theme-Scard-generic-white' = 'theme-Scard-generic-white';
    @Input() hasShadow?: boolean = false;
    @Input() hasDivide?: boolean = false;
    @Input() hasBorder?: boolean = false;

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

        if (this.hasShadow) {
            this.renderer.addClass(this.el.nativeElement, 'token-default-shadow');
        }

        if (this.hasDivide) {
            this.renderer.addClass(this.el.nativeElement, 'divide-y');
            this.renderer.addClass(this.el.nativeElement, 'token-default-divide-color');
        }

        if (this.hasBorder) {
            this.renderer.addClass(this.el.nativeElement, 'border');
            this.renderer.addClass(this.el.nativeElement, 'token-default-border-color');
        }
    }
}
