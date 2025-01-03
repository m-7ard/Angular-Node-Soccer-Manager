import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ContentChild,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    OnInit,
    TemplateRef,
    Type,
    ViewChild,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Player from '../../models/Player';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import {
    SearchPlayersModalComponentComponent,
    SearchPlayersModalComponentData,
} from '../search-players-modal-component/search-players-modal-component.component';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { ZeebraTextComponent } from '../zeebra-text/zeebra-text.component';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { PlayerSelectResultComponent } from '../search-players-modal-component/player-selector-result-component';

@Component({
    selector: 'app-pick-single-player',
    standalone: true,
    imports: [
        CommonModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        ZeebraTextComponent,
        PlayerSelectResultComponent,
    ],
    templateUrl: './pick-single-player.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PickSinglePlayerComponent),
            multi: true,
        },
    ],
})
export class PickSinglePlayerComponent implements ControlValueAccessor, OnInit {
    private dialog = inject(Dialog);
    private resultsChangedEmitter = new EventEmitter<Player[]>();
    private results: Player[] = [];

    @Input() value: Player | null = null;
    @ViewChild('resultElementsTemplateRef') resultElementsTemplateRef!: TemplateRef<any>;

    ngOnInit(): void {
        this.resultsChangedEmitter.subscribe((players) => {
            this.results = players;
            console.log(this.results);
        });
    }

    openPlayerPickerModal(): void {
        const data: SearchPlayersModalComponentData = {
            resultsTemplateRef: this.resultElementsTemplateRef,
            resultsChangedEmitter: this.resultsChangedEmitter,
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

    resultProps(): Array<typeof PlayerSelectResultComponent.prototype> {
        console.log('called');
        return this.results.map((player) => ({
            isSelected: player.id === this.value?.id,
            player: player,
            selectPlayer: () => this.whenPlayerIsPicked(player),
        }));
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
