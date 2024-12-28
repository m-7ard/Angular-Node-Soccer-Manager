import {
    Directive,
    Input,
    ElementRef,
    ViewContainerRef,
    HostListener,
    ComponentRef,
    EmbeddedViewRef,
    Type,
    OnChanges,
    SimpleChanges,
    TemplateRef,
} from '@angular/core';
import positionFixedContainer from '../../utils/fixedContainers/positionFixedContainer';
import fitFixedContainer from '../../utils/fixedContainers/fitFixedContainer';

// Interface for the template context
export interface PopoverContext<T> {
    $implicit: T;
    close: () => void;
}

// Interface that components can implement to get close function
export interface PopoverComponent {
    close?: () => void;
}

@Directive({
    selector: '[popoverTrigger]',
    standalone: true,
})
export class PopoverTriggerDirective<T> implements OnChanges {
    @Input() targetProps!: T;
    @Input('targetComponent') targetComponent?: Type<T & PopoverComponent>;
    @Input('targetTemplate') targetTemplate?: TemplateRef<PopoverContext<T>>;

    private viewRef: ComponentRef<T & PopoverComponent> | EmbeddedViewRef<PopoverContext<T>> | null = null;

    constructor(
        private el: ElementRef,
        private viewContainer: ViewContainerRef,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.viewRef && changes['targetProps'] && this.viewRef instanceof ComponentRef) {
            Object.entries(changes['targetProps']).forEach(([key, value]) => {
                this.viewRef && (this.viewRef as ComponentRef<T & PopoverComponent>).setInput(key, value);
            });
        }
    }

    private getTargetElement(): HTMLElement | null {
        if (!this.viewRef) return null;
        
        if (this.viewRef instanceof ComponentRef) {
            return this.viewRef.location.nativeElement;
        } else {
            return this.viewRef.rootNodes[0];
        }
    }

    private placeTooltip = () => {
        const targetElement = this.getTargetElement();
        if (!targetElement) return;
        
        const referenceElement = this.el.nativeElement;
        positionFixedContainer(targetElement, referenceElement, { top: '100%', right: '0px', left: '0px' });
        fitFixedContainer(targetElement);
    }

    private closeOnOutsideClick = (event: MouseEvent) => {
        const targetElement = this.getTargetElement();
        if (!targetElement) return;

        const eventTarget = event.target as HTMLElement;
        const referenceElement: HTMLElement = this.el.nativeElement;

        if (targetElement.contains(eventTarget) || referenceElement.contains(eventTarget)) {
            return;
        }

        this.close();
    };

    close = () => {
        if (!this.viewRef) return;
        
        this.viewRef.destroy();
        this.viewRef = null;
        window.removeEventListener('resize', this.placeTooltip);
        window.removeEventListener('mouseup', this.closeOnOutsideClick);
    }

    @HostListener('click')
    onClick() {
        if (this.viewRef) {
            this.close();
            return;
        }

        if (!this.targetComponent && !this.targetTemplate) {
            console.warn('PopoverTriggerDirective: Neither target component nor template provided');
            return;
        }

        if (this.targetTemplate) {
            const context: PopoverContext<T> = {
                $implicit: this.targetProps,
                close: this.close
            };
            this.viewRef = this.viewContainer.createEmbeddedView(this.targetTemplate, context);
        } else if (this.targetComponent) {
            this.viewRef = this.viewContainer.createComponent(this.targetComponent);
            
            // Set component inputs
            Object.entries(this.targetProps || {}).forEach(([key, value]) => {
                (this.viewRef as ComponentRef<T & PopoverComponent>).setInput(key, value);
            });
            
            // Set close function
            const componentInstance = (this.viewRef as ComponentRef<T & PopoverComponent>).instance;
            componentInstance.close = this.close;
        }

        this.placeTooltip();
        window.addEventListener('resize', this.placeTooltip);
        window.addEventListener('mouseup', this.closeOnOutsideClick);
    }
}