import {
    Directive,
    Input,
    OnInit,
    ElementRef,
    ViewContainerRef,
    HostListener,
    ComponentRef,
    Type,
} from '@angular/core';
import positionFixedContainer from '../../utils/fixedContainers/positionFixedContainer';
import fitFixedContainer from '../../utils/fixedContainers/fitFixedContainer';

@Directive({
    selector: '[popoverTrigger]',
    standalone: true,
})
export class PopoverTriggerDirective {
    @Input()
    public popoverTrigger!: Type<any>;

    private targetRef: ComponentRef<any> | null = null;

    constructor(
        private el: ElementRef,
        private viewContainer: ViewContainerRef,
    ) {}

    private placeTooltip = () => {
        if (this.targetRef == null) return;
        const targetElement = this.targetRef.location.nativeElement;
        const referenceElement = this.el.nativeElement;
        positionFixedContainer(targetElement, referenceElement, { top: '100%', right: '0px', left: '0px' });
        fitFixedContainer(targetElement);
    }

    private closeOnOutsideClick = (event: MouseEvent) => {
        if (this.targetRef == null) {
            return;
        }

        const eventTarget = event.target as HTMLElement;
        const targetElement: HTMLElement = this.targetRef?.location.nativeElement;
        const referenceElement: HTMLElement = this.el.nativeElement;

        if (targetElement.contains(eventTarget) || referenceElement.contains(eventTarget)) {
            return;
        }

        this.targetRef.destroy();
        this.targetRef = null;
        window.removeEventListener('resize', this.placeTooltip);
        window.removeEventListener('mouseup', this.closeOnOutsideClick);
    };

    @HostListener('click')
    onClick() {
        if (this.targetRef) {
            this.targetRef.destroy();
            this.targetRef = null;
            return;
        }

        this.targetRef = this.viewContainer.createComponent(this.popoverTrigger);

        this.placeTooltip();
        window.addEventListener('resize', this.placeTooltip);
        window.addEventListener('mouseup', this.closeOnOutsideClick);
    }
}
