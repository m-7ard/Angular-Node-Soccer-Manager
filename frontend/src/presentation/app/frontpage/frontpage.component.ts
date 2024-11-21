import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharFieldComponent } from '../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../reusables/form-field/form-field.component';
import {
    ImageUploadFieldComponent,
    ImageUploadValue,
    RequiredImageData,
} from '../../reusables/image-upload-field/image-upload-field.component';
import { MixinButtonComponent } from "../../ui-mixins/mixin-button/mixin-button.component";

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
