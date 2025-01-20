import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { PopoverModule } from "primeng/popover";
import { ContentGridDirectivesModule } from "../../../reusables/content-grid/content-grid.directive.module";
import { CoverImageComponent } from "../../../reusables/cover-image/cover-image.component";
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { MatchElementComponent } from "../../../reusables/model-elements/match-element/match-element.component";
import { PageDirectivesModule } from "../../../reusables/page/page.directive.module";
import { PanelDirectivesModule } from "../../../reusables/panel/panel.directive.module";
import { MixinStyledButtonDirective } from "../../../reusables/styled-button/styled-button.directive";
import { MixinStyledCardDirectivesModule } from "../../../reusables/styled-card/styled-card.module";

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
    ],
    templateUrl: './matches-layout.component.html',
})
export class MatchesLayoutComponent {}
