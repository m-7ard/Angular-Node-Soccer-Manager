import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserPageComponent } from './login-user-page.component';

describe('LoginUserPageComponent', () => {
  let component: LoginUserPageComponent;
  let fixture: ComponentFixture<LoginUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUserPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
