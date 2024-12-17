import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import parsers from '../../../utils/parsers';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { IReadTeamResolverData } from '../read-team-page/read-team-page.resolver';
import Team from '../../../models/Team';

interface IFormControls {
    name: FormControl<string>;
    dateFounded: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    dateFounded: string[];
}>;

@Component({
    selector: 'app-update-team-page',
    standalone: true,
    imports: [
        FormFieldComponent,
        CharFieldComponent,
        ReactiveFormsModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
    templateUrl: './update-team-page.component.html',
})
export class UpdateTeamPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    id: string = null!;
    team: Team = null!;

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private _activatedRoute: ActivatedRoute,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            dateFounded: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    ngOnInit() {
        const data: IReadTeamResolverData = this._activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;

        this.form.patchValue({
            name: this.team.name,
            dateFounded: parsers.parseJsDateToInputDate(this.team.dateFounded),
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .updateTeam(this.id, {
                dateFounded: new Date(rawValue.dateFounded),
                name: rawValue.name,
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
