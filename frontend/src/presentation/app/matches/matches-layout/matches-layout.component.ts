import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { FormFieldComponent, HeaderNavbarButtons } from '../../../reusables/header-navbar/header-navbar.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        MatMenuModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
        ContentGridDirectivesModule,
        FormFieldComponent,
    ],
    templateUrl: './matches-layout.component.html',
})
export class MatchesLayoutComponent {
    public readonly buttons: HeaderNavbarButtons = [
        { label: 'List', url: '/matches' },
        { label: 'Schedule', url: '/matches/schedule' },
    ];
}
