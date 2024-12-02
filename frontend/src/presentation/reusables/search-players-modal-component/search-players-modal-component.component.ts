import { Component, Inject } from '@angular/core';
import Player from '../../models/Player';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CharFieldComponent } from '../char-field/char-field.component';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import { CoverImageComponent } from "../cover-image/cover-image.component";

interface IFormControls {
    name: FormControl<string>;
}

export interface SearchPlayersModalComponentProps {
    selectPlayer: Player | null;
    onSelect: (player: Player) => void;
}

const routes = {
    form: 'form',
    results: 'results',
};

@Component({
    selector: 'app-search-players-modal-component',
    standalone: true,
    imports: [MixinButtonComponent, CommonModule, FormFieldComponent, CharFieldComponent, ReactiveFormsModule, CoverImageComponent],
    templateUrl: './search-players-modal-component.component.html',
})
export class SearchPlayersModalComponentComponent {
    currentRoute: keyof typeof routes = 'form';
    changeRoute(newRoute: keyof typeof routes) {
        this.currentRoute = newRoute;
    }

    form: FormGroup<IFormControls>;
    results: Player[] = [];

    constructor(
        public dialogRef: DialogRef<Player>,
        @Inject(DIALOG_DATA) public data: SearchPlayersModalComponentProps,
        private playerDataAccess: PlayerDataAccessService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [],
            }),
        });
    }

    isPlayerAlreadySelected(player: Player): boolean {
        return this.data.selectPlayer?.id === player.id;
    }

    selectPlayer(player: Player): void {
        this.data.onSelect(player);
        this.dialogRef.close();
    }

    async onFormSubmit() {
        const rawValue = this.form.getRawValue();
        const responseObservable = this.playerDataAccess.listPlayers({
            name: rawValue.name,
        });

        responseObservable.subscribe((dto) => {
            this.results = dto.players.map((player) => {
                return new Player({ id: player.id, name: player.name, number: player.number });
            });
            this.changeRoute("results");
        });
    }
}
