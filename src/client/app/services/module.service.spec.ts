import { provide }                     from '@angular/core';
import { addProviders, inject }        from '@angular/core/testing';
import { HTTP_PROVIDERS,
         XHRBackend,
         Response,
         ResponseOptions }             from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ModuleService } from './module.service';
import { Module } from '../models/module';

describe('Module Service', () => {

  beforeEach(() => {
    addProviders([
      HTTP_PROVIDERS,
      provide(XHRBackend, { useClass: MockBackend }),
      ModuleService,
    ]);
  });

  it('should get modules for account',
    inject([XHRBackend, ModuleService], (mockBackend: MockBackend, moduleService: ModuleService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: [
                {
                  'id': '0',
                  'slug': 'advertising',
                  'name': 'Advertising',
                  'active': true,
                  'effective_start_date': '2016-06-28',
                  'effective_end_date': '2017-06-28',
                  'enforce_dates': false
                }
              ]
            }
            )));
        });

    moduleService.getModules('1').subscribe((modules: any) => {
      expect(modules.length).toBe(1);
      expect(modules[0].id).toBe('0');
      expect(modules[0].name).toBe('Advertising');
      expect(modules[0].active).toBe(true);
      expect(modules[0].effective_start_date).toBe('2016-06-28');
      expect(modules[0].effective_end_date).toBe('2017-06-28');
      expect(modules[0].enforce_dates).toBe(false);
    });

  }));



  it('should get modules for account async',
    inject([XHRBackend, ModuleService], (mockBackend: MockBackend, moduleService: ModuleService) => {
      return new Promise((pass, fail) => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                body: [
                  {
                    'id': '0',
                    'slug': 'advertising',
                    'name': 'Advertising',
                    'active': true,
                    'effective_start_date': '2016-06-28',
                    'effective_end_date': '2017-06-28',
                    'enforce_dates': false
                  }
                ]
              }
              )));
          });

        try {
          moduleService.getModules('1').subscribe(
            (modules: any) => {
              expect(modules.length).toBe(1);
              expect(modules[0].id).toBe('0');
              expect(modules[0].slug).toBe('advertising');
              expect(modules[0].name).toBe('Advertising');
              expect(modules[0].active).toBe(true);
              expect(modules[0].effective_start_date).toBe('2016-06-28');
              expect(modules[0].effective_end_date).toBe('2017-06-28');
              expect(modules[0].enforce_dates).toBe(false);
              pass();
            });
        } catch (error) {
          fail(error);
        }
      });
    }), 3000);

  it('should update module details for account',
    inject([XHRBackend, ModuleService], (mockBackend: MockBackend, moduleService: ModuleService) => {
      return new Promise((pass, fail) => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                body: {
                  'id': '0',
                  'name': 'Advertising',
                  'active': false,
                  'effective_start_date': '2016-10-01',
                  'effective_end_date': '2017-10-01',
                  'enforce_dates': true
                }
              }
              )));
          });

        let module: Module = new Module; //(
        //  0, 'advertising', 'Advertising', true, '2016-06-28', '2017-06-28', false
        //);

        module.active = false;
        module.effective_start_date = '2016-10-01';
        module.effective_end_date = '2017-10-01';
        module.enforce_dates = true;

        try {
          moduleService.update('1', module).subscribe(
            (updatedModule: any) => {
              expect(updatedModule.active).toBe(false);
              expect(updatedModule.effective_start_date).toBe('2016-10-01');
              expect(updatedModule.effective_end_date).toBe('2017-10-01');
              expect(updatedModule.enforce_dates).toBe(true);
              pass();
            });
        } catch (error) {
          fail(error);
        }
      });
    }), 3000);

});
