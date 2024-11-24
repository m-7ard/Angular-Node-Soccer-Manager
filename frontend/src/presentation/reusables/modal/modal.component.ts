import { Component, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-modal',
    template: `
        <div
            class="fixed inset-0 bg-black/40 flex flex-row items-center justify-center"
            [style.zIndex]="zIndex"
            (click)="onBackdropClick($event)"
        >
            <div (click)="$event.stopPropagation()">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    standalone: true,
})
export class ModalComponent {
    @Input() zIndex = 1000;
    public closeFn!: () => void;

    @HostListener('document:keydown.escape')
    onEscapePress() {
        this.close();
    }

    close() {
        console.log("backdrop", this.closeFn)
        this.closeFn();
    }

    protected onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.close()
        }
    }
}
