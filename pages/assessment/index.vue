<!-- pages/assessment/index.vue -->
<script setup>
definePageMeta({
  title: "Assessment",
  middleware: ["auth"],
  breadcrumb: [{ name: "Assessment", path: "/assessment" }],
});

// Define assessment categories with their metrics
const assessmentCategories = ref([
  {
    id: "competency",
    title: "Competency Assessment",
    description: "Evaluate professional competencies and skills",
    icon: "ph:brain",
    metrics: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Technical Skills",
    ],
    color: "blue",
  },
  {
    id: "health",
    title: "Health Assessment",
    description: "Track health and wellness metrics",
    icon: "ph:heart",
    metrics: [
      "Physical Fitness",
      "Mental Health",
      "Nutrition",
      "Sleep Quality",
    ],
    color: "green",
  },
  {
    id: "performance",
    title: "Performance Metrics",
    description: "Measure work performance and productivity",
    icon: "ph:chart-line-up",
    metrics: ["Productivity", "Quality", "Efficiency", "Goal Achievement"],
    color: "purple",
  },
  {
    id: "safety",
    title: "Safety Compliance",
    description: "Assess workplace safety adherence",
    icon: "ph:shield-check",
    metrics: ["Safety Protocols", "Risk Assessment", "Emergency Preparedness"],
    color: "orange",
  },
]);

const selectedCategory = ref(null);

// Dummy users data (only shown after category selection)
const users = ref([
  { id: "EMP001", name: "John Doe", department: "Engineering" },
  { id: "EMP002", name: "Jane Smith", department: "Marketing" },
  { id: "EMP003", name: "Mike Johnson", department: "Sales" },
  { id: "EMP004", name: "Sarah Williams", department: "HR" },
  { id: "EMP005", name: "James Brown", department: "Engineering" },
  { id: "EMP006", name: "Emily Davis", department: "Marketing" },
]);

const router = useRouter();

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const selectUser = (user) => {
  router.push(`/assessment/${user.id}`);
};

const backToCategories = () => {
  selectedCategory.value = null;
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
            {{
              selectedCategory
                ? "Select a participant for assessment"
                : "Choose an assessment category"
            }}
          </p>
        </div>
        <rs-button
          v-if="selectedCategory"
          variant="secondary-outline"
          @click="backToCategories"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
          Back to Categories
        </rs-button>
      </div>
    </div>

    <!-- Assessment Categories Grid -->
    <div
      v-if="!selectedCategory"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <rs-card
        v-for="category in assessmentCategories"
        :key="category.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="selectCategory(category)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div :class="`p-3 rounded-lg bg-${category.color}-100`">
              <Icon
                :name="category.icon"
                class="w-6 h-6"
                :class="`text-${category.color}-600`"
              />
            </div>
            <rs-badge :color="category.color">
              {{ category.metrics.length }} metrics
            </rs-badge>
          </div>

          <h3 class="text-lg font-semibold mb-2">{{ category.title }}</h3>
          <p class="text-gray-600 mb-4">{{ category.description }}</p>

          <div class="space-y-2">
            <div
              v-for="metric in category.metrics.slice(0, 3)"
              :key="metric"
              class="flex items-center text-sm text-gray-500"
            >
              <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
              {{ metric }}
            </div>
            <div
              v-if="category.metrics.length > 3"
              class="text-sm text-gray-400"
            >
              +{{ category.metrics.length - 3 }} more metrics
            </div>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Users List (shown after category selection) -->
    <rs-card v-else>
      <div class="p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold">
            {{ selectedCategory.title }} Participants
          </h2>
          <p class="text-gray-500">
            Select a participant to begin the assessment
          </p>
        </div>

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
              Start Assessment
              <Icon name="ph:arrow-right" class="w-4 h-4 ml-1" />
            </rs-button>
          </template>
        </rs-table>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped>
.category-card {
  @apply transition-all duration-200;

  &:hover {
    @apply transform -translate-y-1;
  }
}
</style>
