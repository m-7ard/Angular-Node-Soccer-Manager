import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlayersPagePlayerElementComponent } from './list-players-page-player-element.component';

describe('ListPlayersPagePlayerElementComponent', () => {
  let component: ListPlayersPagePlayerElementComponent;
  let fixture: ComponentFixture<ListPlayersPagePlayerElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlayersPagePlayerElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlayersPagePlayerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
