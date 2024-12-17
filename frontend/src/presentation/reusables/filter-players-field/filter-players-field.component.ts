import { Component, Input } from '@angular/core';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import Player from '../../models/Player';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import PlayerMapper from '../../mappers/PlayerMapper';

const ROUTES = {
    FORM: 'FORM',
    RESULT: 'RESULT',
} as const;

@Component({
    selector: 'app-filter-players-field',
    standalone: true,
    imports: [MixinButtonComponent, CommonModule, ReactiveFormsModule, CoverImageComponent],
    templateUrl: './filter-players-field.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: FilterPlayersFieldComponent,
        },
    ],
})
export class FilterPlayersFieldComponent implements ControlValueAccessor {
    ROUTES = ROUTES;

    protected activeRoute: keyof typeof ROUTES = ROUTES.FORM;
    changeRoute = (route: keyof typeof ROUTES) => {
        this.activeRoute = route;
    };

    addPlayer = (player: Player) => {
        const newValue = { ...this.value };
        newValue[player.id] = { "player":  player};
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
    };

    isAdded = (player: Player) => {
        return !(this.value[player.id] == null)
    }

    // <--ControlValueAccessor
    onChange: (
        value: Record<
            string,
            {
                player: Player;
            }
        >,
    ) => void = null!;
    onTouched: () => void = null!;

    writeValue(
        obj: Record<
            string,
            {
                player: Player;
            }
        >,
    ): void {
        this.value = obj;
    }

    registerOnChange(
        fn: (
            value: Record<
                string,
                {
                    player: Player;
                }
            >,
        ) => void,
    ): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ControlValueAccessor-->

    protected results: Player[] = [];

    @Input() value!: Record<
        string,
        {
            player: Player;
        }
    >;
    @Input() disabled = false;

    constructor(private playerDataAccess: PlayerDataAccessService) {}

    async onFormSubmit(formData: any) {
        const response = this.playerDataAccess.listPlayers({
            name: formData.name,
            limitBy: null
        });

        response.subscribe({
            next: (response) => {
                if (response === null) {
                    return;
                }

                this.results = response.players.map(PlayerMapper.apiModelToDomain);

                this.changeRoute(this.ROUTES.RESULT);
            },
        });
    }
}
