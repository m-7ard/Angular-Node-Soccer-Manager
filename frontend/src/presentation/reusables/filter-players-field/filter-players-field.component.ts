import { Component } from '@angular/core';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../modal/modal-trigger.directive';
import { FilterPlayersModalComponent } from '../filter-players-modal/filter-players-modal.component';

@Component({
  selector: 'app-filter-players-field',
  standalone: true,
  imports: [MixinButtonComponent, ModalTriggerDirective],
  templateUrl: './filter-players-field.component.html',
})
export class FilterPlayersFieldComponent {
    panel = FilterPlayersModalComponent;
}
