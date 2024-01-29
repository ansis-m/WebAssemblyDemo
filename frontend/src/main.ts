import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

if ('serviceWorker' in navigator && environment.production) {
  navigator.serviceWorker.register('/ngsw-worker.js');
}
