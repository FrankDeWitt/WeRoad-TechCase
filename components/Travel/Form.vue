<script lang="ts" setup>
import dayjs from 'dayjs'

import type { Travel } from '@/types'

const props = defineProps<{
  data: Travel
}>()

const emit = defineEmits<{
  (event: 'update:data', payload: Travel): void
}>()

const localData = ref<Travel>({ ...props.data })

const minReturnDate = computed(() => {
  if (props.data.departureDate) {
    return dayjs(props.data.departureDate, 'DD/MM/YYYY').toDate()
  }
  return dayjs().add(1, 'day').toDate()
})
const updateField = <K extends keyof Travel>(fieldName: K, value: Travel[K]) => {
  localData.value[fieldName] = value
  emit('update:data', localData.value)
}

const handleEndDateSelect = (date: Date) => {
  const returnDate = dayjs(props.data.returnDate, 'DD/MM/YYYY').toDate()
  if (dayjs(date).isAfter(dayjs(returnDate))) {
    updateField('returnDate', '')
  } else {
    updateField('departureDate', dayjs(date).format('DD/MM/YYYY'))
  }
}

watchEffect(() => {
  Object.assign(localData.value, props.data)
})
</script>
<template>
  <form>
    <div class="pb-4 border-b lg:pb-12 border-gray-900/10">
      <div class="grid lg:mt-10 gap-x-6 gap-y-4 lg:gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-6">
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Travel name
          </label>
          <InputText
            id="name"
            :value="localData.name"
            class="w-full"
            @update:model-value="updateField('name', $event)"
          />
        </div>
        <div class="sm:col-span-6">
          <label
            for="description"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Travel description
          </label>
          <Textarea
            id="description"
            :value="localData.description"
            class="w-full h-24 lg:h-32"
            maxlength="230"
            @update:model-value="updateField('description', $event)"
          />
        </div>
        <div class="text-left sm:col-span-3">
          <label
            for="departure"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Departure date
          </label>
          <Calendar
            id="departure"
            date-format="dd/mm/yy"
            class="w-full"
            :model-value="localData.departureDate"
            @update:model-value="
              updateField('departureDate', dayjs($event).format('DD/MM/YYYY')), handleEndDateSelect($event)
            "
          />
        </div>
        <div class="text-left sm:col-span-3">
          <label
            for="return"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Return date
          </label>
          <Calendar
            id="return"
            date-format="dd/mm/yy"
            class="w-full"
            :min-date="minReturnDate"
            :model-value="localData.returnDate"
            @update:model-value="updateField('returnDate', dayjs($event).format('DD/MM/YYYY'))"
          />
        </div>
        <div class="text-left sm:col-span-3">
          <label
            for="picture"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Travel picture
          </label>
          <InputText
            id="picture"
            :value="localData.picture"
            class="w-full"
            placeholder="https://image-url-to-show.com"
            @update:model-value="updateField('picture', $event)"
          />
        </div>
        <div class="text-left sm:col-span-3">
          <label
            for="price"
            class="block text-sm font-medium leading-6 text-left text-gray-900"
          >
            Travel price
          </label>
          <InputNumber
            id="price"
            :model-value="localData.price"
            input-id="currency-germany"
            mode="currency"
            currency="EUR"
            locale="de-DE"
            placeholder="1.000 €"
            class="w-full"
            @update:model-value="updateField('price', $event)"
          />
        </div>
      </div>
    </div>
  </form>
</template>
