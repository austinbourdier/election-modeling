import * as test from './shared/spec';
import { TopPerformersService } from './top-performers.service';

export function main() {

  describe('Service: TopPerformersService', () => {
    let service: TopPerformersService;
    let mockBackend: test.MockBackend;
    let pact: Pact.MockService;

    test.beforeEachProviders(() => [
      test.HTTP_PROVIDERS,
      test.provide(test.XHRBackend, { useClass: test.MockBackend }),
      TopPerformersService
    ]);

    // Initialize pact
    beforeAll(done => {
      pact = test.pactProvider(done);
    });

    test.beforeEach(
      test.inject(
        [TopPerformersService, test.XHRBackend],
        (s: TopPerformersService, mb: test.MockBackend) => {
          service = s;
          mockBackend = mb;
        })
      );

    test.it('is instantiated', () => {
      expect(service).toBeTruthy();
    });

    test.describe('getOverTimeData(:accountId, :campaignId, :granularity)', () => {
      test.it('returns Top Performers data', (done: Function) => {
        // Note: this is actually the same as the previous test
        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'key': 'string',
                  'start_date': '2016-07-29',
                  'end_date': '2016-07-29',
                  'granularity': 'weekly',
                  'data': [
                    {
                      'start_date': '2016-07-01',
                      'end_date': '2016-07-08',
                      'count': 75,
                      'off_corporate_count': 0
                    },
                    {
                      'start_date': '2016-07-08',
                      'end_date': '2016-07-15',
                      'count': 100,
                      'off_corporate_count': 0
                    },
                    {
                      'start_date': '2016-07-15',
                      'end_date': '2016-07-22',
                      'count': 125,
                      'off_corporate_count': 0
                    },
                  ]
                }
              }
              )));
          }
          );

        let topPerformers = service.getOverTimeData('1', '2', 'weekly');
        topPerformers.subscribe(
          (response: any) => {
            expect(response.granularity).toBe('weekly');
            expect(response.data[0].count).toBe(75);
            expect(response.data[1].end_date).toBe('2016-07-15');
            expect(response.data[2].off_corporate_count).toBe(0);
            done();
          },
          (err: any) => console.error('[ERROR]:' + err),
          () => {
            //Note: Observable will complete
          }
        );
      });
    });

    test.describe('get(:accountId, :campaignId)', () => {
      test.it('returns Top Performers data', (done: Function) => {
        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'start_date': '2016-01-01',
                  'end_date': '2016-05-31',
                  'count': 38,
                  'data': [
                    {
                      'sid': 26719,
                      'name': 'United Telephone',
                      'baseline': 4,
                      'current': 22,
                      'extended': 0,
                      'delta': 18,
                      'lift': 571,
                      'rank': 1
                    },
                    {
                      'sid': 30229,
                      'name': 'Harris',
                      'baseline': 10,
                      'current': 26,
                      'extended': 0,
                      'delta': 16,
                      'lift': 165,
                      'rank': 2
                    },
                    {
                      'sid': 56351,
                      'name': 'Branch Banking and Trust Company',
                      'baseline': 3,
                      'current': 8,
                      'extended': 0,
                      'delta': 5,
                      'lift': 266,
                      'rank': 10
                    }
                  ]
                }
              }
              )));
          }
          );

        let topPerformers = service.get('1', '2');
        topPerformers.subscribe(
          (response: any) => {
            expect(response.start_date).toBe('2016-01-01');
            expect(response.end_date).toBe('2016-05-31');
            expect(response.data.length).toBe(3);
            expect(response.data[0].sid).toBe(26719);
            expect(response.data[1].name).toBe('Harris');
            expect(response.data[2].baseline).toBe(3);
            done();
          },
          (err: any) => console.error('[ERROR]:' + err),
          () => {
            //Note: Observable will complete
          }
        );

      });
    });
  });
}
