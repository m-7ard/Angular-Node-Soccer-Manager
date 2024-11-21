import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tooltipTrigger]',
  standalone: true
})
export class TooltipTriggerDirective {
  constructor(public elementRef: ElementRef) {}
}