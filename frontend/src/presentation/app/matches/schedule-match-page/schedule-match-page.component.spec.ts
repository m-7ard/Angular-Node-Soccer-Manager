import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMatchPageComponent } from './schedule-match-page.component';

describe('ScheduleMatchPageComponent', () => {
  let component: ScheduleMatchPageComponent;
  let fixture: ComponentFixture<ScheduleMatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleMatchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
