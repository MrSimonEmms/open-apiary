/**
 * apiary.entity.spec
 */

/* Node modules */

/* Third-party modules */
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import Entity from './apiary.entity';

describe('Apiary entity', () => {
  describe('validation', () => {
    it('should have the validation rules configured', () => {
      const decorators = Reflect.getMetadata('__assignedMetadata__', Entity.prototype);

      expect(Object.keys(decorators)).toEqual([
        'MaxLength',
        'IsString',
        'IsNotEmpty',
        'IsOptional',
      ]);

      expect(decorators.IsOptional).toEqual([{
        param: 'name',
        settings: [{
          groups: [
            CrudValidationGroups.UPDATE,
          ],
        }],
      }, {
        param: 'location',
        settings: [{
          groups: [
            CrudValidationGroups.UPDATE,
          ],
        }],
      }, {
        param: 'image',
        settings: [{
          always: true,
        }],
      }]);

      expect(decorators.IsNotEmpty).toEqual([{
        param: 'name',
        settings: [{
          groups: [
            CrudValidationGroups.CREATE,
          ],
        }],
      }, {
        param: 'location',
        settings: [{
          groups: [
            CrudValidationGroups.CREATE,
          ],
        }],
      }]);

      expect(decorators.IsString).toEqual([{
        param: 'name',
        settings: [{
          always: true,
        }],
      }]);

      expect(decorators.MaxLength).toEqual([{
        param: 'name',
        settings: [
          200,
          {
            always: true,
          },
        ],
      }]);
    });
  });
});
