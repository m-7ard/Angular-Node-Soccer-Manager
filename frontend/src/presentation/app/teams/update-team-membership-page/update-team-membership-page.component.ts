import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import parsers from '../../../utils/parsers';
import { IUpdateTeamMembershipResolverData } from './update-team-membership-page.resolver';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import TeamPlayer from '../../../models/TeamPlayer';
import Team from '../../../models/Team';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';

interface IFormControls {
    activeFrom: FormControl<string>;
    activeTo: FormControl<string>;
    number: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    activeFrom: string[];
    activeTo: string[];
    number: string[];
}>;

@Component({
    selector: 'app-update-team-membership-page',
    standalone: true,
    imports: [
        FormFieldComponent,
        CharFieldComponent,
        ReactiveFormsModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
    templateUrl: './update-team-membership-page.component.html',
})
export class UpdateTeamMembershipPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    teamId: string = null!;
    teamPlayer: TeamPlayer = null!;
    team: Team = null!;
    playerId: string = null!;

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private _activatedRoute: ActivatedRoute,
    ) {
        this.form = new FormGroup<IFormControls>({
            activeFrom: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            activeTo: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            number: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data: IUpdateTeamMembershipResolverData = resolverData[RESOLVER_DATA_KEY];

            this.teamId = data.team.id;
            this.playerId = data.teamPlayer.player.id;

            const teamPlayer = data.teamPlayer;
            const membership = teamPlayer.membership;

            this.teamPlayer = teamPlayer;
            this.team = data.team;

            this.form.patchValue({
                activeFrom: parsers.parseJsDateToInputDate(membership.activeFrom),
                activeTo: membership.activeTo == null ? '' : parsers.parseJsDateToInputDate(membership.activeTo),
                number: membership.number.toString(),
            });
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .updateTeamMembership(this.teamId, this.playerId, {
                activeFrom: new Date(rawValue.activeFrom),
                activeTo: rawValue.activeTo === '' ? null : new Date(rawValue.activeTo),
                number: parseInt(rawValue.number),
            })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }
                    this.router.navigate(['/teams']);
                },
            });
    }
}
