import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinPrototypeCard]',
    standalone: true
})
export class MixinPrototypeCardDirective implements OnInit {
    @Input() size: 'mixin-Pcard-base' = 'mixin-Pcard-base';
    @Input() theme: 'theme-Pcard-generic-white' = 'theme-Pcard-generic-white';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, 'mixin-Pcard-like');
        // Apply size and theme classes
        this.renderer.addClass(this.el.nativeElement, this.size);
        this.renderer.addClass(this.el.nativeElement, this.theme);
    }
}