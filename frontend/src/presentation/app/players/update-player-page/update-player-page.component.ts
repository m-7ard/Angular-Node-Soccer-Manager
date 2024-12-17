import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { IUpdatePlayerResolverData } from './update-player-page.resolver';
import parsers from '../../../utils/parsers';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';

interface IFormControls {
    name: FormControl<string>;
    activeSince: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    activeSince: string[];
}>;

@Component({
    selector: 'app-update-player-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
    templateUrl: './update-player-page.component.html',
})
export class UpdatePlayerPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    id: string = null!;

    constructor(
        private router: Router,
        private playerDataAccess: PlayerDataAccessService,
        private _activatedRoute: ActivatedRoute,
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

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data: IUpdatePlayerResolverData = resolverData[RESOLVER_DATA_KEY];
            this.id = data.id;
            const player = data.player;

            this.form.patchValue({
                name: player.name,
                activeSince: parsers.parseJsDateToInputDate(player.activeSince),
            });
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.playerDataAccess
            .update(this.id, {
                activeSince: new Date(rawValue.activeSince),
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
                    this.router.navigate(['/players']);
                },
            });
    }
}
