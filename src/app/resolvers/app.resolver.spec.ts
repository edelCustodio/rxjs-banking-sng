import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { appResolver } from './app.resolver';

describe('appResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => appResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
