import { TestBed } from '@angular/core/testing';

import { CustomEventTittleFormatterService } from './custom-event-tittle-formatter.service';

describe('CustomEventTittleFormatterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomEventTittleFormatterService = TestBed.get(CustomEventTittleFormatterService);
    expect(service).toBeTruthy();
  });
});
