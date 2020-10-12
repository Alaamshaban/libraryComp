import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Logsfilter } from '../models/logs-filter.model';
import { LogRecord } from '../ntmp-logs.component';
import { CustomEncoder } from '../service/custom-encoder';

@Injectable({
  providedIn: 'root'
})


export class NtmpLogsService {
  constructor(private http: HttpClient) { }
  getLogs(page: any, filter?: Logsfilter): Observable<LogRecord[]> {
    const requestUrl = `/api/ntmp/logs/`;
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.set('page', page);
    if (filter) {
      Object.keys(filter).map(key => {
        if (filter[key] !== null) {
          params = params.set(key, filter[key]);
        }
      });
    }
    return this.http.get(
      requestUrl,
      { params }) as Observable<LogRecord[]>;
  }
}
