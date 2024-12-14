import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appMixinButton]',
    standalone: true,
})
export class MixinButtonDirective {
    @Input() size!: 'mixin-button-sm' | 'mixin-button-base';
    @Input() theme!: 'theme-button-generic-white' | 'theme-button-generic-yellow' | 'theme-button-generic-green' | 'theme-button-generic-red';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, 'mixin-button-like');
        // Apply size and theme classes
        this.renderer.addClass(this.el.nativeElement, this.size);
        this.renderer.addClass(this.el.nativeElement, this.theme);
    }
}
