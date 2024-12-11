<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Assessment Participants",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Assessment", path: "/assessment" },
    { name: "Participants", type: "current" },
  ],
});

const categoryId = useRoute().params.categoryId;

// Get workflow steps from framework settings
const workflowSteps = ref([
  { id: 1, name: "Self Assessment", required: true, order: 1 },
  { id: 2, name: "Peer Review", required: true, order: 2 },
  { id: 3, name: "Manager Review", required: true, order: 3 },
  { id: 4, name: "Final Approval", required: true, order: 4 },
]);

const users = ref([
  {
    id: 1,
    name: "John Doe",
    department: "Engineering",
    currentStep: 1,
    completedSteps: [],
  },
  // ... more users
]);

const getWorkflowStatus = (user) => {
  const currentStep = workflowSteps.value.find(
    (step) => step.id === user.currentStep
  );
  return {
    label: currentStep?.name || "Completed",
    color:
      user.completedSteps.length === workflowSteps.value.length
        ? "green"
        : "blue",
  };
};

// Get category details based on route param
const category = computed(() => {
  const categories = {
    competency: {
      title: "Competency Assessment",
      color: "blue",
    },
    health: {
      title: "Health Assessment",
      color: "green",
    },
    performance: {
      title: "Performance Metrics",
      color: "purple",
    },
    safety: {
      title: "Safety Compliance",
      color: "orange",
    },
  };
  return (
    categories[route.params.categoryId] || {
      title: "Assessment",
      color: "gray",
    }
  );
});

// Search functionality
const searchQuery = ref("");
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
  );
});

const selectUser = (user) => {
  router.push(`/assessment/participants/${categoryId}/${user.id}`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">{{ category.title }}</h1>
          <p class="text-gray-500">
            Select a participant to begin the assessment
          </p>
        </div>
        <rs-button
          variant="secondary-outline"
          @click="router.push('/assessment')"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
          Back to Categories
        </rs-button>
      </div>
    </div>

    <rs-card class="py-6">
      <!-- Participants Table -->
      <rs-table
        :field="['ID', 'Name', 'Department', 'Action']"
        :data="filteredUsers"
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
            Start Assessment
            <Icon name="ph:arrow-right" class="w-4 h-4 ml-1" />
          </rs-button>
        </template>
      </rs-table>

      <!-- Empty State -->
      <div
        v-if="filteredUsers.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <Icon name="ph:users" class="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No participants found matching your search criteria.</p>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped>
.search-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}
</style>
