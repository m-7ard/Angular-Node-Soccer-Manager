import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[tooltipPanel]',
    standalone: true,
})
export class TooltipPanelDirective implements OnInit, OnDestroy {
    private triggerElement?: HTMLElement;
    private isOpen = false;
    private position = 'bottom';
    private offset = 8;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this.setupEventListeners();
        this.hidePanel();
    }

    ngOnDestroy() {
        this.cleanupEventListeners();
    }

    private setupEventListeners() {
        document.addEventListener('tooltip-trigger-ready', this.handleTriggerReady.bind(this));
        document.addEventListener('toggle-tooltip', this.handleToggle.bind(this));
        window.addEventListener('scroll', this.updatePosition.bind(this), true);
        window.addEventListener('resize', this.updatePosition.bind(this), true);
    }

    private cleanupEventListeners() {
        document.removeEventListener('tooltip-trigger-ready', this.handleTriggerReady.bind(this));
        document.removeEventListener('toggle-tooltip', this.handleToggle.bind(this));
        window.removeEventListener('scroll', this.updatePosition.bind(this), true);
        window.removeEventListener('resize', this.updatePosition.bind(this), true);
    }

    private handleTriggerReady(event: any) {
        this.triggerElement = event.detail.triggerElement;
    }

    private handleToggle(event: any) {
        if (this.triggerElement === event.detail.triggerElement) {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.showPanel();
            } else {
                this.hidePanel();
            }
        }
    }

    private showPanel() {
        const el = this.elementRef.nativeElement;
        el.style.position = 'fixed';
        el.style.display = 'block';
        el.style.zIndex = '1000';
        this.updatePosition();
    }

    private hidePanel() {
        const el = this.elementRef.nativeElement;
        el.style.display = 'none';
    }

    private updatePosition() {
        if (!this.triggerElement || !this.isOpen) return;

        const el = this.elementRef.nativeElement;
        const triggerRect = this.triggerElement.getBoundingClientRect();
        const tooltipRect = el.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (this.position) {
            case 'bottom':
                top = triggerRect.bottom + this.offset;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            // Add other position cases as needed
        }

        // Viewport boundary checks
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        if (left < 0) {
            left = this.offset;
        } else if (left + tooltipRect.width > viewport.width) {
            left = viewport.width - tooltipRect.width - this.offset;
        }

        if (top < 0) {
            top = this.offset;
        } else if (top + tooltipRect.height > viewport.height) {
            top = viewport.height - tooltipRect.height - this.offset;
        }

        el.style.top = `${top}px`;
        el.style.left = `${left}px`;
    }
}
