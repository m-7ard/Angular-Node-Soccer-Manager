import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { GeneratedFileName, ImageUploadFieldComponent, ImageUploadValue, RequiredImageData } from '../../../reusables/image-upload-field/image-upload-field.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';

@Component({
  selector: 'app-create-player-page',
  standalone: true,
  imports: [ReactiveFormsModule, CharFieldComponent, FormFieldComponent, ImageUploadFieldComponent, MixinButtonComponent],
  templateUrl: './create-player-page.component.html',
})
export class CreatePlayerPageComponent {
    form: FormGroup = null!;

    constructor(private fb: FormBuilder) {}

    async uploadImages(files: File[]) {
        const uploadedImages: RequiredImageData[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const generatedFileName = `${crypto.randomUUID()}.jpg`;

            uploadedImages.push({
                generatedFileName: generatedFileName as GeneratedFileName,
                originalFileName: file.name,
                url: '/assets/' + generatedFileName,
            });
        }

        return uploadedImages;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: new FormControl<string>('60', []),
            images: new FormControl<ImageUploadValue>(new Map(), []),
        });

        this.form.get('name')?.valueChanges.subscribe((value) => {
            console.log('Char field value changed:', value);
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            console.log('Form submitted:', this.form.value);
        }
    }
}
