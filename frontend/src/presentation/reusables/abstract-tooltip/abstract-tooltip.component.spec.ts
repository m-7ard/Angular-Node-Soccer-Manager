import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractTooltipComponent } from './abstract-tooltip.component';

describe('AbstractTooltipComponent', () => {
  let component: AbstractTooltipComponent;
  let fixture: ComponentFixture<AbstractTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractTooltipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
