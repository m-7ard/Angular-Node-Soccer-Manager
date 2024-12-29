import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import Team from '../../../../models/Team';
import { DeleteTeamModal, DeleteTeamModalProps } from '../../delete-team-modal/delete-team-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MatMenuModule } from '@angular/material/menu';
import { PopoverModule } from 'primeng/popover';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { PanelDirectivesModule } from '../../../../reusables/panel/panel.directive.module';
import { PrimeNgPopoverDirective } from '../../../../reusables/prime-ng-popover/prime-ng-popover.directive';

@Component({
    selector: 'app-list-teams-page-team-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        RouterModule,
        CommonModule,
        MixinStyledCardSectionDirective,
        MixinStyledCardDirective,
        MixinStyledButtonDirective,
        ZeebraTextComponent,
        PrimeNgPopoverDirective,
        MatMenuModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
    ],
    templateUrl: './list-teams-page-team-element.component.html',
})
export class ListTeamsPageTeamElementComponent implements OnInit {
    private dialog = inject(Dialog);
    @Input() team!: Team;
    @Output() onDelete = new EventEmitter<Team>();

    seePlayersRoute!: string;

    ngOnInit(): void {
        this.seePlayersRoute = `/teams/${this.team.id}/players`;
    }

    openDeleteTeamModal(): void {
        const data: DeleteTeamModalProps = {
            team: this.team,
            onSuccess: () => this.onDelete.emit(this.team),
        };

        this.dialog.open(DeleteTeamModal, {
            data: data,
        });
    }
}
