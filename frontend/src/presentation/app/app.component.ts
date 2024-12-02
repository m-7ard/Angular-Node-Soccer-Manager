import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MixinButtonComponent } from "../ui-mixins/mixin-button/mixin-button.component";
import { ModalTriggerDirective } from '../reusables/modal/modal-trigger.directive';
import { DrawerModalComponent } from '../reusables/modal/example.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, MixinButtonComponent, ModalTriggerDirective],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'frontend';
    exampleModal = DrawerModalComponent;
    otherTitle = "0";

    constructor() {
        // setInterval(() => {
        //     this.otherTitle = (parseInt(this.otherTitle) + 1).toString();
        //     console.log("new title: ", this.otherTitle)
        // }, 1000);
    }
}
