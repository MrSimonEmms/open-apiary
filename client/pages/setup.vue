<template lang="pug">
  v-content
    v-container.bg-img.fill-height( fluid )
      v-row(
        align="center"
        justify="center"
      )
        v-col( cols="12" md="9" lg="8" )
          v-stepper(
            v-model="step"
          )
            v-stepper-header
              template( v-for="n in steps" )
                v-stepper-step.text-center(
                  :key="`${n}-step`"
                  :step="n"
                  :complete="step > n"
                  :editable="n <= maxStep"
                ) {{ $t(`setup:STEP_${n}:TITLE`) }}
                v-divider( v-if="n < steps" )

            v-stepper-items
              v-stepper-content(
                v-for="n in steps"
                :key="`${n}-content`"
                :step="n"
              )
                v-card( flat )
                  v-card-title {{ $t(`setup:STEP_${n}:TITLE`) }}

                  v-card-text
                    nuxt-child(
                      @submit="nextStep(n)"
                      :ref="`step_${n}`"
                    )

                  v-card-actions
                    v-btn(
                      v-if="n > 1"
                      color="primary"
                      text
                      @click="step -= 1"
                    )
                      v-icon( left ) mdi-chevron-left
                      | {{ $t('setup:BUTTONS.BACK') }}
                    v-spacer
                    v-btn(
                      color="primary"
                      text
                      @click="nextStep(n)"
                    ) {{ $t('setup:BUTTONS.NEXT') }}
                      v-icon( right ) mdi-chevron-right
</template>

<script lang="ts">
/**
 * setup
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

const steps: number = 2;

function getSetupStage(routeName?: string) : number {
  let step = 1;

  if (routeName) {
    const match = routeName.match(/^setup-step-(\d)/);

    if (match) {
      const tmp = Number(match[1]);

      if (tmp <= steps) {
        step = tmp;
      }
    }
  }

  return step;
}

@Component({
  layout: 'blank',

  middleware: [
    'isNotSetup',
  ],

  head() {
    const stageNumber = getSetupStage(this.$route.name);
    return {
      title: this.$i18n.t(`setup:STEP_${stageNumber}.PAGE_TITLE`),
    };
  },

  validate({ route, store }) {
    const stageNumber = getSetupStage(route.name);

    if (stageNumber === 1) {
      /* Always allow for stage 1 */
      return true;
    }

    const maxStage = store.getters['app/setupStage'];

    return stageNumber <= maxStage;
  },
})
export default class Setup extends Vue {
  get maxStep() : number {
    return this.$store.getters['app/setupStage'];
  }

  get step() : number {
    return getSetupStage(this.$route.name);
  }

  set step(step: number) {
    const name = step === 1 ? 'setup' : `setup-step-${step}`;

    this.$router.push({
      name,
    });
  }

  steps: number = steps;

  async nextStep(this: any, key: number) {
    /* Validate the stage */
    const isValid = await this.$refs[`step_${key}`][0].validation();

    if (isValid) {
      if (key === this.steps) {
        await this.$router.push({
          name: 'index',
        });
      } else {
        this.step += 1;
        this.$store.commit('app/setSetupStage', this.step + 1);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bg-img {
    background: {
      size: cover;
      image: url('/img/login/005.jpg');
      position: center center;
    }
  }
</style>
