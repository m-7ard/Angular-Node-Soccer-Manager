import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { GeneratedFileName, RequiredImageData } from '../image-upload-field.component';
import { CommonModule } from '@angular/common';
import { MixinPrototypeCardSectionComponent } from '../../../ui-mixins/mixin-prototype-card/mixin-prototype-card-section/mixin-prototype-card-section.component';
import { CoverImageComponent } from '../../cover-image/cover-image.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';

@Component({
    selector: 'app-image-upload-field-item',
    standalone: true,
    imports: [CommonModule, CoverImageComponent, MixinPrototypeCardSectionComponent, MixinButtonComponent],
    templateUrl: './image-upload-field-item.component.html',
})
export class ImageUploadFieldItemComponent {
    @Input() data!: RequiredImageData;
    @Input() errors?: string[];
    @Output() onDelete = new EventEmitter<GeneratedFileName>();
}
