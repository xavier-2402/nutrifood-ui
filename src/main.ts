import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';


type RuntimeEnv = {
  API_BASE_URL?: string;
};

function resolveRuntimeApiBaseUrl(): string | undefined {
  const runtime = (window as Window & { __env?: RuntimeEnv }).__env;
  const value = runtime?.API_BASE_URL?.trim();
  if (!value) {
    return undefined;
  }

  return value.endsWith('/') ? value : `${value}/`;
}

export function getBaseUrl() {
  const runtimeApiBaseUrl = resolveRuntimeApiBaseUrl();
  if (runtimeApiBaseUrl) {
    return runtimeApiBaseUrl;
  }

  return 'http://localhost:5158';
}


export function getEnvironment() {
  return 2; //1 a producción
}


const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },

];

if (environment.production) {
  enableProdMode();
}


platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
