import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import IPresentationError from '../../../errors/IPresentationError';
import NotFoundException from '../../../exceptions/NotFoundException';
import Player from '../../../models/Player';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { PickSinglePlayerComponent } from '../../../reusables/pick-single-player/pick-single-player.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';

interface IFormControls {
    player: FormControl<Player | null>;
    activeFrom: FormControl<string>;
    activeTo: FormControl<string>;
    number: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    playerId: string[];
    activeFrom: string[];
    activeTo: string[];
    number: string[];
}>;

@Component({
    selector: 'app-create-team-membership-page',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormFieldComponent, CharFieldComponent, PickSinglePlayerComponent, MixinButtonComponent],
    templateUrl: './create-team-membership-page.component.html',
})
export class CreateTeamMembershipPageComponent implements OnInit {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    id: string = null!;

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private route: ActivatedRoute,
    ) {
        this.form = new FormGroup<IFormControls>({
            player: new FormControl(null, {
                nonNullable: false,
                validators: [Validators.required],
            }),
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

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id == null) {
            throw new NotFoundException(`Team id in url is invalid. Url: ${id}`);
        }

        this.id = id;
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .createTeamMembership(this.id, {
                activeFrom: new Date(rawValue.activeFrom),
                activeTo: rawValue.activeTo == null ? null : new Date(rawValue.activeTo),
                playerId: rawValue.player?.id as string,
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

                    this.router.navigate([`/teams/${this.id}/players`]);
                },
            });
    }
}
