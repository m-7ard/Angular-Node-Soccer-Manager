import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadFieldComponent } from './image-upload-field.component';

describe('ImageUploadFieldComponent', () => {
  let component: ImageUploadFieldComponent;
  let fixture: ComponentFixture<ImageUploadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
