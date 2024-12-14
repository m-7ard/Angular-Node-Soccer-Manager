import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appMixinStyledButton]',
    standalone: true,
})
export class MixinStyledButtonDirective {
    @Input() size!: 'mixin-Sbutton-sm' | 'mixin-Sbutton-base';
    @Input() theme!: 'theme-Sbutton-generic-white' | 'theme-Sbutton-generic-yellow' | 'theme-Sbutton-generic-green' | 'theme-Sbutton-generic-red' | 'theme-Sbutton-generic-blue';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, 'mixin-Sbutton-like');
        // Apply size and theme classes
        this.renderer.addClass(this.el.nativeElement, this.size);
        this.renderer.addClass(this.el.nativeElement, this.theme);
    }
}
