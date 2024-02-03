import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    if ('serviceWorker' in navigator) {
      // navigator.serviceWorker.register('/ngsw-worker.js')
      //   .then(registration => console.log('SW registered: ', registration))
      //   .catch(registrationError => console.log('SW registration failed: ', registrationError));
      navigator.serviceWorker.register('/custom-sw.js')
        .then(reg => console.log('Custom Service Worker registered', reg.scope))
        .catch(err => console.error('Custom Service Worker registration failed', err));
    }
  })
  .catch(err => console.error(err));
