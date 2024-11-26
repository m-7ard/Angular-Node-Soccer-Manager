import { Component, Input } from '@angular/core';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../modal/modal-trigger.directive';
import { FilterPlayersModalComponent } from '../filter-players-modal/filter-players-modal.component';
import Player from '../../models/Player';
import { QuantityPlayerResultComponent } from '../filter-players-modal/results/quantity-player-result/quantity-player-result.component';

@Component({
  selector: 'app-filter-players-field',
  standalone: true,
  imports: [MixinButtonComponent, ModalTriggerDirective],
  templateUrl: './filter-players-field.component.html',
})
export class FilterPlayersFieldComponent {
    /* TODO: implement form controller */
    onUpdate(id: string) {
        console.log(id);
    }

    resultComponent = QuantityPlayerResultComponent;

    @Input() value!: Player[];
    panel = FilterPlayersModalComponent;
}
