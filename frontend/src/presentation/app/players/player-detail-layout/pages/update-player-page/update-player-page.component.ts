import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerDataAccessService } from '../../../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { IUpdatePlayerResolverData } from './update-player-page.resolver';
import parsers from '../../../../../utils/parsers';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import Player from '../../../../../models/Player';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import { IPlayerDetailLayoutResolverData } from '../../player-detail-layout.resolver';

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
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent
    ],
    templateUrl: './update-player-page.component.html',
})
export class UpdatePlayerPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};
    id: string = null!;
    player: Player = null!;

    private get initialData() {
        return {
            name: this.player.name,
            activeSince: parsers.parseJsDateToInputDate(this.player.activeSince),
        };
    }

    constructor(
        private router: Router,
        private playerDataAccess: PlayerDataAccessService,
        private activatedRoute: ActivatedRoute,
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

    ngOnInit() {
        const data: IPlayerDetailLayoutResolverData = this.activatedRoute.snapshot.parent?.data[RESOLVER_DATA_KEY];
        this.id = data.player.id;
        this.player = data.player;

        this.form.patchValue(this.initialData);
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

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }
}
