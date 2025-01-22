import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerDataAccessService } from '../../../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';

interface IFormControls {
    name: FormControl<string>;
    activeSince: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    activeSince: string[];
}>;

@Component({
    selector: 'app-create-player-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './create-player-page.component.html',
})
export class CreatePlayerPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private playerDataAccess: PlayerDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            activeSince: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.playerDataAccess
            .createPlayer({
                activeSince: new Date(rawValue.activeSince),
                name: rawValue.name,
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
                    this.router.navigate(['/players']);
                },
            });
    }

    onReset(): void {
        this.form.reset({
            name: '',
            activeSince: '',
        });
    }
}
