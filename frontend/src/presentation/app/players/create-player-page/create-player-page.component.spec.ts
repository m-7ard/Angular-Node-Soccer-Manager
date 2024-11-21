import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlayerPageComponent } from './create-player-page.component';

describe('CreatePlayerPageComponent', () => {
  let component: CreatePlayerPageComponent;
  let fixture: ComponentFixture<CreatePlayerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlayerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
