declare module Pact {
  interface MockService {
    resetSession(callback: Function): void;
    given(providerState: string): MockService;
    uponReceiving(description: string): MockService;
    withRequest(method: string, path: string, headers?: Object, body?: any): MockService;
    willRespondWith(status: number, headers: Object, body: any): MockService;
    run(completeFunction: Function, testFunction: Function): void;
  }
  export function mockService(opts: Object): MockService;
}
