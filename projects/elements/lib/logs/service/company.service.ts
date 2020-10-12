import { CompanyData } from './../models/company-data.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanyData(): Observable<CompanyData> {
    return this.http.get<CompanyData>('/api/core/maincompany/');
  }
}
