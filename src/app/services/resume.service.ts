import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Resume } from '../models/resume';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);

  private readonly url = 'assets/resume.json';

  getResume(): Observable<Resume> {
    return this.http.get<Resume>(this.url).pipe(shareReplay(1));
  }
}

