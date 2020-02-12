/**
 * validation
 */

/* Node modules */

/* Third-party modules */
import { ValidationRule } from 'vuelidate/lib/validators';
import { DynamicDecl, RuleDecl } from 'vue/types/options'; // eslint-disable-line

/* Files */

export interface ISchema {
  name: string;
  validations?: DynamicDecl | RuleDecl;
}

export interface IValidation {
  getErrors(key: string): string[];
  getEvents(key: string, events?: string[]): void;
  getValidations(): {
    [key: string]: ValidationRule,
  };
  resetValidation() : void;
  validate() : boolean;
}
