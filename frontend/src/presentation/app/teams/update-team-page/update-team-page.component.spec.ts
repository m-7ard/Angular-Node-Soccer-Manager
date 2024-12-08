import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeamPageComponent } from './update-team-page.component';

describe('UpdateTeamPageComponent', () => {
  let component: UpdateTeamPageComponent;
  let fixture: ComponentFixture<UpdateTeamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeamPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTeamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
