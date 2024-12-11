<script setup>
definePageMeta({
  title: "Add Framework",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Add", type: "current" },
  ],
});

const router = useRouter();

// Basic framework structure
const formData = reactive({
  name: "",
  description: "",
  type: "",
  status: "draft",
});

// Handle form submission
const handleSubmit = async () => {
  try {
    // Here you would typically make an API call to save the framework
    console.log("Submitting framework:", formData);
    router.push("/framework");
  } catch (error) {
    console.error("Error creating framework:", error);
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Framework</h1>
          <p class="text-gray-500">Create a new assessment framework</p>
        </div>
      </div>
    </div>

    <rs-card class="p-6">
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <!-- Basic Information -->
        <div class="space-y-6">
          <FormKit
            type="text"
            name="name"
            label="Framework Name"
            validation="required|length:3"
            v-model="formData.name"
            help="Enter a descriptive name for your framework"
          />

          <FormKit
            type="textarea"
            name="description"
            label="Description"
            validation="required|length:10"
            v-model="formData.description"
            help="Provide a brief description of the framework's purpose"
          />

          <FormKit
            type="text"
            name="type"
            label="Framework Type"
            validation="required"
            v-model="formData.type"
            help="Define your framework type (e.g., Technical, Leadership, Health)"
          />

          <FormKit
            type="select"
            name="status"
            label="Status"
            :options="[
              { label: 'Draft', value: 'draft' },
              { label: 'Active', value: 'active' },
            ]"
            validation="required"
            v-model="formData.status"
            help="Set the initial status of your framework"
          />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-2 mt-6">
          <rs-button
            variant="secondary"
            type="button"
            @click="router.push('/framework')"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button variant="success" type="submit">
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Create Framework
          </rs-button>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>
