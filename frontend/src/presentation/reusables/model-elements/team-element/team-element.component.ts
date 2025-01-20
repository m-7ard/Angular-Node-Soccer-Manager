import { Component, Input } from '@angular/core';
import Team from '../../../models/Team';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { CoverImageComponent } from '../../cover-image/cover-image.component';
import { PanelDirectivesModule } from '../../panel/panel.directive.module';
import { MixinStyledCardDirectivesModule } from '../../styled-card/styled-card.module';

@Component({
    selector: 'app-team-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        RouterModule,
        CommonModule,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
    ],
    templateUrl: './team-element.component.html',
})
export class TeamElementComponent {
    @Input() team!: Team;
}
