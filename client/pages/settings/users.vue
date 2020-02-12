<template lang="pug">
  div
    oa-confirm( ref="confirm" )

    v-data-table.transparent(
      :loading="loading"
      :headers="headers"
      :items="users"
      :search="search"
      :items-per-page="25"
      :footer-props="{ \
        itemsPerPageOptions: [10, 25, 50, 100, -1], \
        itemsPerPageText: $t('misc:PAGING.ITEMS_PER_PAGE_TEXT') + ':' \
      }"
      :no-data-text="$t('misc:TABLE.NO_USERS')"
      :no-results-text="$t('apiary:INSPECTIONS.NO_RESULTS')"
      :loading-text="$t('misc:TABLE:LOADING')"
      sort-by='name'
    )
      template( v-slot:top )
        v-dialog(
          v-model="dialog"
          max-width="590px"
        )
          template( v-slot:activator="{ on }" )
            .d-flex
              v-text-field(
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('apiary:INSPECTIONS.SEARCH')"
                single-line
                hide-details
                clearable
              )
              v-spacer
              v-btn.my-5(
                color="primary"
                v-on="on"
                @click="clearForm()"
              ) {{ $t('settings:USERS_PAGE.NEW_USER') }}

          v-card
            v-card-title
              .headline {{ $t('settings:USERS_PAGE.NEW_USER') }}

            v-card-text
              v-form(
                @keyup.native.enter="addUser"
              )
                v-text-field(
                  v-model="name"
                  :label="$t('login:FORM.LABEL.NAME')"
                  :error-messages="validator.getErrors('name')"
                  v-on="validator.getEvents('name')"
                  outlined
                )

                v-text-field(
                  v-model="emailAddress"
                  :label="$t('login:FORM.LABEL.EMAIL_ADDRESS')"
                  :error-messages="validator.getErrors('emailAddress')"
                  v-on="validator.getEvents('emailAddress')"
                  outlined
                )

                v-text-field(
                  v-model="password"
                  :label="$t('login:FORM.LABEL.PASSWORD')"
                  :error-messages="validator.getErrors('password')"
                  v-on="validator.getEvents('password')"
                  outlined
                )

            v-card-actions
              v-spacer
              v-btn(
                large
                color="primary"
                @click="addUser"
              ) {{ $t('misc:BUTTONS.SAVE') }}

      template( v-slot:item.changeOnLogin="{ value }" )
        .text-center
          // If changeOnLogin set, means user never logged in
          v-icon(
            v-if="value"
            color="red"
          ) mdi-close-circle
          v-icon(
            v-else
            color="green"
          ) mdi-check-circle
      template( v-slot:item.createdAt="{ value }" ) {{ value | datetime('yyyy-LL-dd TT') }}
      template( v-slot:item.updatedAt="{ value }" ) {{ value | datetime('yyyy-LL-dd TT') }}
      template( v-slot:item.actions="{ item }" )
        v-btn(
          text
          icon
          color="error"
          @click="deleteUser(item.id)"
        )
          v-icon mdi-delete

      template( v-slot:footer.page-text="item" )
        div {{ $t('misc:PAGING.PAGE_TEXT', item) }}
</template>

<script lang="ts">
/**
 * users
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import {
  email,
  minLength,
  required,
} from 'vuelidate/lib/validators';

/* Files */
import { IUser } from '../../../server/user/interfaces/user';
import { IValidation } from '../../interfaces/validation';
import Validation from '../../lib/validation';

declare module 'vue/types/vue' {
  interface Vue {
    users: IUser[];
    validator: IValidation;
  }
}

@Component({
  validations() {
    return this.validator.getValidations();
  },

  async created(this: any) {
    this.validator = new Validation(this, [{
      name: 'emailAddress',
      validations: {
        required,
        email,
        uniqueEmail: async (emailAddress: string) => {
          const users = await this.$store.dispatch('user/list', {
            emailAddress,
          });

          return users.length === 0;
        },
      },
    }, {
      name: 'name',
      validations: {
        required,
      },
    }, {
      name: 'password',
      validations: {
        required,
        minLength: minLength(6),
      },
    }]);

    await this.loadUsers();
  },
})
export default class UserSettingsPage extends Vue {
  $refs!: {
    confirm: any;
  };

  userError: string | null = null;

  dialog: boolean = false;

  loading: boolean = true;

  emailAddress: string = '';

  name: string = '';

  password: string = '';

  search: string = '';

  headers = [{
    text: this.text('login:FORM.LABEL.NAME'),
    value: 'name',
  }, {
    text: this.text('login:FORM.LABEL.EMAIL_ADDRESS'),
    value: 'emailAddress',
  }, {
    text: this.text('misc:TABLE.LOGGED_IN'),
    value: 'changeOnLogin',
  }, {
    text: this.text('misc:FORM.CREATED_AT'),
    value: 'createdAt',
  }, {
    text: this.text('misc:FORM.UPDATED_AT'),
    value: 'updatedAt',
  }, {
    text: this.text('misc:TABLE.ACTIONS'),
    value: 'actions',
    sortable: false,
  }];

  users = [];

  async addUser() {
    this.userError = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      await this.$store.dispatch('user/create', {
        name: this.name,
        emailAddress: this.emailAddress,
        password: this.password,
      });

      this.$log.info('Created new user', {
        emailAddress: this.emailAddress,
      });

      await this.loadUsers();

      this.dialog = false;
    } catch (err) {
      this.$log.error('Unable to create additional user', {
        err,
      });

      this.userError = err.message;
    }
  }

  clearForm() {
    this.validator.resetValidation();
    this.userError = null;
    this.emailAddress = '';
    this.name = '';
    this.password = '';
  }

  async deleteUser(userId: number) {
    this.$log.debug('User delete confirmation requested');

    if (!await this.$refs.confirm.open()) {
      this.$log.debug('User delete cancelled');
      return;
    }

    try {
      await this.$store.dispatch('user/delete', userId);

      await this.loadUsers();
    } catch (err) {
      this.$log.error('Erroring delete user', {
        err,
        userId,
      });
    }
  }

  async loadUsers() : Promise<void> {
    this.loading = true;

    this.users = await this.$store.dispatch('user/list', {
      filterActive: true,
    });

    this.loading = false;
  }

  text(key: string) : string {
    return this.$i18n.t(key);
  }
}
</script>

<style lang="scss" scoped>

</style>
