import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeamsPageTeamElementComponent } from './list-teams-page-team-element.component';

describe('ListTeamsPageTeamElementComponent', () => {
  let component: ListTeamsPageTeamElementComponent;
  let fixture: ComponentFixture<ListTeamsPageTeamElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTeamsPageTeamElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTeamsPageTeamElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
