import { Component, Input } from '@angular/core';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import Match from '../../models/Match';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '../divider/divider.component';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-match-element',
    standalone: true,
    imports: [
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        CommonModule,
        DividerComponent,
        CoverImageComponent,
        RouterModule,
    ],
    templateUrl: './match-element.component.html',
})
export class MatchElementComponent {
    @Input() match!: Match;
}
