import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMembershipHistoriesPageComponent } from './team-membership-histories-page.component';

describe('TeamMembershipHistoriesPageComponent', () => {
  let component: TeamMembershipHistoriesPageComponent;
  let fixture: ComponentFixture<TeamMembershipHistoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMembershipHistoriesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMembershipHistoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
