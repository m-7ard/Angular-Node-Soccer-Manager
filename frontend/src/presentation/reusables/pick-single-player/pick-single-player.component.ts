import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Player from '../../models/Player';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import { SearchPlayersModalComponentComponent, SearchPlayersModalComponentProps } from '../search-players-modal-component/search-players-modal-component.component';
import { MixinPrototypeCardDirective } from '../prototype-card/prototype-card';
import { MixinPrototypeCardSectionDirective } from '../prototype-card/prototype-card-section';

@Component({
    selector: 'app-pick-single-player',
    standalone: true,
    imports: [CommonModule, MixinButtonComponent, CoverImageComponent, MixinPrototypeCardDirective, MixinPrototypeCardSectionDirective],
    templateUrl: './pick-single-player.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PickSinglePlayerComponent),
            multi: true,
        },
    ],
})
export class PickSinglePlayerComponent implements ControlValueAccessor {
    private dialog = inject(Dialog);
    @Input() value: Player | null = null;

    openPlayerPickerModal(): void {
        const data: SearchPlayersModalComponentProps = {
            selectPlayer: this.value,
            onSelect: this.whenPlayerIsPicked.bind(this),
        };

        const dialogRef = this.dialog.open(SearchPlayersModalComponentComponent, {
            data: data,
        });
    }

    whenPlayerIsPicked(player: Player): void {
        this.value = player;
        this.onChange(player);
        this.onTouched();
    }

    // ControlValueAccessor methods
    writeValue(value: Player): void {
        this.value = value;
    }

    registerOnChange(fn: (value: Player) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange: (value: Player) => void = () => {
        throw new Error('Not implemented.');
    };
    private onTouched: () => void = () => {
        throw new Error('Not implemented.');
    };
}
