/**
 * validation
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';

/* Files */
import { ISchema, IValidation } from '../interfaces/validation';

export default class Validation implements IValidation {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(protected vue: Vue, protected schema: ISchema[]) {}

  getErrors(key: string): string[] {
    const schema = this.schema.find(({ name }) => name === key);

    if (!schema) {
      throw new Error(`Unknown validation key: ${key}`);
    }

    const obj = this.vue.$v[key];

    const errors: string[] = [];

    /* If no schema or not dirty, do nothing */
    if (!schema.validations || !obj.$dirty) {
      return errors;
    }

    /* Look for errors */
    Object.keys(schema.validations)
      .forEach((rule) => {
        if (!obj[rule]) {
          const params = {
            ...obj.$params[rule],
          };

          const numericalParamKeys = Object.keys(params)
            .filter((item) => item !== 'type')
            .filter((item) => typeof params[item] === 'number');

          if (numericalParamKeys.length === 1) {
            /* If only 1 numerical parameter, set as "count" */
            params.count = params[numericalParamKeys[0]];
          }

          errors.push(this.vue.$t(`form:ERRORS.${rule.toUpperCase()}`, params));
        }
      });

    return errors;
  }

  getEvents(key: string, events: string[] = ['input', 'blur']) {
    const schema = this.schema.find(({ name }) => name === key);

    if (!schema) {
      throw new Error(`Unknown validation key: ${key}`);
    }

    return events.reduce((result, event) => {
      if (key in this.vue.$v) {
        Object.defineProperty(result, event, {
          enumerable: true,
          value: () => this.vue.$v[key].$touch(),
        });
      }

      return result;
    }, {});
  }

  getValidations() {
    return this.schema.reduce((result, item) => {
      Object.defineProperty(result, item.name, {
        enumerable: true,
        value: item.validations ?? {},
      });

      return result;
    }, {});
  }

  validate() : boolean {
    this.vue.$v.$touch();

    return !this.vue.$v.$invalid;
  }
}
