<script setup>
definePageMeta({
  title: "Add Competency",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", path: "/framework/{id}" },
    { name: "Add Competency", type: "current" },
  ],
});

const route = useRoute();
const router = useRouter();

const formData = reactive({
  name: '',
  description: '',
  criteria: [],
});

const addCriteria = () => {
  formData.criteria.push({
    id: Date.now(),
    name: '',
    description: '',
    weight: 0
  });
};

const removeCriteria = (id) => {
  const index = formData.criteria.findIndex(c => c.id === id);
  if (index !== -1) {
    formData.criteria.splice(index, 1);
  }
};

const handleSubmit = async () => {
  try {
    // API call would go here
    console.log('Submitting competency:', formData);
    router.push(`/framework/${route.params.id}`);
  } catch (error) {
    console.error('Error creating competency:', error);
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-800">Add Competency</h1>
    </div>

    <rs-card class="p-6">
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <div class="space-y-6">
          <FormKit
            type="text"
            name="name"
            label="Competency Name"
            validation="required"
            v-model="formData.name"
          />

          <FormKit
            type="textarea"
            name="description"
            label="Description"
            validation="required"
            v-model="formData.description"
          />

          <!-- Criteria Section -->
          <div class="border-t pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Assessment Criteria</h3>
              <rs-button
                variant="secondary-outline"
                size="sm"
                @click="addCriteria"
              >
                <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                Add Criteria
              </rs-button>
            </div>

            <div class="space-y-4">
              <div
                v-for="criteria in formData.criteria"
                :key="criteria.id"
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between mb-2">
                  <h4 class="font-medium">
                    {{ criteria.name || "New Criteria" }}
                  </h4>
                  <button
                    @click="removeCriteria(criteria.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="ph:x" class="w-4 h-4" />
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    :name="`criteria-${criteria.id}-name`"
                    label="Criteria Name"
                    validation="required"
                    v-model="criteria.name"
                  />
                  <FormKit
                    type="number"
                    :name="`criteria-${criteria.id}-weight`"
                    label="Weight (%)"
                    validation="required|number|min:0|max:100"
                    v-model="criteria.weight"
                  />
                </div>
                
                <FormKit
                  type="textarea"
                  :name="`criteria-${criteria.id}-description`"
                  label="Description"
                  v-model="criteria.description"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-2 mt-6">
            <rs-button
              variant="secondary"
              type="button"
              @click="router.push(`/framework/${route.params.id}`)"
            >
              Cancel
            </rs-button>
            <rs-button variant="success" type="submit">
              Create Competency
            </rs-button>
          </div>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template> 