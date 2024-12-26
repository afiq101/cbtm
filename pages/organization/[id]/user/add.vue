<script setup>
const route = useRoute();
const router = useRouter();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Add User",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: `/organization/1` },
    { name: "Add User", type: "current" },
  ],
});

// Add new refs for bulk upload handling
const activeTab = ref("single");
const csvFile = ref(null);
const csvErrors = ref(null);

const roles = ref([]);
const groups = ref([]);
const isLoadingRoles = ref(true);
const isLoadingGroups = ref(true);

const name = ref("");
const email = ref("");

const getRoles = async () => {
  try {
    isLoadingRoles.value = true;
    const res = await $fetch("/api/lookup/get-roles");

    roles.value = [
      { label: "Select Role", value: null },
      ...res.data.map((role) => ({
        label: role.role_name,
        value: role.role_id.toString(),
      })),
    ];
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    isLoadingRoles.value = false;
  }
};

const getGroups = async () => {
  try {
    isLoadingGroups.value = true;
    const res = await $fetch("/api/lookup/get-groups");

    groups.value = [
      { label: "Select Group", value: null },
      ...res.data.map((group) => ({
        label: group.group_name,
        value: group.group_id.toString(),
      })),
    ];
  } catch (error) {
    console.error("Error fetching groups:", error);
  } finally {
    isLoadingGroups.value = false;
  }
};

const handleAddUser = async () => {
  try {
    const resp = await $fetch("/api/user/add", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        role: selectedRole.value,
        group: selectedGroup.value,
      },
    });

    console.log(resp);

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "User added successfully",
        icon: "success",
        timer: 2000,
      });

      router.push(`/organization/${route.params.id}`);
    } else {
      $swal.fire({
        title: "Error adding user",
        icon: "error",
        timer: 2000,
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Add new method for handling bulk upload
const handleBulkUpload = async (formData) => {
  try {
    if (!csvFile.value) {
      throw new Error("Please upload a CSV/Excel file");
    }

    const file = csvFile.value;
    console.log("FILE:", file);

    const fileData = new FormData();
    fileData.append("file", file);

    console.log("FILE DATA:", fileData);

    const resp = await $fetch("/api/user/bulk-add", {
      method: "POST",
      body: fileData,
    });

    console.log("BULK RESPONSE:", resp);

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Users added successfully",
        icon: "success",
        timer: 2000,
      });

      router.push(`/organization/${route.params.id}`);
    } else {
      $swal.fire({
        title: "Error adding users",
        text: resp.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    csvErrors.value = error.message;
  }
};

const handleFileChange = (event) => {
  csvFile.value = event.target.files[0];
};

const selectedRole = ref("");
const selectedGroup = ref("");
onMounted(async () => {
  await getRoles();
  await getGroups();
});
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

            <FormKit
              type="select"
              name="role"
              label="Role"
              :options="roles"
              validation="required"
              v-model="selectedRole"
              :disabled="isLoadingRoles"
              :placeholder="isLoadingRoles ? 'Loading roles...' : 'Select Role'"
            />

            <FormKit
              type="select"
              name="group"
              label="Group"
              :options="groups"
              validation="required"
              v-model="selectedGroup"
              :disabled="isLoadingGroups"
              :placeholder="
                isLoadingGroups ? 'Loading groups...' : 'Select Group'
              "
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
              <rs-button
                variant="success"
                @click="handleAddUser"
                :disabled="!name || !email || !selectedRole || !selectedGroup"
              >
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
                label="Upload File"
                accept=".xlsx,.xls,.csv"
                validation="required"
                :validation-messages="{
                  required: 'Please select a file',
                }"
                @change="handleFileChange"
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
                <rs-button variant="success" @click="handleBulkUpload">
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
