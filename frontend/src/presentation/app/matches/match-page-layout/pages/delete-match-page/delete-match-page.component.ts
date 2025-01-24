import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import { IMatchPageLayoutResolverData } from '../../match-page-layout.resolver';
import Match from '../../../../../models/Match';

@Component({
    selector: 'app-delete-match-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './delete-match-page.component.html',
})
export class DeleteMatchPageComponent {
    errors: IPresentationError<{}> = {};

    match: Match = null!;

    constructor(
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        const data: IMatchPageLayoutResolverData = this.activatedRoute.snapshot.parent?.data[RESOLVER_DATA_KEY];

        this.match = data.match;
    }

    async onSubmit(e: Event) {
        e.preventDefault();

        this.matchDataAccess
            .delete(this.match.id, {})
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 400) {
                        this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.router.navigate([`/matches/`]);
                },
            });
    }
}
