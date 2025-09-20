// language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Holds the current language, default 'en'
  private languageSource = new BehaviorSubject<string>('hi');

  // Observable for other components to subscribe
  currentLanguage$ = this.languageSource.asObservable();

  constructor() {}
  // Call this to update language
  changeLanguage(lang: string) {
    this.languageSource.next(lang);
  }
  getCurrentLanguage(): string {
    return this.languageSource.value;
  }
}
