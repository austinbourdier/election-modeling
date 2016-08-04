import 'rxjs/Rx';
import { HTTP_PROVIDERS, BaseRequestOptions, RequestOptions, RequestOptionsArgs }  from '@angular/http';
import { provide }             from '@angular/core';
import { addProviders } from '@angular/core/testing';

beforeEach(() => {
  addProviders(
    [HTTP_PROVIDERS,
    provide(RequestOptions, { useClass: CustomRequestOptions })]
  );
});

class CustomRequestOptions extends BaseRequestOptions {
  merge(options?: RequestOptionsArgs): RequestOptions {
    options.url = 'http://localhost:1234' + options.url;
    let result = super.merge(options);
    result.merge = this.merge;
    return result;
  }
}

export function pactProvider(done: Function): any {
  let matadorProvider = Pact.mockService({
    consumer: 'Angular',
    provider: 'Matador',
    port: 1234,
    done: function(error: any) {
      console.info('Running pact done function.');
      expect(error).toBe(null);
    }
  });
  // Clean state
  matadorProvider.resetSession(done);
  return matadorProvider;
};
