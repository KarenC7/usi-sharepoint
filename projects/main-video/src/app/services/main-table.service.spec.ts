import { TestBed } from '@angular/core/testing';

import { MainTableService } from './main-table.service';

describe('MainTableService', () => {
  let service: MainTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
