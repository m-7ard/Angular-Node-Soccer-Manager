import { CommonModule } from '@angular/common';
import { Component, Input, Output, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MixinPrototypeCardComponent } from '../../ui-mixins/mixin-prototype-card/mixin-prototype-card.component';
import { MixinPrototypeCardSectionComponent } from '../../ui-mixins/mixin-prototype-card/mixin-prototype-card-section/mixin-prototype-card-section.component';
import { MixinButtonComponent } from '../../ui-mixins/mixin-button/mixin-button.component';
import { ImageUploadFieldItemComponent } from './image-upload-field-item/image-upload-field-item.component';

export type RequiredImageData = {
    url: string;
    originalFileName: string;
    generatedFileName: GeneratedFileName;
};

export type GeneratedFileName = string & { _: 'generatedFileName' };
export type ImageUploadValue = Map<GeneratedFileName, RequiredImageData>;

@Component({
    selector: 'app-image-upload-field',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MixinPrototypeCardComponent,
        MixinPrototypeCardSectionComponent,
        MixinButtonComponent,
        ImageUploadFieldItemComponent,
    ],
    templateUrl: './image-upload-field.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ImageUploadFieldComponent,
        },
    ],
})
export class ImageUploadFieldComponent implements ControlValueAccessor {
    // <--ControlValueAccessor

    onChange: (value: ImageUploadValue) => void = null!;
    onTouched: () => void = null!;

    writeValue(obj: ImageUploadValue): void {
        this.value = obj;
    }

    registerOnChange(fn: (value: ImageUploadValue) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ControlValueAccessor-->

    async uploadImages(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const fileList = target.files;

        event.preventDefault();

        if (fileList == null) {
            return;
        }

        var fileData = await this.onSubmit(Array.from(fileList));
        fileData.forEach((data) => {
            const generatedFileName = data.generatedFileName as GeneratedFileName;
            this.value.set(generatedFileName, data);
        })

        target.value = '';

        this.onChange(this.value);
        this.onTouched();
    }

    onDelete(generatedFileName: GeneratedFileName): void {
        this.value.delete(generatedFileName);
    }

    @Input() onSubmit!: (files: File[]) => Promise<RequiredImageData[]>;
    @Input() value!: ImageUploadValue;
    @Input() disabled = false;
}
