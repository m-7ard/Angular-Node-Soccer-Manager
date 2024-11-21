import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixinPrototypeCardSectionComponent } from './mixin-prototype-card-section.component';

describe('MixinPrototypeCardSectionComponent', () => {
  let component: MixinPrototypeCardSectionComponent;
  let fixture: ComponentFixture<MixinPrototypeCardSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixinPrototypeCardSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixinPrototypeCardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
