import 'hammerjs';
import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'core-js';
import 'zone.js/dist/zone';  // Included with Angular CLI.

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone : new NgZone({}) })
  .catch(err => console.error(err));
