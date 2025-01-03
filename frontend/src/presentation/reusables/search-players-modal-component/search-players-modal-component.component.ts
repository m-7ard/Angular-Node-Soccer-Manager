import { Component, EventEmitter, Inject, OnDestroy, TemplateRef } from '@angular/core';
import Player from '../../models/Player';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CharFieldComponent } from '../char-field/char-field.component';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import PlayerMapper from '../../mappers/PlayerMapper';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { ZeebraTextComponent } from '../zeebra-text/zeebra-text.component';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { PanelDirectivesModule } from '../panel/panel.directive.module';
import { DividerComponent } from '../divider/divider.component';

interface IFormControls {
    name: FormControl<string>;
}

export interface SearchPlayersModalComponentData {
    resultsTemplateRef: TemplateRef<any>;
    resultsChangedEmitter: EventEmitter<Player[]>;
}

const routes = {
    form: 'form',
    results: 'results',
};

@Component({
    selector: 'app-search-players-modal-component',
    standalone: true,
    imports: [
        CommonModule,
        FormFieldComponent,
        CharFieldComponent,
        ReactiveFormsModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        ZeebraTextComponent,
        PanelDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './search-players-modal-component.component.html',
})
export class SearchPlayersModalComponentComponent {
    currentRoute: keyof typeof routes = 'form';
    changeRoute(newRoute: keyof typeof routes) {
        this.currentRoute = newRoute;
    }

    form: FormGroup<IFormControls>;
    results: Player[] = [];

    resultsTemplateRef: TemplateRef<any>;
    resultsChangedEmitter: EventEmitter<Player[]>;

    constructor(
        public dialogRef: DialogRef<Player>,
        @Inject(DIALOG_DATA) public data: SearchPlayersModalComponentData,
        private playerDataAccess: PlayerDataAccessService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [],
            }),
        });

        this.resultsTemplateRef = data.resultsTemplateRef;
        this.resultsChangedEmitter = data.resultsChangedEmitter;
    }

    async onFormSubmit() {
        const rawValue = this.form.getRawValue();
        const responseObservable = this.playerDataAccess.listPlayers({
            name: rawValue.name,
            limitBy: null,
        });

        responseObservable.subscribe((dto) => {
            this.results = dto.players.map(PlayerMapper.apiModelToDomain);
            this.resultsChangedEmitter.emit(this.results);
            this.changeRoute('results');
        });
    }
}
