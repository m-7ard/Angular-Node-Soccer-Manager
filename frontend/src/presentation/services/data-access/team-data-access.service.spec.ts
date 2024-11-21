import { TestBed } from '@angular/core/testing';

import { TeamDataAccessService } from './team-data-access.service';

describe('TeamDataAccessService', () => {
  let service: TeamDataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamDataAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
