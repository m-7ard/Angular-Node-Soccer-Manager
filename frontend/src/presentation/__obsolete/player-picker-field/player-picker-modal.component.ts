// player.model.ts
export interface Player {
    id: string;
    name: string;
}

// player-picker-modal.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';

interface PlayerPickerModalData {
    existingPlayers: { [key: string]: Player };
    onSelect: (player: Player) => void;
}

@Component({
    selector: 'app-player-picker-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="p-4 bg-white">
            <h2 class="text-xl font-bold mb-4">Select a Player</h2>

            <div class="mb-4">
                <input type="text" [(ngModel)]="searchTerm" placeholder="Search players" class="w-full p-2 border rounded" />
            </div>

            <div class="max-h-[300px] overflow-y-auto">
                <div *ngFor="let player of filteredPlayers" class="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer" (click)="selectPlayer(player)">
                    <span>{{ player.name }}</span>
                    <span *ngIf="isPlayerAlreadySelected(player)" class="text-green-500"> Already Added </span>
                </div>
            </div>

            <div class="mt-4 flex justify-end space-x-2">
                <button (click)="dialogRef.close()" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            </div>
        </div>
    `,
})
export class PlayerPickerModalComponent {
    searchTerm = '';
    players: Player[] = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Mike Johnson' },
        { id: '4', name: 'Sarah Williams' },
    ];

    constructor(
        public dialogRef: DialogRef<Player>,
        @Inject(DIALOG_DATA) public data: PlayerPickerModalData,
    ) {}

    get filteredPlayers(): Player[] {
        return this.players.filter((player) => player.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && !this.isPlayerAlreadySelected(player));
    }

    isPlayerAlreadySelected(player: Player): boolean {
        return !!this.data.existingPlayers[player.id];
    }

    selectPlayer(player: Player): void {
        this.data.onSelect(player);
        this.dialogRef.close(player);
    }
}
