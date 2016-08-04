import * as test from './shared/spec';
import { EngagementService } from './engagement.service';

export function main() {

  describe('Service: EngagementService', () => {
    let service: EngagementService;
    let mockBackend: test.MockBackend;
    let pact: Pact.MockService;

    test.beforeEachProviders(() => [
      test.HTTP_PROVIDERS,
      test.provide(test.XHRBackend, { useClass: test.MockBackend }),
      EngagementService
      ]);

    // Initialize pact
    beforeAll(done => {
      pact = test.pactProvider(done);
    });

    test.beforeEach(
      test.inject(
        [EngagementService, test.XHRBackend],
        (s: EngagementService, mb: test.MockBackend) => {
          service = s;
          mockBackend = mb;
        })
      );

    test.it('is instantiated', () => {
      expect(service).toBeTruthy();
    });

    test.describe('getLowOverTimeData(accountId: string, campaignId: string, granularity: string)', () => {
      test.it('returns Top Performers data', (done: Function) => {
        // Note: this is actually the same as the previous test
        mockBackend.connections.subscribe(
          (connection: test.MockConnection) => {
            connection.mockRespond(new test.Response(
              new test.ResponseOptions({
                body: {
                  'key': 'string',
                  'start_date': '2016-08-01',
                  'end_date': '2016-08-01',
                  'granularity': 'weekly',
                  'mimimum': 1,
                  'maximum': 5,
                  'data': [
                  {
                    'start_date': '2016-08-01',
                    'end_date': '2016-08-08',
                    'count': 0
                  },
                  {
                    'start_date': '2016-08-08',
                    'end_date': '2016-08-15',
                    'count': 3
                  },
                  {
                    'start_date': '2016-08-15',
                    'end_date': '2016-08-22',
                    'count': 4
                  }
                  ]
                }
              }
              )));
          }
          );

        let topPerformers = service.getLowOverTimeData('1', '2', 'weekly');
        topPerformers.subscribe(
          (response: any) => {
            expect(response.granularity).toBe('weekly');
            expect(response.data[0].count).toBe(0);
            expect(response.data[1].end_date).toBe(response.data[2].start_date);
            expect(response.data[2].count).toBe(4);
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
