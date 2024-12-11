import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-errors',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="errors != null" class="flex flex-col border border-black divide-y divide-black">
            <div class="font-bold text-sm p-3">Form Errors</div>
            <div class="p-3">
                <div class="text-sm" *ngFor="let error of errors">
                    {{ error }}
                </div>
            </div>
        </div>
    `,
})
export class FormErrorsComponent {
    @Input() errors?: string[];

    @HostBinding('style.display') get displayStyle() {
        return this.errors == null ? 'none' : 'block';
    }
}
