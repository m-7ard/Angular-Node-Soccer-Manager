import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadTeamPageComponent } from './read-team-page.component';

describe('ReadTeamPageComponent', () => {
  let component: ReadTeamPageComponent;
  let fixture: ComponentFixture<ReadTeamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadTeamPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTeamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
