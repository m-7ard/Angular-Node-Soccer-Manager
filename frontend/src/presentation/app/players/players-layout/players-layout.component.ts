import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { FormFieldComponent, HeaderNavbarButtons } from "../../../reusables/header-navbar/header-navbar.component";

@Component({
    selector: 'app-players-layout',
    standalone: true,
    imports: [
    RouterModule,
    MixinStyledCardDirectivesModule,
    CoverImageComponent,
    MixinStyledButtonDirective,
    ContentGridDirectivesModule,
    DividerComponent,
    PageDirectivesModule,
    CommonModule,
    FormFieldComponent
],
    templateUrl: './players-layout.component.html',
})
export class PlayersLayoutComponent {
    public readonly buttons: HeaderNavbarButtons = [
        { label: "List", url: "/players/" },
        { label: "Create", url: "/players/create" },
    ]
}
