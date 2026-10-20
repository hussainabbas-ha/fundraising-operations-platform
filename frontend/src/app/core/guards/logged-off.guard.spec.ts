import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedOffGuard } from './logged-off.guard';

describe('loggedOffGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedOffGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
