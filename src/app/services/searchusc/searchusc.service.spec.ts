import { TestBed } from '@angular/core/testing';

import { SearchuscService } from './searchusc.service';

describe('SearchuscService', () => {
  let service: SearchuscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchuscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
