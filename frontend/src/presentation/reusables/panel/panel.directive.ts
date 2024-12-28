import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appPanelDirective]',
})
export class PanelDirective implements OnInit {
    @Input() panelSize!: 'mixin-panel-base';
    @Input() panelTheme!: 'theme-panel-generic-white'; 
    @Input() panelHasBorder?: boolean = false;
    @Input() panelHasShadow?: boolean = false;


    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, "mixin-panel-like");
        this.renderer.addClass(this.el.nativeElement, this.panelSize);
        this.renderer.addClass(this.el.nativeElement, this.panelTheme);

        if (this.panelHasShadow) {
            this.renderer.addClass(this.el.nativeElement, "token-default-shadow");
        }

        if (this.panelHasBorder) {
            this.renderer.addClass(this.el.nativeElement, 'border');
            this.renderer.addClass(this.el.nativeElement, 'token-default-border-color');
        }
    }
}
