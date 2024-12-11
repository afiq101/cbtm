<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Add User",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: `/organization/1` },
    { name: "Add User", type: "current" },
  ],
});

// Dummy organization data for group options
const organization = ref({
  groups: [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Marketing" },
  ],
});

// Add new refs for bulk upload handling
const activeTab = ref("single");
const csvFile = ref(null);
const csvErrors = ref(null);

const handleAddUser = async (formData) => {
  try {
    // Here you would typically make an API call to add the user
    console.log("Adding user:", formData);
    // Navigate back to organization details
    router.push(`/organization/${route.params.id}`);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Add new method for handling bulk upload
const handleBulkUpload = async (formData) => {
  try {
    if (!formData.csvFile) {
      throw new Error("Please upload a CSV file");
    }

    // Here you would typically make an API call to process the CSV
    console.log("Processing CSV file:", formData.csvFile);
    router.push(`/organization/${route.params.id}`);
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    csvErrors.value = error.message;
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add User</h1>
          <p class="text-gray-500">Add a new user to the organization</p>
        </div>
      </div>
    </div>
    <rs-card>
      <rs-tab variant="primary" v-model="activeTab">
        <rs-tab-item name="single" title="Single User">
          <FormKit
            type="form"
            :config="{ validationVisibility: 'live' }"
            :actions="false"
            @submit="handleAddUser"
          >
            <FormKit
              type="text"
              name="name"
              label="Full Name"
              validation="required|length:3"
              :validation-messages="{
                required: 'Full name is required',
                length: 'Name must be at least 3 characters',
              }"
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
            />

            <FormKit
              type="select"
              name="role"
              label="Role"
              :options="['Admin', 'User']"
              validation="required"
            />

            <FormKit
              type="select"
              name="group"
              label="Group"
              :options="organization.groups.map((g) => g.name)"
              validation="required"
            />

            <div class="flex justify-end gap-2 mt-4">
              <rs-button
                variant="secondary"
                type="button"
                @click="router.push(`/organization/${route.params.id}`)"
              >
                <Icon name="ph:x" class="w-4 h-4 mr-1" />
                Cancel
              </rs-button>
              <rs-button variant="success" type="submit">
                <Icon name="ph:check" class="w-4 h-4 mr-1" />
                Add User
              </rs-button>
            </div>
          </FormKit>
        </rs-tab-item>

        <rs-tab-item name="bulk" title="Bulk Upload">
          <div class="p-2">
            <p class="mb-4 text-gray-600">
              Upload a CSV file with the following columns: name, email, role,
              group
            </p>

            <FormKit type="form" :actions="false" @submit="handleBulkUpload">
              <FormKit
                type="file"
                name="csvFile"
                label="CSV File"
                accept=".csv"
                validation="required"
                :validation-messages="{
                  required: 'Please select a CSV file',
                }"
              />

              <div v-if="csvErrors" class="mt-4">
                <rs-alert variant="danger" :show="true" :dismissible="true">
                  {{ csvErrors }}
                </rs-alert>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <rs-button
                  variant="secondary"
                  type="button"
                  @click="router.push(`/organization/${route.params.id}`)"
                >
                  <Icon name="ph:x" class="w-4 h-4 mr-1" />
                  Cancel
                </rs-button>
                <rs-button variant="success" type="submit">
                  <Icon name="ph:upload-simple" class="w-4 h-4 mr-1" />
                  Upload Users
                </rs-button>
              </div>
            </FormKit>
          </div>
        </rs-tab-item>
      </rs-tab>
    </rs-card>
  </div>
</template>
