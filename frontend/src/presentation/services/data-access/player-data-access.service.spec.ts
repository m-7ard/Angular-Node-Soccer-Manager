import { TestBed } from '@angular/core/testing';

import { PlayerDataAccessService } from './player-data-access.service';

describe('PlayerDataAccessService', () => {
  let service: PlayerDataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerDataAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
