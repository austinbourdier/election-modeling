import * as test from './shared/spec';
//import { Account } from '../models/account';
import { AccountService } from './account.service';

export function main() {

  describe('Service: AccountService', () => {
    let service: AccountService;
    let mockBackend: test.MockBackend;
    let pact: Pact.MockService;

    // Initialize pact
    beforeAll(done => {
      pact = test.pactProvider(done);
    });

    test.beforeEach(() => {
      test.addProviders([
        test.HTTP_PROVIDERS,
        test.provide(test.XHRBackend, { useClass: test.MockBackend }),
        AccountService
      ]);
    });

    /**
     * Yes...this looks redundant, but it prevents use of gnarly inject syntax in it blocks
     * @todo figure out why this works --for some reason it cannot be combined with the tes.beforeEach above
     */
    test.beforeEach(
      test.inject(
        [AccountService, test.XHRBackend],
        (s: AccountService, mb: test.MockBackend) => {
          service = s; mockBackend = mb;
        })
    );

    test.it('is instantiated', () => {
      expect(service).toBeTruthy();
    });

    test.describe('get all$', () => {
      test.beforeEach(() => {
        // Response for backened to verify
        pact
          .given('get all accounts')
          .uponReceiving('a request for all accounts')
          .withRequest('get', '/api/accounts.json')
          .willRespondWith(200, {
            'Content-Type': 'application/json'
          },
          {
            total: 3,
            data: [
                {
                  'id': 1,
                  'account_type': 'Standard',
                  'name': 'Initech',
                  'active': true,
                  'status': 'What is this for?',
                  'parent_id': 2,
                  'salesforce_account_id': null
                },
                {
                  'id': 2,
                  'account_type': 'Master',
                  'name': 'RAMJAC',
                  'active': true,
                  'status': 'King',
                  'parent_id': null,
                  'salesforce_account_id': null
                },
                {
                  'id': 3,
                  'account_type': 'Agency',
                  'name': 'Drumph Dong and Dildos',
                  'active': false,
                  'status': 'slippery',
                  'parent_id': null,
                  'salesforce_account_id': 'longStringOfTextGoesHere'
                }
              ]
            }
          );

          mockBackend.connections.subscribe(
            (connection: test.MockConnection) => {
              connection.mockRespond(new test.Response(
                new test.ResponseOptions({
                  body: {
                    total: 3,
                    data: [
                      {
                        'id': 1,
                        'account_type': 'Standard',
                        'name': 'Initech',
                        'active': true,
                        'parent_id': 2,
                        'salesforce_account_id': null
                      },
                      {
                        'id': 2,
                        'account_type': 'Master',
                        'name': 'RAMJAC',
                        'active': true,
                        'parent_id': null,
                        'salesforce_account_id': 'King'
                      },
                      {
                        'id': 3,
                        'account_type': 'Agency',
                        'name': 'Drumph Dongs and Dildos',
                        'active': false,
                        'parent_id': null,
                        'salesforce_account_id': 'longStringOfTextGoesHere'
                      }
                    ]
                  }
                })
              ));
            }
          );
      }); //end beforeEach

      /**
       * Verify response with pact
       * @todo Running but not passing...
       *       Logs indicate: Missing requests: GET /api/accounts.json
       */
      // it('pact: Backend returns expected format', (done: Function) => {
      //   pact.run(done, (runComplete: Function) => {
      //     service.all$.first().subscribe((data: any) => {
      //       console.info('Running pact assertions.');
      //       console.log(data);
      //       console.log(data.data);
      //       console.log(data.total);

      //       expect(data.length).toBe(3);
      //       expect(data[0].id).toBe(1);
      //       expect(data[0].account_type).toBe('Standard');
      //       expect(data[0].name).toBe('Initech');
      //       expect(data[0].active).toBe(true);
      //       expect(data[0].parent_id).toBe(2);
      //       expect(data[0].salesforce_account_id).toBe(null);

      //       expect(data[1].id).toBe(2);
      //       expect(data[1].account_type).toBe('Master');
      //       expect(data[1].name).toBe('RAMJAC');
      //       expect(data[1].active).toBe(true);
      //       expect(data[1].parent_id).toBe(null);
      //       expect(data[1].salesforce_account_id).toBe('King');

      //       expect(data[2].id).toBe(3);
      //       expect(data[2].account_type).toBe('Agency');
      //       expect(data[2].name).toBe('Drumph Dongs and Dildos');
      //       expect(data[2].active).toBe(false);
      //       expect(data[2].parent_id).toBe(null);
      //       expect(data[2].salesforce_account_id).toBe('longStringOfTextGoesHere');

      //       runComplete();
      //     });

      //     service.loadAll();
      //     done();
      //   });
      // });

      test.it('returns all Accounts', (done: Function) => {
        let accounts = service.all$;

        accounts.first().subscribe(
          (data: any) => {
            //let data = response.data;
            // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!');
            // //console.log(response);
            // console.log(data);
            // console.log(data.total);
            expect(data.length).toBe(3);
            expect(data[0].id).toBe(1);
            expect(data[0].account_type).toBe('Standard');
            expect(data[0].name).toBe('Initech');
            expect(data[0].active).toBe(true);
            expect(data[0].parent_id).toBe(2);
            expect(data[0].salesforce_account_id).toBe(null);

            expect(data[1].id).toBe(2);
            expect(data[1].account_type).toBe('Master');
            expect(data[1].name).toBe('RAMJAC');
            expect(data[1].active).toBe(true);
            expect(data[1].parent_id).toBe(null);
            expect(data[1].salesforce_account_id).toBe('King');

            expect(data[2].id).toBe(3);
            expect(data[2].account_type).toBe('Agency');
            expect(data[2].name).toBe('Drumph Dongs and Dildos');
            expect(data[2].active).toBe(false);
            expect(data[2].parent_id).toBe(null);
            expect(data[2].salesforce_account_id).toBe('longStringOfTextGoesHere');
          },
          (err) => console.error('[ERROR]:' + err),
          () => {
            //console.info('AccountService.loadAll Complete.');
          }
        );

        // makes the GET request (emits mock value to Observable)
        service.loadAll();
        done();
      }); // end it should return all accounts
    }); // end describe get all$

    test.describe('load(:id)', () => {
      test.it('returns Account by id', (done: Function) => {

        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': 1,
                  'account_type': 'Standard',
                  'name': 'Initech',
                  'active': true,
                  'parent_id': 2,
                  'salesforce_account_id': null
                }
              }
            )));
          }
        );

        let accounts = service.find$(1);
        accounts.first().subscribe(
          (response: any) => {
          	//Note: load(:id) returns a single object, rather than array
            expect(response.id).toBe(1);
            expect(response.account_type).toBe('Standard');
            expect(response.name).toBe('Initech');
            expect(response.active).toBe(true);
            expect(response.parent_id).toBe(2);
            expect(response.salesforce_account_id).toBe(null);
          },
          (err) => console.error('[ERROR]:' + err),
          () => {
            //console.info('AccountService.load(:id) Complete.');
          }
        );

        // makes the GET request (emits mock value to Observable)
        service.load(1);
        done();
      });
    }); // end describe load(:id)

    test.describe('find$(:id)', () => {
      test.it('returns Account by id', (done: Function) => {
      	// Note: this is actually the same as the previous test
        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': 2,
                  'account_type': 'Master',
                  'name': 'RAMJAC',
                  'active': true,
                  'parent_id': null,
                  'salesforce_account_id': 'King'
                }
              }
            )));
          }
        );

        let accounts = service.find$(2);
        accounts.first().subscribe(
          (response: any) => {
            expect(response.id).toBe(2);
            expect(response.account_type).toBe('Master');
            expect(response.name).toBe('RAMJAC');
            expect(response.active).toBe(true);
            expect(response.parent_id).toBe(null);
            expect(response.salesforce_account_id).toBe('King');
          },
          (err) => console.error('[ERROR]:' + err),
          () => {
            //console.info('AccountService.find$ Complete.');
          }
        );
        service.load(2);
        done();
      });
    }); // end describe find$


  }); // end describe Service
} // end module
