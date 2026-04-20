import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../../../core/models/job.model';
import jobsMock from '../../../core/mocks/jobs.json';

@Injectable({ providedIn: 'root' })
export class JobsService {
  getJobs(): Observable<Job[]> {
    return of(jobsMock as Job[]);
  }
}
