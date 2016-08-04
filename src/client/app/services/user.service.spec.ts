import * as test       from './shared/spec';
import { User }        from '../models/user';
import { UserService } from './user.service';

export function main() {

  describe('Service: UserService', () => {
    let service: UserService;
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
        UserService
      ]);
    });
    /**
     * Yes...this looks redundant, but it prevents use of gnarly inject syntax in it blocks
     * @todo figure out why this works --for some reason it cannot be combined with the tes.beforeEach above
     */
    test.beforeEach(
      test.inject(
        [UserService, test.XHRBackend],
        (s: UserService, mb: test.MockBackend) => {
          service = s;
          mockBackend = mb;
        })
      );

    test.it('is instantiated', () => {
      expect(service).toBeTruthy();
    });

    test.describe('get all$', () => {
      beforeEach(() => {
        // Response for backened to verify
        pact
          .given('get all users')
          .uponReceiving('a request for all users')
          .withRequest('get', '/api/users.json')
          .willRespondWith(200, {
            'Content-Type': 'application/json'
          }, [
            {
              'id': '1',
              'first_name': 'Beverly',
              'last_name': 'Hillbilly',
              'email': 'bumpinbeverly@aol.com',
              'account_id': '1'
            },
            {
              'id': '2',
              'first_name': 'Warren',
              'last_name': 'Haynes',
              'email': 'guitargod@govtmule.com',
              'account_id': '2'
            }
          ]);

          mockBackend.connections.subscribe(
            (connection: test.MockConnection) => {
              connection.mockRespond(new test.Response(
                new test.ResponseOptions({
                  body: {
                    'total' : 2,
                    'data': [
                      {
                        'id': '1',
                        'first_name': 'Beverly',
                        'last_name': 'Hillbilly',
                        'email': 'bumpinbeverly@aol.com',
                        'account_id': '1'
                      },
                      {
                        'id': '2',
                        'first_name': 'Warren',
                        'last_name': 'Haynes',
                        'email': 'guitargod@govtmule.com',
                        'account_id': '2'
                      }
                    ]
                  }
                }
              )));
            }
          );
      });

      /**
       * Verify response with pact
       * @todo this is not running...
       */
      // it('backend API returns expected format', (done: Function) => {
      //   pact.run(done, (runComplete: Function) => {
      //     service.all$.subscribe((data: any) => {
      //       console.info('Running pact assertions.');
      //       expect(data[0].id).toBe(1);
      //       expect(data[0].account_id).toBe(1);
      //       expect(data[0].first_name).toBe('Beverly');
      //       expect(data[0].last_name).toBe('Hillbilly');
      //       expect(data[0].email).toBe('bumpinbeverly@aol.biz'); //should fail

      //       expect(data[1].id).toBe(2);
      //       expect(data[1].account_id).toBe(2);
      //       expect(data[1].first_name).toBe('Warren');
      //       expect(data[1].last_name).toBe('Haynes');
      //       expect(data[1].email).toBe('guitargod@govtmule.gov'); // should fail
      //       runComplete();
      //     });

      //     service.loadAll();
      //     //done(); //No timeout, but assertions not run
      //   });
      //   done(); // No timeout, but assertions not run
      // });

      test.it('returns all Users', (done: Function) => {
        let users = service.all$;

        users.first().subscribe(
          (data: any) => {
            // console.log('!!!!!!!!!!!!!!!!!!!');
            // console.log(data);

            //data = data.data;
            expect(data.length).toBe(2);
            expect(data[0].id).toBe('1');
            expect(data[0]['account_id']).toBe('1');
            expect(data[0].first_name).toBe('Beverly');
            expect(data[0].last_name).toBe('Hillbilly');
            expect(data[0].email).toBe('bumpinbeverly@aol.com');

            expect(data[1].id).toBe('2');
            expect(data[1].account_id).toBe('2');
            expect(data[1].first_name).toBe('Warren');
            expect(data[1].last_name).toBe('Haynes');
            expect(data[1].email).toBe('guitargod@govtmule.com');
          },
          (err) => {
            console.error('[ERROR]:' + err);
            //done.fail(e);
          },
          () => {
            //console.info('UserService.loadAll Complete.');
          }
        );

        // makes the GET request (emits mock value to Observable)
        service.loadAll();
        done();
      }); // end it should return all users

      test.describe('findByAccountId', () => {
        test.it('returns User for given Account id', (done: Function) => {
          let users = service.findByAccountId('2');
          users.subscribe(
            (data: any) => {
              // console.log('!!!!!!!! findByAccountId ~~~~~~~~~~');
              // console.log(data);
              expect(data.length).toBe(1);
              expect(data[1]).toBe(undefined);

              expect(data[0].id).toBe('2');
              expect(data[0]['account_id']).toBe('2');
              expect(data[0].first_name).toBe('Warren');
              expect(data[0].last_name).toBe('Haynes');
              expect(data[0].email).toBe('guitargod@govtmule.com');
              //done();
            },
            (err) => console.error('[ERROR]:' + err),
            () => {
              //console.info('UserService.findByAccountId Complete.');
            }
          );
          service.loadAll();
          done();
        });
      }); // end describe findByAccountId
    }); // end describe get all$

    test.describe('load(:id) (cache miss)', () => {
      test.it('returns User by id', (done: Function) => {
        let users = service.all$;

        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': '1',
                  'first_name': 'Beverly',
                  'last_name': 'Hillbilly',
                  'email': 'bumpinbeverly@aol.com',
                  'account_id': '1'
                }
              }
            )));
          }
        );

        users.first().subscribe(
          (data: any) => {
            data = data[0];
            expect(data.id).toBe('1');
            expect(data.account_id).toBe('1');
            expect(data.first_name).toBe('Beverly');
            expect(data.last_name).toBe('Hillbilly');
            expect(data.email).toBe('bumpinbeverly@aol.com');
          },
          (err) => console.error('[ERROR]:' + err),
          () => {
            //console.info('UserService.load(:id) Complete.');
          }
        );

        // makes the GET request (emits mock value to Observable)
        service.load(1);
        done();
      });
    }); // end describe load(:id)

    test.describe('find$(:id) (should be cache hit, but isnt yet)', () => {
      test.it('returns User by id', (done: Function) => {
        // makes the GET request (emits mock value to Observable)
        let users = service.find$('1');

        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': '1',
                  'first_name': 'Beverly',
                  'last_name': 'Hillbilly',
                  'email': 'bumpinbeverly@aol.com',
                  'account_id': '0'
                }
              }
            )));
          }
        );

        users.first().subscribe(
          (data: any) => {
            expect(data.id).toBe('1');
            expect(data.account_id).toBe('0');
            expect(data.first_name).toBe('Beverly');
            expect(data.last_name).toBe('Hillbilly');
            expect(data.email).toBe('bumpinbeverly@aol.com');
            done();
          },
          (err) => console.error('[ERROR]:' + err),
          () => {
            //console.info('UserService.load(:id) Complete.');
          }
        );
        service.load(2);  //TODO: in the future this will be done w/in the Service
      }, 1000);
    }); // end describe find$(:id)

    test.describe('create(User)', () => {

      test.it('returns created User', (done: Function) => {
        let user = new User();
        user.first_name = 'Rubber';
        user.last_name = 'Chicken';
        user.email = 'marketing@pollolocco.com';
        user.account_id = '0';

        let newUser = service.create(user);

        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': '1091',
                  'first_name': 'Rubber',
                  'last_name': 'Chicken',
                  'email': 'marketing@pollolocco.com',
                  'account_id': '0'
                }
              }
            )));
          }
        );

        newUser.first().subscribe(
          (response: any) => {
            //console.log(response);
            expect(response.id).toBe('1091');
            expect(response.first_name).toBe('Rubber');
            expect(response.last_name).toBe('Chicken');
            expect(response.email).toBe('marketing@pollolocco.com');
            expect(response.account_id).toBe('0');

            done();
          },
          (err: any) => console.error('[ERROR]:' + err),
          () => {
            //console.info('UserService.create Complete.');
          }
        );

      });

      test.it('updates all$ (cache miss)', (done: Function) => {
        let user = new User();
        user.first_name = 'Rubber';
        user.last_name = 'Chicken';
        user.email = 'marketing@pollolocco.com';
        user.account_id = '0';

        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'id': '2001',
                  'first_name': 'Rubber',
                  'last_name': 'Chicken',
                  'email': 'marketing@pollolocco.com',
                  'account_id': '10'
                }
              }
            )));
          }
        );

        service.all$.first().subscribe(
          (response: any) => {
            expect(response[0].id).toBe('2001');
            expect(response[0].first_name).toBe('Rubber');
            expect(response[0].last_name).toBe('Chicken');
            expect(response[0].email).toBe('marketing@pollolocco.com');
            expect(response[0].account_id).toBe('10');

            done();
          },
          (err: any) => { console.error('[ERROR]:' + err); },
          () => {
            //console.info('UserService.create emmitted to all$');
          }
        );

        service.create(user);
        service.load('2001'); //TODO: someday we dont want to need to call this
      }, 1000);
    });

  }); // end describe Service
} // end module
