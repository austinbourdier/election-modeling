import { bootstrap }                              from '@angular/platform-browser-dynamic';
import { enableProdMode }                         from '@angular/core';
import { disableDeprecatedForms, provideForms }   from '@angular/forms';
import { HTTP_PROVIDERS }                         from '@angular/http';

import './release';
import { AppComponent }                           from './app.component';
import { appRouterProviders }                     from './app.routes';



if ('<%= ENV %>' === 'prod') { enableProdMode(); }


bootstrap(AppComponent, [appRouterProviders, HTTP_PROVIDERS, disableDeprecatedForms(), provideForms()]);
