import { Component } from '@angular/core';
import Player from '../../../../../models/Player';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { object, string, date } from 'superstruct';
import IPresentationError from '../../../../../errors/IPresentationError';
import Team from '../../../../../models/Team';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import structErrorToPresentationError from '../../../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../../../utils/validateSuperstuct';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import { CommonModule, DatePipe } from '@angular/common';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { PickSingleTeamComponent } from '../../../../../reusables/pick-single-team/pick-single-team.component';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { PickSinglePlayerComponent } from '../../../../../reusables/pick-single-player/pick-single-player.component';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import Match from '../../../../../models/Match';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { IMatchPageLayoutResolverData } from '../../match-page-layout.resolver';

interface IFormControls {
    team: FormControl<Team | null>;
    player: FormControl<Player | null>;
    dateOccured: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    teamId: string[];
    playerId: string[];
    dateOccured: string[];
}>;

const validator = object({
    teamId: string(),
    playerId: string(),
    dateOccured: date(),
});

@Component({
    selector: 'app-record-goal-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        PickSingleTeamComponent,
        PickSinglePlayerComponent,
    ],
    templateUrl: './record-goal-page.component.html',
    providers: [DatePipe],
})
export class RecordGoalPageComponent {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    match!: Match;

    dateOccuredHelperTexts!: string[];
    teamIdHelperText!: string[];
    playerIdHelperText!: string[];

    constructor(
        private activtedRoute: ActivatedRoute,
        private router: Router,
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            team: new FormControl(null, {
                validators: [Validators.required],
            }),
            player: new FormControl(null, {
                validators: [Validators.required],
            }),
            dateOccured: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.activtedRoute.parent?.paramMap.subscribe((parms) => {
            const data: IMatchPageLayoutResolverData = this.activtedRoute.parent?.snapshot.data[RESOLVER_DATA_KEY];

            if (data == null) {
                throw new ClientSideErrorException('Record Goal Page: Could not get match data.');
            }

            this.match = data.match;
        });

        this.dateOccuredHelperTexts = [
            `Date Occured must be greater or equal than ${this.datePipe.transform(this.match.startDate, 'yyyy-MM-dd HH:mm:ss')}`,
        ];
        this.teamIdHelperText = [
            `Goal Team must be a member of either team "${this.match.homeTeam.name}" (Home Team) or "${this.match.awayTeam.name}" (Away Team)`,
        ];
        this.playerIdHelperText = [
            `Goal Player must be a member of either team "${this.match.homeTeam.name}" (Home Team) or "${this.match.awayTeam.name}" (Away Team)`,
            `Goal Player must have a valid team membership where the Match's start date (${this.match.startDate}) falls within its active date range.`,
        ];
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();
        const validation = validateSuperstruct(
            {
                teamId: rawValue.team?.id,
                playerId: rawValue.player?.id,
                dateOccured: new Date(rawValue.dateOccured),
            },
            validator,
        );
        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.matchDataAccess
            .recordGoal(this.match.id, {
                teamId: data.teamId,
                playerId: data.playerId,
                dateOccured: data.dateOccured,
            })
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

                    this.router.navigate([`/matches/${this.match.id}`]);
                },
            });
    }
}
