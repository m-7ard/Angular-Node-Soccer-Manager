import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, NotFoundError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import {
    ImageUploadFieldComponent,
} from '../../../reusables/image-upload-field/image-upload-field.component';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { PopoverTriggerDirective } from '../../../reusables/popover/popover-trigger.directive';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import IPresentationError from '../../../errors/IPresentationError';
import NotFoundException from '../../../exceptions/NotFoundException';
import parsers from '../../../utils/parsers';
import { FilterPlayersFieldComponent } from "../../../reusables/filter-players-field/filter-players-field.component";
import { FilterPlayersModalComponent } from '../../../reusables/filter-players-modal/filter-players-modal.component';

interface IFormControls {
    playerId: FormControl<string>;
    activeFrom: FormControl<string>;
    activeTo: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    playerId: string[];
    activeFrom: string[];
    activeTo: string[];
}>;

@Component({
    selector: 'app-create-team-membership-page',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    CharFieldComponent,
    FormFieldComponent,
    ImageUploadFieldComponent,
    MixinButtonComponent,
    CommonModule,
    PopoverTriggerDirective,
    FilterPlayersFieldComponent,
    FilterPlayersModalComponent
],
    templateUrl: './create-team-membership-page.component.html',
})
export class CreateTeamMembershipPageComponent implements OnInit {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    id: string = null!;

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private route: ActivatedRoute
    ) {
        this.form = new FormGroup<IFormControls>({
            playerId: new FormControl('', {
                nonNullable: true,
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
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id == null) {
            throw new NotFoundException(`Team id in url is invalid. Url: ${id}`);
        }

        this.id = id;
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();
        /* TODO: finish form */
        this.teamDataAccess
            .createTeamMembership(this.id, { 
                activeFrom: parsers.parseDateOrElse(rawValue.activeFrom, null),
                activeTo: rawValue.activeTo == null ? null : parsers.parseDateOrElse(rawValue.activeTo, "invalid"),
                playerId: rawValue.playerId,
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
