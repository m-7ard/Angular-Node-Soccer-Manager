import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharFieldComponent } from './char-field.component';

describe('CharFieldComponent', () => {
    let component: CharFieldComponent;
    let fixture: ComponentFixture<CharFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CharFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CharFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
