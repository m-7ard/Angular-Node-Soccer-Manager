import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixinPrototypeCardComponent } from './mixin-prototype-card.component';

describe('MixinPrototypeCardComponent', () => {
  let component: MixinPrototypeCardComponent;
  let fixture: ComponentFixture<MixinPrototypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixinPrototypeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixinPrototypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
