import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { AllClientSettingsResponse } from '../models/allClientSettingsRes.model';
import { AllDateFormatsResponse } from '../models/dateFormatsRes.model';

@Injectable({
  providedIn: 'root'
})
export class ClientSettingsService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getAllClientSettings(): Observable<AllClientSettingsResponse> {
    const id = this.cookieService.get('instance_id');
    return this.http.get<AllClientSettingsResponse>(`/api/clients/${id}/settings/client_settings/`);
  }

  getAllDateFormats(): Observable<AllDateFormatsResponse> {
    return this.http.get<AllDateFormatsResponse>(`/api/dateformats/`);
  }
}
