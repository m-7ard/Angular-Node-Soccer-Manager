import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPlayersModalComponent } from './filter-players-modal.component';

describe('FilterPlayersModalComponent', () => {
  let component: FilterPlayersModalComponent;
  let fixture: ComponentFixture<FilterPlayersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPlayersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPlayersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
