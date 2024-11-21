import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlayersPageComponent } from './list-players-page.component';

describe('ListPlayersPageComponent', () => {
  let component: ListPlayersPageComponent;
  let fixture: ComponentFixture<ListPlayersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlayersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlayersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
