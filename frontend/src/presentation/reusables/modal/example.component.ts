import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal.component';
import { AbstractModalDirective } from './abstract-modal.directive';

@Component({
    selector: 'app-drawer-modal',
    imports: [ModalComponent],
    template: `
        <app-modal>
            <div class="h-72 w-72 bg-white">
                <header>
                    <h2>{{ title }}</h2>
                </header>
                <main>
                    Drawer content here!
                </main>
                <footer>
                    <button (click)="this.close()">Close</button>
                </footer>
            </div>
        </app-modal>
    `,
    standalone: true
})
export class DrawerModalComponent extends AbstractModalDirective {
    @Input() title!: string;
}
