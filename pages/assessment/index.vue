<!-- pages/assessment/index.vue -->
<script setup>
definePageMeta({
  title: "Assessment",
  middleware: ["auth"],
  breadcrumb: [{ name: "Assessment", path: "/assessment" }],
});

// Define assessment categories based on framework scoring components
const assessmentCategories = ref([
  {
    id: "situation",
    title: "Situation Assessment",
    description: "Evaluate understanding of situational context",
    icon: "ph:compass",
    metrics: [
      "Context Understanding",
      "Environmental Awareness",
      "Problem Identification",
      "Stakeholder Analysis",
    ],
    color: "blue",
    weight: 20,
  },
  {
    id: "workload",
    title: "Workload Management",
    description: "Assess workload handling and prioritization",
    icon: "ph:chart-bar",
    metrics: [
      "Task Prioritization",
      "Time Management",
      "Resource Allocation",
      "Work-Life Balance",
    ],
    color: "green",
    weight: 20,
  },
  {
    id: "trigger",
    title: "Trigger Response",
    description: "Evaluate response to triggering events",
    icon: "ph:lightning",
    metrics: [
      "Response Time",
      "Decision Making",
      "Initiative",
      "Adaptability",
    ],
    color: "yellow",
    weight: 20,
  },
  {
    id: "action",
    title: "Action Implementation",
    description: "Assess execution of planned actions",
    icon: "ph:play",
    metrics: [
      "Execution Quality",
      "Follow-through",
      "Collaboration",
      "Results Achievement",
    ],
    color: "purple",
    weight: 20,
  },
  {
    id: "result",
    title: "Result Analysis",
    description: "Evaluate outcomes and impact",
    icon: "ph:chart-line-up",
    metrics: [
      "Goal Achievement",
      "Impact Measurement",
      "Learning Integration",
      "Continuous Improvement",
    ],
    color: "orange",
    weight: 20,
  },
]);

const router = useRouter();

const selectCategory = (category) => {
  router.push(`/assessment/participants/${category.id}`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">CBTM Assessment</h1>
          <p class="text-gray-500">Choose an assessment category</p>
        </div>
      </div>
    </div>

    <!-- Assessment Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Weight: {{ category.weight }}%
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
