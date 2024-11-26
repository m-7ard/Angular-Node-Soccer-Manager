import { Component, Input, Type, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerDataAccessService } from '../../../../services/data-access/player-data-access.service';
import { MixinButtonComponent } from '../../../../ui-mixins/mixin-button/mixin-button.component';
import { FormFieldComponent } from '../../../form-field/form-field.component';
import { CharFieldComponent } from '../../../char-field/char-field.component';
import IPresentationError from '../../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import Player from '../../../../models/Player';

@Component({
    selector: 'app-filter-players-result',
    standalone: true,
    imports: [
    FormFieldComponent,
    CharFieldComponent,
    CommonModule,
    ReactiveFormsModule,
    MixinButtonComponent
],
    templateUrl: './filter-players-result.component.html',
})
export class FilterPlayersResultComponent<T extends { player: Player }> {
    @Input() playerComponentType!: Type<T>;
    @Input() playerData!: Array<T>;
}
