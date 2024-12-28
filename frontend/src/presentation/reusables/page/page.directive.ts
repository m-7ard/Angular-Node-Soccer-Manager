import { Directive, ElementRef, Input, Renderer2, OnInit, HostBinding } from '@angular/core';

@Directive({
    selector: '[appPageDirective]',
    standalone: true,
})
export class PageDirective implements OnInit {
    @Input() pageSize!: 'mixin-page-base';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, "mixin-page-like");
        this.renderer.addClass(this.el.nativeElement, this.pageSize);
    }
}
