import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';
import { CoverImageComponent } from '../../cover-image/cover-image.component';
import { PanelDirectivesModule } from '../../panel/panel.directive.module';
import { MixinStyledCardDirectivesModule } from '../../styled-card/styled-card.module';
import { Dialog } from '@angular/cdk/dialog';
import Player from '../../../models/Player';

@Component({
    selector: 'app-player-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        CommonModule,
        RouterModule,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
        PopoverModule,
    ],
    templateUrl: './player-element.component.html',
})
export class PlayerElementComponent {
    @Input() player!: Player;
}
