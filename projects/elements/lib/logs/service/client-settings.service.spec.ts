import { TestBed } from '@angular/core/testing';

import { ClientSettingsService } from './client-settings.service';
import { AllClientSettingsResponse } from '../models/allClientSettingsRes.model';
import { AllDateFormatsResponse } from '../models/dateFormatsRes.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';

describe('ClientSettingsService', () => {
  let mockAllClientSettings: AllClientSettingsResponse;
  let mockDateFormats: AllDateFormatsResponse;
  let httpTestingController: HttpTestingController;
  let httpClientSpy: { get: jasmine.Spy };
  let mockCookieService;
  let clientSettingsService: ClientSettingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientSettingsService,
        { provide: CookieService, useValue: mockCookieService }],
      imports: [HttpClientTestingModule, HttpClientModule]
    });
    mockCookieService = jasmine.createSpyObj(['get']);
    httpTestingController = TestBed.get(HttpTestingController);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    clientSettingsService = TestBed.get(ClientSettingsService);
    mockAllClientSettings = {
      id: 125,
      client_id: 128,
      cybersource_payment_url: 'test',
      destination_id: null,
      timezone: 'Europe/Brussels',
      time_format:'am/pm',
      offline_enabled: true,
      online_booking_enabled: true,
      payment_enabled: true,
      payment_method: 'Ingenico',
      payment_config: 'payment_config',
      bank_name: 'AAIB',
      language: 'en-us',
      cm_enabled: false,
      opentravel_enabled: false,
      fdm_enabled: false,
      pos_ssl_enabled: true,
      proxy_enabled: false,
      opera_enabled: false,
      call_accounting_enabled: false,
      proxy_printing_enabled: false,
      date_format: '%d-%m-%Y',
      gdpr_compliant: false,
      fias_enabled: false,
      opentravel_settings: null
    };
    mockDateFormats = {
      data: [
        {
          key: '%Y-%m-%d',
          val: 'YYYY-MM-DD'
        },
        {
          key: '%Y/%m/%d',
          val: 'YYYY/MM/DD'
        }
      ]
    };
  }
  );

  it('should be created', () => {
    const service: ClientSettingsService = TestBed.get(ClientSettingsService);
    expect(service).toBeTruthy();
  });
  it('should GET ALL Client Settings', () => {
    clientSettingsService.getAllClientSettings().subscribe((settings) => {
      expect(settings).toEqual(mockAllClientSettings);
    });

    const request = httpTestingController.expectOne(
      (req: HttpRequest<any>) => req.url.includes('/settings/client_settings/'));
    request.flush(mockAllClientSettings);
    expect(request.request.method).toBe('GET');
    httpTestingController.verify();
  });

  it('should GET ALL Date Formats', () => {
    clientSettingsService.getAllDateFormats().subscribe((formats) => {
      expect(formats).toEqual(mockDateFormats);
    });

    const request = httpTestingController.expectOne(
      (req: HttpRequest<any>) => req.url.includes('/api/dateformats/'));
    request.flush(mockDateFormats);
    expect(request.request.method).toBe('GET');
    httpTestingController.verify();
  });
});
