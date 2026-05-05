import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview.model';
import { environment } from '../../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class InterviewsService {
  private readonly httpClient = inject(HttpClient);

  getInterviews(): Observable<Interview[]> {
    return this.httpClient.get<Interview[]>(`${environment.apiUrl}/interviews`);
  }
}
