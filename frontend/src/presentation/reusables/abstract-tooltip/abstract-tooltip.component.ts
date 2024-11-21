import { Component, ContentChild, Input, AfterViewInit } from '@angular/core';
import { TooltipTriggerDirective } from '../abstract-tooltip-panel/tooltip-trigger.directive';
import { TriggerSelectorService } from '../abstract-tooltip-panel/trigger-selector.service';

@Component({
    selector: 'app-abstract-tooltip',
    standalone: true,
    template: `
        <ng-content></ng-content>
        <ng-content select="[tooltipPanel]"></ng-content>
    `,
})
export class AbstractTooltipComponent implements AfterViewInit {
    @Input() triggerSelector?: string;
    @ContentChild(TooltipTriggerDirective) triggerDirective!: TooltipTriggerDirective;
    @ContentChild('tooltipPanel') panelContent: any;

    private triggerElement!: HTMLElement;
    private clickHandler = () => this.togglePanel();
    
    constructor(private selectorService: TriggerSelectorService) {}

    ngAfterViewInit() {
        this.triggerElement = this.selectorService.findTriggerElement(
            this.triggerDirective.elementRef,
            this.triggerSelector,
        );

        this.triggerElement.addEventListener('click', this.clickHandler);
        
        // Notify panel components about the trigger element
        this.notifyPanelOfTrigger();
    }

    private togglePanel(): void {
        const event = new CustomEvent('toggle-tooltip', {
            detail: { triggerElement: this.triggerElement }
        });
        this.triggerElement.dispatchEvent(event);
    }

    private notifyPanelOfTrigger(): void {
        const event = new CustomEvent('tooltip-trigger-ready', {
            detail: { triggerElement: this.triggerElement }
        });
        this.triggerElement.dispatchEvent(event);
    }
}