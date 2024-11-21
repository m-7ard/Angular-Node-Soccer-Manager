import { Injectable, ElementRef } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TriggerSelectorService {
    findTriggerElement(element: ElementRef<HTMLElement>, selector?: string): HTMLElement {
        if (!selector) {
            return element.nativeElement;
        }

        const foundElement = element.nativeElement.querySelector<HTMLElement>(selector);
        return foundElement || element.nativeElement;
    }
}
