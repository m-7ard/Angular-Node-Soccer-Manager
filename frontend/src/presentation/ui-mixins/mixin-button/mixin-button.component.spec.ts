import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixinButtonComponent } from './mixin-button.component';

describe('MixinButtonComponent', () => {
  let component: MixinButtonComponent;
  let fixture: ComponentFixture<MixinButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixinButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
