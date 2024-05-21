<template>
  <view class="virtualized-list">
    <!-- <BasicForm @register="register"></BasicForm> -->
    <IconColor :icon="ICON_COLOR_UNICODE.COLORQUESHENGYE_QINGDENGDAI" />
  </view>
</template>
<script lang="ts" setup>
import { ICON_COLOR_UNICODE } from '@/components/Basic/IconColor';
import IconColor from '@/components/Basic/IconColor/src/IconColor.vue';
import { ComponentOptions, useForm } from '@/components/Basic/Form'
import BasicForm from '@/components/Basic/Form/src/BasicForm.vue'
import { onMounted } from 'vue'

const [register, { setFieldsValue }] = useForm({
  schemas: [
    {
      field: 'test',
      label: '事件',
      component: ComponentOptions.ApiSelect,
      componentProps: {
        resultField: '',
        api: function () {
          return new Promise((res) =>
            setTimeout(
              () =>
                res([
                  { label: 'test', value: 1 },
                  { label: 'test1', value: 2 },
                  { label: 'test2', value: 3 },
                  { label: 'test3', value: 4 },
                ]),
              1000,
            ),
          )
        },
      },
    },
  ],
})

onMounted(() => {
  setFieldsValue({ test: '1' })
})
</script>
<style lang="scss" scoped></style>
