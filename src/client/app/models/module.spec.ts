import { Module } from './module';

export function main() {

  describe('Module', () => {

    it('can be instantiated with values', () => {

      var module = new Module();
      module.slug = 'personalization';
      module.name = 'Personalization';
      module.active = true;
      module.effective_start_date = '2016-06-30';
      module.effective_end_date = '2016-07-30';
      module.enforce_dates = false;

      expect(module.id).toBe(undefined);
      expect(module.name).toBe('Personalization');
      expect(module.active).toBe(true);
      expect(module.effective_start_date).toBe('2016-06-30');
      expect(module.effective_end_date).toBe('2016-07-30');
      expect(module.enforce_dates).toBe(false);
    });

  });

}
