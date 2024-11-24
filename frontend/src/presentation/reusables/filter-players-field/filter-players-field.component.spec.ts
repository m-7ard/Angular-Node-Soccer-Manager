import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPlayersFieldComponent } from './filter-players-field.component';

describe('FilterPlayersFieldComponent', () => {
  let component: FilterPlayersFieldComponent;
  let fixture: ComponentFixture<FilterPlayersFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPlayersFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPlayersFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
