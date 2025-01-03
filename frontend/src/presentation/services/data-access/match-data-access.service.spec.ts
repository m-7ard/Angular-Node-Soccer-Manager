import { TestBed } from '@angular/core/testing';

import { MatchDataAccessService } from './match-data-access.service';

describe('MatchDataAccessService', () => {
  let service: MatchDataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchDataAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
