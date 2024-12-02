import { Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Player, PlayerPickerModalComponent } from './player-picker-modal.component';

export interface SelectedPlayer {
    player: Player;
}

@Component({
    selector: 'app-player-picker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlayerPickerComponent),
            multi: true,
        },
    ],
    template: `
        <div class="space-y-2">
            <button type="button" (click)="openPlayerPickerModal()" class="px-4 py-2 bg-blue-500 text-white rounded">Add Player</button>

            <div *ngIf="value && Object.keys(value).length > 0" class="mt-2">
                <div *ngFor="let key of Object.keys(value)" class="flex items-center justify-between p-2 bg-gray-100 rounded mb-1">
                    <span>{{ value[key].player.name }}</span>
                    <button (click)="removePlayer(key)" class="text-red-500">Remove</button>
                </div>
            </div>
        </div>
    `,
})
export class PlayerPickerComponent implements ControlValueAccessor {
    private dialog = inject(Dialog);

    // Initialize value as an empty object
    value: { [key: string]: SelectedPlayer } = {};

    // Placeholders for onChange and onTouched
    private onChange: (value: { [key: string]: SelectedPlayer }) => void = () => {};
    private onTouched: () => void = () => {};

    // Object.keys for template
    Object = Object;

    openPlayerPickerModal(): void {
        const dialogRef = this.dialog.open(PlayerPickerModalComponent, {
            data: {
                existingPlayers: this.value,
                onSelect: this.onPlayerSelect.bind(this),
            },
        });
    }

    private onPlayerSelect = (player: Player): void => {
        // Create a new object to trigger change detection
        const updatedValue = {
            ...this.value,
            [player.id]: { player },
        };

        // Update local value
        this.value = updatedValue;

        // Notify form of change
        this.onChange(updatedValue);
        this.onTouched();
    };

    removePlayer(playerId: string): void {
        // Create a new object without the removed player
        const { [playerId]: _, ...updatedValue } = this.value;

        // Update local value
        this.value = updatedValue;

        // Notify form of change
        this.onChange(updatedValue);
        this.onTouched();
    }

    // ControlValueAccessor methods
    writeValue(value: { [key: string]: SelectedPlayer }): void {
        this.value = value || {};
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Implement disable logic if needed
    }
}
