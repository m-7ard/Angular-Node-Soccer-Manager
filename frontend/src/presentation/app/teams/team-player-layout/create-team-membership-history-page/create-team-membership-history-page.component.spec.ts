import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamMembershipHistoryPageComponent } from './create-team-membership-history-page.component';

describe('CreateTeamMembershipHistoryPageComponent', () => {
  let component: CreateTeamMembershipHistoryPageComponent;
  let fixture: ComponentFixture<CreateTeamMembershipHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTeamMembershipHistoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTeamMembershipHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
