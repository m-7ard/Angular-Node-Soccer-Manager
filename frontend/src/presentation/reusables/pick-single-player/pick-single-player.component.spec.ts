import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickSinglePlayerComponent } from './pick-single-player.component';

describe('PickSinglePlayerComponent', () => {
  let component: PickSinglePlayerComponent;
  let fixture: ComponentFixture<PickSinglePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickSinglePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickSinglePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
