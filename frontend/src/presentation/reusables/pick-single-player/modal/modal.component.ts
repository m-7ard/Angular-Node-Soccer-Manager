import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-pick-single-player-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './modal.component.html',
})
export class PickSinglePlayerModalComponent {

}