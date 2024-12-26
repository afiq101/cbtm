<script setup>
definePageMeta({
  title: "Add Organization",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: "/admin/organization" },
    { name: "Add", type: "current" },
  ],
});

const { $swal } = useNuxtApp();

const router = useRouter();
const formData = reactive({
  name: "",
  email: "",
  status: "Active",
});

const handleSubmit = async (formData) => {
  try {
    // Here you would typically make an API call to create the organization
    console.log("Form submitted:", formData);

    const resp = await $fetch("/api/organization/add", {
      method: "POST",
      body: {
        name: formData.name,
        email: formData.email,
        status: formData.status,
      },
    });

    console.log(resp);

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Organization created successfully",
        icon: "success",
        timer: 2000,
      });
    } else {
      $swal.fire({
        title: resp.message,
        icon: "error",
        timer: 2000,
      });
    }
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
          type="email"
          name="email"
          label="Email"
          validation="required|email"
          :validation-messages="{
            required: 'Email is required',
            email: 'Email is not valid',
          }"
          v-model="formData.email"
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
            @click="router.push('/admin/organization')"
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
