import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js')
        .then(registration => console.log('SW registered: ', registration))
        .catch(registrationError => console.log('SW registration failed: ', registrationError));
    }
  })
  .catch(err => console.error(err));
