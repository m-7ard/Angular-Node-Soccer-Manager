import { TestBed } from '@angular/core/testing';

import { UserDataAccessService } from './user-data-access.service';

describe('UserDataAccessService', () => {
  let service: UserDataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
