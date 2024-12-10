import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinPrototypeCardSection]',
    standalone: true
})
export class MixinPrototypeCardSectionDirective implements OnInit {
    @Input() className: string | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base section class or additional classes
        if (this.className) {
            this.className.split(' ').forEach((cls) => this.renderer.addClass(this.el.nativeElement, cls));
        }

        // Add a data attribute
        this.renderer.setAttribute(this.el.nativeElement, 'data-role', 'section');
    }
}
