import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlayersModalComponentComponent } from './search-players-modal-component.component';

describe('SearchPlayersModalComponentComponent', () => {
  let component: SearchPlayersModalComponentComponent;
  let fixture: ComponentFixture<SearchPlayersModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPlayersModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPlayersModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
