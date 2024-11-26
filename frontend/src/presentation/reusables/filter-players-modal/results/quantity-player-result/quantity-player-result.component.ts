import { Component, Input } from '@angular/core';
import { MixinButtonComponent } from '../../../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../../../modal/modal-trigger.directive';
import { FilterPlayersModalComponent } from '../../filter-players-modal.component';
import Player from '../../../../models/Player';

@Component({
  selector: 'app-quantity-player-result',
  standalone: true,
  imports: [MixinButtonComponent, ModalTriggerDirective],
  templateUrl: './quantity-player-result.component.html',
})
export class QuantityPlayerResultComponent {
    @Input() player!: Player;
    @Input() quantity!: number;
    @Input() onUpdate!: (quantity: number) => void;
}
