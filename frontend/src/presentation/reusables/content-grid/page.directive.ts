import { Directive, ElementRef, Input, Renderer2, OnInit, HostBinding } from '@angular/core';

@Directive({
    selector: '[appContentGrid]',
    standalone: true,
})
export class ContentGridDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, "mixin-content-grid");
    }
}
