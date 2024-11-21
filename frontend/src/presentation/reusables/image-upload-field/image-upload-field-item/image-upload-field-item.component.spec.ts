import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadFieldItemComponent } from './image-upload-field-item.component';

describe('ImageUploadFieldItemComponent', () => {
  let component: ImageUploadFieldItemComponent;
  let fixture: ComponentFixture<ImageUploadFieldItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadFieldItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageUploadFieldItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
