import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeNgPopoverDirective } from '../prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';

type Option<T> = { label: string; value: T };

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [PrimeNgPopoverDirective, MixinStyledButtonDirective, PopoverModule, CommonModule],
    templateUrl: './select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent<T> implements ControlValueAccessor, OnInit {
    @Input() options!: Array<Option<T>>;
    @Input() value: T | null = null;
    
    public label: string = "---";

    @ViewChild('op') op!: Popover;

    onSelect(option: Option<T>) {
        this.value = option.value;
        this.label = option.label;
        this.onChange(option.value);
        this.onTouched();
        this.op.hide();
    }

    private getLabelForValue(value: T) {
        const label = this.options.find((pair) => pair.value === value)?.label ?? "---";

        if (label == null) {
            throw new Error(`Select could not find a label for value ${JSON.stringify(this.value)}.`);
        }

        return label
    }

    ngOnInit(): void {
        if (this.value) {
            this.label = this.getLabelForValue(this.value);
        }
    }
    

    // ControlValueAccessor methods
    writeValue(value: T): void {
        this.value = value;
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange: (value: T) => void = () => {
        throw new Error('Not implemented.');
    };
    private onTouched: () => void = () => {
        throw new Error('Not implemented.');
    };
}
