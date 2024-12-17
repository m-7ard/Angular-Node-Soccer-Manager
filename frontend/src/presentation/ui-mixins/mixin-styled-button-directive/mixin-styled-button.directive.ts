import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appMixinStyledButton]',
    standalone: true,
})
export class MixinStyledButtonDirective implements OnChanges {
    @Input() size!: 'mixin-Sbutton-sm' | 'mixin-Sbutton-base';
    @Input() theme!: 'theme-Sbutton-generic-white' | 'theme-Sbutton-generic-yellow' | 'theme-Sbutton-generic-green' | 'theme-Sbutton-generic-red' | 'theme-Sbutton-generic-blue';

    private baseClass = 'mixin-Sbutton-like';
    private previousSize?: string;
    private previousTheme?: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, this.baseClass);

        // Apply initial size and theme classes
        if (this.size) {
            this.renderer.addClass(this.el.nativeElement, this.size);
            this.previousSize = this.size;
        }
        if (this.theme) {
            this.renderer.addClass(this.el.nativeElement, this.theme);
            this.previousTheme = this.theme;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Handle size changes
        if (changes['size'] && changes['size'].currentValue !== changes['size'].previousValue) {
            if (this.previousSize) {
                this.renderer.removeClass(this.el.nativeElement, this.previousSize);
            }
            this.renderer.addClass(this.el.nativeElement, changes['size'].currentValue);
            this.previousSize = changes['size'].currentValue;
        }

        // Handle theme changes
        if (changes['theme'] && changes['theme'].currentValue !== changes['theme'].previousValue) {
            if (this.previousTheme) {
                this.renderer.removeClass(this.el.nativeElement, this.previousTheme);
            }
            this.renderer.addClass(this.el.nativeElement, changes['theme'].currentValue);
            this.previousTheme = changes['theme'].currentValue;
        }
    }
}
