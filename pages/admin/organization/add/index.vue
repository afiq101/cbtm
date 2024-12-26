<script setup>
definePageMeta({
  title: "Add Organization",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: "/admin/organization" },
    { name: "Add", type: "current" },
  ],
});

const router = useRouter();
const formData = reactive({
  name: "",
  description: "",
  status: "Active",
});

const handleSubmit = async (formData) => {
  try {
    // Here you would typically make an API call to create the organization
    console.log("Form submitted:", formData);

    // Navigate back to organizations list
    router.push("/organization");
  } catch (error) {
    console.error("Error creating organization:", error);
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Organization</h1>
          <p class="text-gray-500">Create a new organization</p>
        </div>
      </div>
    </div>
    <rs-card class="p-6">
      <FormKit
        type="form"
        :actions="false"
        @submit="handleSubmit"
        :config="{ validationVisibility: 'live' }"
      >
        <FormKit
          type="text"
          name="name"
          label="Organization Name"
          validation="required|length:3"
          :validation-messages="{
            required: 'Organization name is required',
            length: 'Name must be at least 3 characters',
          }"
          v-model="formData.name"
        />

        <FormKit
          type="textarea"
          name="description"
          label="Description"
          validation="required|length:10"
          :validation-messages="{
            required: 'Description is required',
            length: 'Description must be at least 10 characters',
          }"
          v-model="formData.description"
        />

        <FormKit
          type="select"
          name="status"
          label="Status"
          :options="['Active', 'Inactive']"
          validation="required"
          v-model="formData.status"
        />

        <div class="flex justify-end gap-2 mt-6">
          <rs-button
            variant="secondary"
            type="button"
            @click="router.push('/organization')"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button variant="success" btn-type="submit">
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Save Organization
          </rs-button>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>
