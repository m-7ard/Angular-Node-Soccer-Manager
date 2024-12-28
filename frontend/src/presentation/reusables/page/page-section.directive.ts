import { Directive } from '@angular/core';

@Directive({
    selector: '[appPageSectionDirective]',
    standalone: true,
    host: { 'data-role': 'page-section' },
})
export class PageSectionDirective {}
