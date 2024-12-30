import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormResetEvent, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import parsers from '../../../utils/parsers';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { IReadTeamResolverData } from '../read-team-page/read-team-page.resolver';
import Team from '../../../models/Team';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { CommonModule } from '@angular/common';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';

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
    MixinStyledCardDirectivesModule,
    FormErrorsComponent,
    CommonModule,
    DividerComponent,
    PageDirectivesModule,
    ContentGridDirective,
    ContentGridTrackDirective
],
    templateUrl: './update-team-page.component.html',
})
export class UpdateTeamPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    team: Team = null!;

    private get initialData() {
        return {
            name: this.team.name,
            dateFounded: parsers.parseJsDateToInputDate(this.team.dateFounded),
        };
    }

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private activatedRoute: ActivatedRoute,
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
        const data: IReadTeamResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;

        this.form.patchValue(this.initialData);
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .updateTeam(this.team.id, {
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

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }
}
