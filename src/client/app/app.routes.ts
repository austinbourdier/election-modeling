import { provideRouter, RouterConfig } from '@angular/router';

import { PresidentComponent }       from './components/president/president.component';
import { HomeComponent }            from './components/home/home.component';
import { SenateComponent }      from './components/senate/senate.component';


export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'model/president', component: PresidentComponent },
  { path: 'model/senate', component: SenateComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];
