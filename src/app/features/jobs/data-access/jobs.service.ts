import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../../../core/models/job.model';
import jobsMock from '../../../core/mocks/jobs.json';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class JobsService {

  private httpClient = inject(HttpClient);

  getJobs(): Observable<Job[]> {
    return this.httpClient.get<Job[]>(`${environment.apiUrl}/jobs`);
  }
}
