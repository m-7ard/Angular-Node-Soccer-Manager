import { Directive, ElementRef, Input, Renderer2, OnInit, HostBinding } from '@angular/core';

@Directive({
    selector: '[appPageDirective]',
})
export class PageDirective implements OnInit {
    @Input() appPageDirective!: {
        pageSize: 'mixin-page-base'
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        const { pageSize } = this.appPageDirective;

        this.renderer.addClass(this.el.nativeElement, "mixin-page-like");
        this.renderer.addClass(this.el.nativeElement, pageSize);
    }
}
