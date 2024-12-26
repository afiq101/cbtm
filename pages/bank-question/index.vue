<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Question Bank</h1>
          <p class="text-gray-500">Manage your assessment questions</p>
        </div>
        <rs-button variant="primary" @click="addQuestion">
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          Add Question
        </rs-button>
      </div>
    </div>

    <rs-card>
      <!-- Search and Filter Section -->
      <div class="p-4 border-b">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="text"
            name="search"
            placeholder="Search questions..."
            suffix-icon="search"
            v-model="searchQuery"
            :classes="{
              outer: 'mb-0',
            }"
          />
          <FormKit
            type="select"
            name="type"
            placeholder="Filter by type"
            :options="questionTypes"
            v-model="selectedType"
            :classes="{
              outer: 'mb-0',
            }"
          />
        </div>
      </div>

      <!-- Questions Table -->
      <rs-table
        :field="['Question', 'Type', 'Category', 'Created', 'Status', 'Action']"
        :data="filteredQuestions"
        :options="{ hover: true, striped: true }"
        :advanced="true"
      >
        <template #Question="{ value }">
          <div class="max-w-md">
            <span class="font-medium">{{ value.text }}</span>
          </div>
        </template>

        <template #Type="{ value }">
          <span class="capitalize">{{ value.type }}</span>
        </template>

        <template #Category="{ value }">
          <span>{{ value.category }}</span>
        </template>

        <template #Created="{ value }">
          <span>{{ value.createdAt }}</span>
        </template>

        <template #Status="{ value }">
          <rs-badge :color="value.status === 'active' ? 'green' : 'gray'">
            {{ value.status }}
          </rs-badge>
        </template>

        <template #Action="{ value }">
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="editQuestion(value.id)"
            >
              <Icon name="ph:pencil" class="w-4 h-4" />
            </rs-button>
            <rs-button
              variant="danger-outline"
              size="sm"
              @click="deleteQuestion(value.id)"
            >
              <Icon name="ph:trash" class="w-4 h-4" />
            </rs-button>
          </div>
        </template>
      </rs-table>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Question Bank",
  middleware: ["auth"],
  breadcrumb: [{ name: "Question Bank", path: "/" }],
});

const router = useRouter();

// Sample questions data - would be replaced with API call
const questions = ref([
  {
    id: 1,
    text: "How effectively does the person communicate with team members?",
    type: "rating",
    category: "Communication",
    createdAt: "2024-03-15",
    status: "active",
  },
  {
    id: 2,
    text: "Describe a situation where you demonstrated leadership skills.",
    type: "text",
    category: "Leadership",
    createdAt: "2024-03-14",
    status: "active",
  },
  {
    id: 3,
    text: "How well does the individual manage their time?",
    type: "rating",
    category: "Time Management",
    createdAt: "2024-03-13",
    status: "active",
  },
]);

// Question types for filtering
const questionTypes = [
  { value: "rating", label: "Rating Scale" },
  { value: "text", label: "Text Response" },
  { value: "choice", label: "Multiple Choice" },
  { value: "boolean", label: "Yes/No" },
];

// Search and filter state
const searchQuery = ref("");
const selectedType = ref("");

// Computed filtered questions
const filteredQuestions = computed(() => {
  return questions.value.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesType = !selectedType.value || question.type === selectedType.value;
    return matchesSearch && matchesType;
  });
});

// Add new question
const addQuestion = () => {
  router.push("/bank-question/add");
};

// Edit question
const editQuestion = (id) => {
  router.push(`/bank-question/${id}/edit`);
};

// Delete question
const deleteQuestion = async (id) => {
  const confirmed = await confirm(
    "Are you sure you want to delete this question?"
  );
  if (confirmed) {
    // API call would go here
    questions.value = questions.value.filter((q) => q.id !== id);
  }
};
</script>

<style lang="scss" scoped></style>
