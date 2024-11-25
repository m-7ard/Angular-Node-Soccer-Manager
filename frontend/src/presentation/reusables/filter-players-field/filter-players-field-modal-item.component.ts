import { Component, Input } from '@angular/core';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../modal/modal-trigger.directive';
import { FilterPlayersModalComponent } from '../filter-players-modal/filter-players-modal.component';
import Player from '../../models/Player';

@Component({
  selector: 'app-filter-players-field-modal-item',
  standalone: true,
  imports: [MixinButtonComponent, ModalTriggerDirective],
  templateUrl: './filter-players-field-modal-item.component.html',
})
export class FilterPlayersFieldModalItemComponent {
    @Input() player!: Player;
}
