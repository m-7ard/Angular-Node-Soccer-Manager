import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeamPlayersPageComponent } from './list-team-players-page.component';

describe('ListTeamPlayersPageComponent', () => {
  let component: ListTeamPlayersPageComponent;
  let fixture: ComponentFixture<ListTeamPlayersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTeamPlayersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTeamPlayersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
