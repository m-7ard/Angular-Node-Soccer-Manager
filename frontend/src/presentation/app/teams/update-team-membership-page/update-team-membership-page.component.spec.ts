import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeamMembershipPageComponent } from './update-team-membership-page.component';

describe('UpdateTeamMembershipPageComponent', () => {
  let component: UpdateTeamMembershipPageComponent;
  let fixture: ComponentFixture<UpdateTeamMembershipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeamMembershipPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTeamMembershipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
