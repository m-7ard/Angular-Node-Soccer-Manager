import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import parsers from '../../../utils/parsers';
import { IUpdateTeamResolverData } from './update-team-page.resolver';
import { MixinButtonComponent } from "../../../ui-mixins/mixin-button/mixin-button.component";
import { FormFieldComponent } from "../../../reusables/form-field/form-field.component";
import { CharFieldComponent } from "../../../reusables/char-field/char-field.component";

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
    imports: [MixinButtonComponent, FormFieldComponent, CharFieldComponent, ReactiveFormsModule],
    templateUrl: './update-team-page.component.html',
})
export class UpdateTeamPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    id: string = null!;

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
        this._activatedRoute.data.subscribe((resolverData) => {
            const data: IUpdateTeamResolverData = resolverData['data'];
            this.id = data.id;
            const team = data.team;

            this.form.patchValue({
                name: team.name,
                dateFounded: parsers.parseJsDateToInputDate(team.dateFounded),
            });
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
