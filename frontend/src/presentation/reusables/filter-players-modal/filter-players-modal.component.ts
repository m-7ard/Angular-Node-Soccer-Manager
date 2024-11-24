import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { AbstractModalDirective } from '../modal/abstract-modal.directive';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../modal/modal-trigger.directive';

@Component({
    selector: 'app-filter-players-modal',
    standalone: true,
    imports: [ModalComponent, MixinButtonComponent],
    templateUrl: './filter-players-modal.component.html',
})
export class FilterPlayersModalComponent extends AbstractModalDirective {}
