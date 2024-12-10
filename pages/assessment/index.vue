<script setup>
definePageMeta({
  title: "Assessment",
  middleware: ["auth"],
  breadcrumb: [{ name: "Assessment", path: "/assessment" }],
});

// Dummy users data
const users = ref([
  { id: "EMP001", name: "John Doe", department: "Engineering" },
  { id: "EMP002", name: "Jane Smith", department: "Marketing" },
  { id: "EMP003", name: "Mike Johnson", department: "Sales" },
  { id: "EMP004", name: "Sarah Williams", department: "HR" },
  { id: "EMP005", name: "James Brown", department: "Engineering" },
  { id: "EMP006", name: "Emily Davis", department: "Marketing" },
]);

// Loading states (set to false since we're using dummy data)
const pending = ref(false);
const error = ref(null);

// Navigate to assessment form
const router = useRouter();
const selectUser = (user) => {
  router.push(`/assessment/${user.id}`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">CBTM Assessment</h1>
          <p class="text-gray-500">
            Select a participant to create or view their assessment
          </p>
        </div>
        <!-- <rs-button variant="primary">
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          New Assessment
        </rs-button> -->
      </div>
    </div>

    <rs-card>
      <div class="p-6">
        <div v-if="pending" class="flex justify-center items-center p-8">
          <Icon name="ph:spinner-bold" class="w-8 h-8 animate-spin" />
        </div>

        <div v-else-if="error" class="text-center p-8">
          <p class="text-red-500">Error loading users. Please try again.</p>
          <rs-button variant="primary" class="mt-4" @click="$fetch">
            Retry
          </rs-button>
        </div>

        <template v-else>
          <rs-table
            :field="['ID', 'Name', 'Department', 'Action']"
            :data="users"
            :options="{ hover: true, striped: true }"
            :advanced="true"
          >
            <template #ID="{ value }">
              <span class="font-medium">{{ value.id }}</span>
            </template>

            <template #Name="{ value }">
              {{ value.name }}
            </template>

            <template #Department="{ value }">
              <rs-badge>{{ value.department }}</rs-badge>
            </template>

            <template #Action="{ value }">
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="selectUser(value)"
              >
                Select
                <Icon name="ph:arrow-right" class="w-4 h-4 ml-1" />
              </rs-button>
            </template>
          </rs-table>
        </template>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped></style>
