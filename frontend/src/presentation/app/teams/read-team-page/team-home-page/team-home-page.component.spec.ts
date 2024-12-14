import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamHomePageComponent } from './team-home-page.component';

describe('TeamHomePageComponent', () => {
  let component: TeamHomePageComponent;
  let fixture: ComponentFixture<TeamHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
