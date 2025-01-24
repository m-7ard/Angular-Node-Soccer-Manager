import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import TeamPlayer from '../../../models/TeamPlayer';
import { CoverImageComponent } from '../../cover-image/cover-image.component';
import { PanelDirectivesModule } from '../../panel/panel.directive.module';
import { MixinStyledCardDirectivesModule } from '../../styled-card/styled-card.module';

@Component({
    selector: 'app-team-player-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        CommonModule,
        RouterModule,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
        PopoverModule,
        RouterModule,
    ],
    templateUrl: './team-player-element.component.html',
})
export class TeamPlayerElementComponent {
    @Input() teamPlayer!: TeamPlayer;

    public url!: string;

    ngOnInit(): void {
        this.url = '/teams/' + this.teamPlayer.membership.teamId + '/memberships/' + this.teamPlayer.membership.id;
    }
}
