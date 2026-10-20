import { TestBed } from '@angular/core/testing';

import { LeftBarService } from './left-bar.service';

describe('LeftBarService', () => {
  let service: LeftBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeftBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
