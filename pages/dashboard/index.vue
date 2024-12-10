<script setup>
import {
  BarChart,
  LineChart,
  DoughnutChart,
  useBarChart,
  useLineChart,
  useDoughnutChart,
} from "vue-chart-3";

definePageMeta({
  title: "Dashboard",
  middleware: ["auth"],
  breadcrumb: [{ name: "Dashboard", path: "/" }],
});

// CBTM Level Definitions
const competencyLevels = {
  NOVICE: { min: 0, max: 64, color: "#EF4444" }, // Red
  CAPABLE: { min: 65, max: 84, color: "#F59E0B" }, // Yellow
  SKILLED: { min: 85, max: 92, color: "#3B82F6" }, // Blue
  EXPERT: { min: 93, max: 100, color: "#10B981" }, // Green
};

// Assessment Scores Data (Example for one competency)
const assessmentScores = ref([
  {
    name: "Strategic Thinking",
    situation: 75,
    workload: 82,
    trigger: 65,
    action: 90,
    result: 78,
    totalScore: 78, // Average or weighted calculation
  },
  // Add more competencies...
]);

const assessmentChartData = computed(() => ({
  labels: ["Situation", "Workload", "Trigger", "Action", "Result"],
  datasets: [
    {
      label: "Score",
      data: [
        assessmentScores.value[0].situation,
        assessmentScores.value[0].workload,
        assessmentScores.value[0].trigger,
        assessmentScores.value[0].action,
        assessmentScores.value[0].result,
      ],
      backgroundColor: [
        "#4B5563", // Gray
        "#3B82F6", // Blue
        "#10B981", // Green
        "#F59E0B", // Yellow
        "#EF4444", // Red
      ],
      borderColor: "#FFFFFF",
      borderWidth: 1,
      borderRadius: 8,
    },
  ],
}));

// Competency Level Distribution
const competencyData = computed(() => ({
  labels: [
    "NOVICE (<65)",
    "CAPABLE (65-84)",
    "SKILLED (85-92)",
    "EXPERT (>92)",
  ],
  datasets: [
    {
      data: [2, 3, 1, 1], // Example distribution of competencies across levels
      backgroundColor: [
        "#EF4444", // Red - NOVICE
        "#F59E0B", // Yellow - CAPABLE
        "#3B82F6", // Blue - SKILLED
        "#10B981", // Green - EXPERT
      ],
      borderColor: "#FFFFFF",
      borderWidth: 1,
    },
  ],
}));

// Progress Tracking Over Time
const progressValues = ref([
  { date: "Jan 2024", score: 45, level: "NOVICE" },
  { date: "Feb 2024", score: 68, level: "CAPABLE" },
  { date: "Mar 2024", score: 75, level: "CAPABLE" },
  { date: "Apr 2024", score: 88, level: "SKILLED" },
  { date: "May 2024", score: 90, level: "SKILLED" },
  { date: "Jun 2024", score: 95, level: "EXPERT" },
]);

const progressChartData = computed(() => ({
  labels: progressValues.value.map((item) => item.date),
  datasets: [
    {
      label: "Competency Progress",
      data: progressValues.value.map((item) => item.score),
      borderColor: "#3B82F6",
      backgroundColor: "#93C5FD",
      tension: 0.4,
      fill: true,
    },
  ],
}));

// Chart Options
const assessmentOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: "Score (%)",
      },
    },
  },
}));

const competencyOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: false,
    },
  },
}));

const progressOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: "Score (%)",
      },
      ticks: {
        callback: function (value) {
          if (value <= 64) return `NOVICE (${value})`;
          if (value <= 84) return `CAPABLE (${value})`;
          if (value <= 92) return `SKILLED (${value})`;
          return `EXPERT (${value})`;
        },
      },
    },
  },
}));

// Use chart composables
const { barChartProps } = useBarChart({
  chartData: assessmentChartData,
  options: assessmentOptions,
});

const { doughnutChartProps } = useDoughnutChart({
  chartData: competencyData,
  options: competencyOptions,
});

const { lineChartProps } = useLineChart({
  chartData: progressChartData,
  options: progressOptions,
});

// Performance Matrix Structure
const createMatrixStructure = () => ({
  high: {
    high: {
      title: "STARS",
      description: "Outstanding Performance, High Potential",
      color: "#3B82F6",
      participants: [],
    },
    medium: {
      title: "HIGH PERFORMERS",
      description: "Outstanding Performance, Moderate Potential",
      color: "#10B981",
      participants: [],
    },
    low: {
      title: "WORKHORSES",
      description: "Outstanding Performance, Limited Potential",
      color: "#F59E0B",
      participants: [],
    },
  },
  medium: {
    high: {
      title: "HIGH POTENTIALS",
      description: "Good Performance, High Potential",
      color: "#8B5CF6",
      participants: [],
    },
    medium: {
      title: "CORE PLAYERS",
      description: "Good Performance, Moderate Potential",
      color: "#6B7280",
      participants: [],
    },
    low: {
      title: "UP OR OUT GRINDERS",
      description: "Good Performance, Limited Potential",
      color: "#EC4899",
      participants: [],
    },
  },
  low: {
    high: {
      title: "DYSFUNCTIONAL GENIUSES",
      description: "Poor Performance, High Potential",
      color: "#EF4444",
      participants: [],
    },
    medium: {
      title: "UP OR OUT DILEMMAS",
      description: "Poor Performance, Moderate Potential",
      color: "#F97316",
      participants: [],
    },
    low: {
      title: "BAD HIRES",
      description: "Poor Performance, Limited Potential",
      color: "#DC2626",
      participants: [],
    },
  },
});

// Sample user data
const participants = ref([
  {
    id: "EMP001",
    name: "John Smith",
    department: "Engineering",
    score: 87.67,
    potential: 92,
    level: "SKILLED",
  },
  {
    id: "EMP002",
    name: "Sarah Johnson",
    department: "Marketing",
    score: 92.8,
    potential: 95,
    level: "EXPERT",
  },
  {
    id: "EMP003",
    name: "Michael Chen",
    department: "Engineering",
    score: 78.5,
    potential: 88,
    level: "CAPABLE",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    department: "Marketing",
    score: 95.2,
    potential: 93,
    level: "EXPERT",
  },
  {
    id: "EMP005",
    name: "James Wilson",
    department: "Engineering",
    score: 82.4,
    potential: 76,
    level: "CAPABLE",
  },
  {
    id: "EMP006",
    name: "Lisa Anderson",
    department: "Marketing",
    score: 68.9,
    potential: 85,
    level: "CAPABLE",
  },
  {
    id: "EMP007",
    name: "David Martinez",
    department: "Engineering",
    score: 91.3,
    potential: 89,
    level: "SKILLED",
  },
  {
    id: "EMP008",
    name: "Jessica Taylor",
    department: "Marketing",
    score: 85.6,
    potential: 91,
    level: "SKILLED",
  },
  {
    id: "EMP009",
    name: "Robert Brown",
    department: "Engineering",
    score: 73.2,
    potential: 82,
    level: "CAPABLE",
  },
  {
    id: "EMP010",
    name: "Amanda White",
    department: "Marketing",
    score: 89.4,
    potential: 94,
    level: "SKILLED",
  },
  {
    id: "EMP011",
    name: "Thomas Lee",
    department: "Engineering",
    score: 94.1,
    potential: 96,
    level: "EXPERT",
  },
  {
    id: "EMP012",
    name: "Michelle Garcia",
    department: "Marketing",
    score: 86.7,
    potential: 87,
    level: "SKILLED",
  },
  // Add more sample data...
]);

// Pagination settings
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref("");
const selectedDepartment = ref("all");

// Performance Matrix with pagination and filtering
const paginatedMatrix = computed(() => {
  const matrix = createMatrixStructure();

  // Filter participants
  const filtered = participants.value.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDepartment =
      selectedDepartment.value === "all" ||
      p.department === selectedDepartment.value;
    return matchesSearch && matchesDepartment;
  });

  // Distribute participants to matrix cells
  filtered.forEach((participant) => {
    let perfLevel = "medium";
    let potLevel = "medium";

    // Determine performance level
    if (participant.score >= 90) perfLevel = "high";
    else if (participant.score < 75) perfLevel = "low";

    // Determine potential level
    if (participant.potential >= 90) potLevel = "high";
    else if (participant.potential < 75) potLevel = "low";

    matrix[perfLevel][potLevel].participants.push(participant);
  });

  // Apply pagination to each category
  Object.keys(matrix).forEach((perfLevel) => {
    Object.keys(matrix[perfLevel]).forEach((potLevel) => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const cell = matrix[perfLevel][potLevel];
      cell.totalCount = cell.participants.length; // Store total count before pagination
      cell.participants = cell.participants.slice(start, start + itemsPerPage);
    });
  });

  return matrix;
});

// Performance and potential levels for iteration
const performanceLevels = ["high", "medium", "low"];
const potentialLevels = ["high", "medium", "low"];

// Total pages calculation
const totalPages = computed(() => {
  const maxParticipants = Math.max(
    ...Object.values(paginatedMatrix.value).flatMap((level) =>
      Object.values(level).map((cell) => cell.totalCount)
    )
  );
  return Math.ceil(maxParticipants / itemsPerPage);
});

// Navigation methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        CBTM Assessment Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Competency-Based Training Management Assessment System
      </p>
    </div>

    <rs-card class="pt-2">
      <rs-tab>
        <rs-tab-item title="Dashboard" active>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Assessment Components Score -->
            <div class="col-span-1 lg:col-span-2">
              <rs-card class="h-full">
                <div class="p-4">
                  <h2 class="text-lg font-semibold mb-4">
                    Assessment Components
                  </h2>
                  <div class="h-[350px]">
                    <ClientOnly>
                      <BarChart v-bind="barChartProps" />
                    </ClientOnly>
                  </div>
                </div>
              </rs-card>
            </div>

            <!-- Competency Level Distribution -->
            <div class="col-span-1">
              <rs-card class="h-full">
                <div class="p-4">
                  <h2 class="text-lg font-semibold mb-4">
                    Competency Distribution
                  </h2>
                  <div class="h-[350px]">
                    <ClientOnly>
                      <DoughnutChart v-bind="doughnutChartProps" />
                    </ClientOnly>
                  </div>
                </div>
              </rs-card>
            </div>

            <!-- Progress Over Time -->
            <div class="col-span-1 lg:col-span-3">
              <rs-card class="h-full">
                <div class="p-4">
                  <h2 class="text-lg font-semibold mb-4">
                    Competency Progress Over Time
                  </h2>
                  <div class="h-[350px]">
                    <ClientOnly>
                      <LineChart v-bind="lineChartProps" />
                    </ClientOnly>
                  </div>
                </div>
              </rs-card>
            </div>
          </div>
        </rs-tab-item>

        <rs-tab-item title="Performance Matrix">
          <div class="p-6">
            <!-- Search and Filter Controls -->
            <div class="mb-6 flex gap-4">
              <div class="flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name or ID..."
                  class="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div class="w-48">
                <select
                  v-model="selectedDepartment"
                  class="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <!-- Add more departments -->
                </select>
              </div>
            </div>

            <!-- Performance Matrix Grid -->
            <div class="grid grid-cols-3 gap-4">
              <template v-for="potential in potentialLevels" :key="potential">
                <template
                  v-for="performance in performanceLevels"
                  :key="performance"
                >
                  <div
                    class="p-4 rounded-lg border transition-all duration-200"
                    :class="{
                      'bg-opacity-10':
                        paginatedMatrix[performance][potential].participants
                          .length > 0,
                    }"
                    :style="{
                      backgroundColor:
                        paginatedMatrix[performance][potential].color + '1A',
                      borderColor:
                        paginatedMatrix[performance][potential].color,
                    }"
                  >
                    <div class="mb-3">
                      <h3
                        class="font-bold text-sm"
                        :style="{
                          color: paginatedMatrix[performance][potential].color,
                        }"
                      >
                        {{ paginatedMatrix[performance][potential].title }}
                        <span class="text-gray-500 text-xs">
                          ({{
                            paginatedMatrix[performance][potential].participants
                              .length
                          }})
                        </span>
                      </h3>
                      <p class="text-xs text-gray-500 mt-1">
                        {{
                          paginatedMatrix[performance][potential].description
                        }}
                      </p>
                    </div>

                    <!-- Virtual Scrolling Participant List -->
                    <div class="relative h-[200px] overflow-auto">
                      <div
                        v-if="
                          paginatedMatrix[performance][potential].participants
                            .length
                        "
                        class="space-y-2"
                      >
                        <div
                          v-for="participant in paginatedMatrix[performance][
                            potential
                          ].participants"
                          :key="participant.id"
                          class="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                        >
                          <div class="flex flex-col">
                            <span class="text-sm font-medium">{{
                              participant.name
                            }}</span>
                            <span class="text-xs text-gray-500"
                              >{{ participant.id }} -
                              {{ participant.department }}</span
                            >
                          </div>
                          <span
                            class="text-sm font-medium"
                            :style="{
                              color:
                                paginatedMatrix[performance][potential].color,
                            }"
                          >
                            {{ participant.score }}%
                          </span>
                        </div>
                      </div>
                      <div
                        v-else
                        class="text-sm text-gray-400 text-center py-2"
                      >
                        No data
                      </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div
                      v-if="
                        paginatedMatrix[performance][potential].participants
                          .length
                      "
                      class="mt-4 flex justify-between items-center"
                    >
                      <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span class="text-sm text-gray-500">
                        Page {{ currentPage }} of {{ totalPages }}
                      </span>
                      <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </rs-tab-item>

        <rs-tab-item title="Assessment Details">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Assessment Criteria -->
              <rs-card>
                <div class="p-4">
                  <h3 class="font-semibold mb-4">Assessment Components</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span>Situation</span>
                      <span class="font-medium">20%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span>Workload</span>
                      <span class="font-medium">20%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span>Trigger</span>
                      <span class="font-medium">20%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span>Action</span>
                      <span class="font-medium">20%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span>Result</span>
                      <span class="font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </rs-card>

              <!-- Level Definitions -->
              <rs-card>
                <div class="p-4">
                  <h3 class="font-semibold mb-4">Competency Levels</h3>
                  <div class="space-y-3">
                    <div
                      v-for="(level, key) in competencyLevels"
                      :key="key"
                      class="flex items-center space-x-3"
                    >
                      <div
                        class="w-3 h-3 rounded-full"
                        :style="{ backgroundColor: level.color }"
                      ></div>
                      <span>{{ key }} ({{ level.min }}-{{ level.max }})</span>
                    </div>
                  </div>
                </div>
              </rs-card>
            </div>
          </div>
        </rs-tab-item>
      </rs-tab>
    </rs-card>
  </div>
</template>

<style scoped>
.performance-card {
  @apply transition-all duration-200 hover:shadow-md;
}

.performance-matrix {
  @apply border rounded-lg p-4 transition-all duration-200;
}

.performance-matrix:hover {
  @apply shadow-lg;
}

.matrix-cell {
  @apply border p-4 rounded-lg transition-all duration-200;
}

.matrix-cell:hover {
  @apply shadow-md;
}
</style>
