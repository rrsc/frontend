import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  // Force show/hide (overrides counter)
  forceShow(): void {
    this.loadingSubject.next(true);
  }

  forceHide(): void {
    this.loadingSubject.next(false);
    this.loadingCount = 0;
  }
}
