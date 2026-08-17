import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { worker } from './mocks/browser';

async function startApp(): Promise<void> {
  if (typeof window !== 'undefined') {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  await bootstrapApplication(AppComponent, appConfig);
}

startApp().catch((error) => console.error(error));
