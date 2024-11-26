import { Component, Input, Type, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { AbstractModalDirective } from '../modal/abstract-modal.directive';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ModalTriggerDirective } from '../modal/modal-trigger.directive';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
    FilterPlayersFormComponent,
    IFilterPlayersFormRawValue,
} from './pages/filter-players-form/filter-players-form.component';
import { FilterPlayersResultComponent } from './pages/filter-players-result/filter-players-result.component';
import { QuantityPlayerResultComponent } from './results/quantity-player-result/quantity-player-result.component';
import Player from '../../models/Player';
import RawFormValues from '../../utils/types';

interface IFormControls {
    name: FormControl<string>;
}

const ROUTES = {
    FORM: 'FORM',
    RESULT: 'RESULT',
} as const;

@Component({
    selector: 'app-filter-players-modal',
    standalone: true,
    imports: [
        ModalComponent,
        MixinButtonComponent,
        CommonModule,
        FilterPlayersFormComponent,
        FilterPlayersResultComponent,
    ],
    templateUrl: './filter-players-modal.component.html',
})
export class FilterPlayersModalComponent<T extends { player: Player } & Record<string, any>> extends AbstractModalDirective {
    ROUTES = ROUTES;

    @Input() playerData!: Array<T>;
    @Input() resultComponent!: Type<T>;

    constructor(private playerDataAccess: PlayerDataAccessService) {
        super();
    }

    async onFormSubmit(formData: IFilterPlayersFormRawValue) {
        const response = this.playerDataAccess.listPlayers({
            name: formData.name,
        });

        response.subscribe({
            next: (response) => {
                if (response === null) {
                    return;
                }
                this.playerData = response.players.map((player) => ({
                    player: new Player({
                        id: player.id,
                        name: player.name,
                        number: player.number,
                    }),
                    quantity: 0,
                    onUpdate: (quantity: number) => {
                        const newPlayers = [...this.playerData];
                        const existingPlayer = newPlayers.find((item) => item.player.id === player.id);
                        existingPlayer!.quantity = quantity; 
                        this.playerData = newPlayers;
                    }
                }));
                this.changeRoute(this.ROUTES.RESULT);
            },
        });
    }

    protected activeRoute: keyof typeof ROUTES = ROUTES.FORM;

    changeRoute = (route: keyof typeof ROUTES) => {
        this.activeRoute = route;
    };
}
