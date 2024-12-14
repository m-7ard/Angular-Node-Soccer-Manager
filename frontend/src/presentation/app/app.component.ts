import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalTriggerDirective } from '../reusables/modal/modal-trigger.directive';
import { DrawerModalComponent } from '../reusables/modal/example.component';
import { MixinStyledButtonDirective } from '../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, ModalTriggerDirective, MixinStyledButtonDirective],
    templateUrl: './app.component.html',
    host: {
        class: 'flex flex-col h-full',
    },
})
export class AppComponent {
    title = 'frontend';
    exampleModal = DrawerModalComponent;
    otherTitle = '0';

    constructor() {
        // setInterval(() => {
        //     this.otherTitle = (parseInt(this.otherTitle) + 1).toString();
        //     console.log("new title: ", this.otherTitle)
        // }, 1000);
    }
}
