<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Superuser</h1>
          <p class="text-gray-500">Create a new superuser account</p>
        </div>
      </div>
    </div>

    <rs-card class="p-4">
      <FormKit
        type="form"
        :config="{ validationVisibility: 'live' }"
        :actions="false"
        @submit="handleAddSuperuser"
      >
        <FormKit
          type="select"
          name="organization"
          label="Organization"
          validation="required"
          :options="organizations"
          :validation-messages="{
            required: 'Organization is required',
          }"
          v-model="organizationId"
          @click="getOrganizations"
          :disabled="isLoadingOrgs"
        />

        <FormKit
          type="text"
          name="name"
          label="Username"
          validation="required|length:3"
          :validation-messages="{
            required: 'Username is required',
            length: 'Username must be at least 3 characters',
          }"
          v-model="name"
        />

        <FormKit
          type="email"
          name="email"
          label="Email"
          validation="required|email"
          :validation-messages="{
            required: 'Email is required',
            email: 'Please enter a valid email',
          }"
          v-model="email"
        />

        <div class="flex justify-end gap-2 mt-4">
          <rs-button
            variant="secondary"
            type="button"
            @click="router.push('/admin/superuser')"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button
            variant="success"
            btn-type="submit"
            :disabled="
              !name ||
              !email ||
              !organizationId
            "
          >
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Add Superuser
          </rs-button>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>

<script setup>
const router = useRouter();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Add Superuser",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Superuser", path: "/admin/superuser" },
    { name: "Add", type: "current" },
  ],
});

const name = ref("");
const email = ref("");
const organizationId = ref("");
const organizations = ref([
  {
    label: "Select Organization",
    value: null,
  },
]);
const isLoadingOrgs = ref(false);

const getOrganizations = async () => {
  if (organizations.value.length > 1 || isLoadingOrgs.value) return;

  isLoadingOrgs.value = true;
  try {
    const resp = await $fetch("/api/lookup/get-organizations");

    organizations.value = [
      { label: "Select Organization", value: null },
      ...resp.data.map((org) => ({
        label: org.org_name,
        value: org.org_id,
      })),
    ];
  } catch (error) {
    console.error("Error fetching organizations:", error);
  } finally {
    isLoadingOrgs.value = false;
  }
};

const handleAddSuperuser = async () => {
  try {
    const resp = await $fetch("/api/superuser/add", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        organizationId: organizationId.value,
      },
    });

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Superuser added successfully",
        icon: "success",
        timer: 2000,
      });

      router.push("/admin/superuser");
    } else {
      $swal.fire({
        title: "Error adding superuser",
        text: resp.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error adding superuser:", error);
  }
};
</script>

<style lang="scss" scoped></style>
