<script setup>
definePageMeta({
  title: "Formula Management",
  middleware: ["auth"],
  breadcrumb: [{ name: "Formula Management", path: "/formula" }],
});

const formulas = ref([
  {
    id: 1,
    name: "Competency Score",
    description: "Measures proficiency in specific skills",
    formula: "∑(Ratings) / Number of Assessors",
    category: "Basic Assessment",
  },
  {
    id: 2,
    name: "Competency Gap",
    description: "Identifies skill level gaps",
    formula: "Required Level - Current Level",
    category: "Gap Analysis",
  },
  {
    id: 3,
    name: "Competency Match",
    description: "Overall competency match percentage",
    formula: "∑(Current Skills) / ∑(Required Skills) × 100",
    category: "Performance",
  },
  // Add more formulas as needed
]);

const router = useRouter();
const selectFormula = (formula) => {
  router.push(`/formula/${formula.id}`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Formula Management</h1>
          <p class="text-gray-500">
            Manage and configure CBTM assessment formulas
          </p>
        </div>
        <rs-button variant="primary">
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          New Formula
        </rs-button>
      </div>
    </div>

    <rs-card>
      <div class="p-6">
        <rs-table
          :field="['Name', 'Description', 'Formula', 'Category', 'Action']"
          :data="formulas"
          :options="{ hover: true, striped: true }"
          :advanced="true"
        >
          <template #Name="{ value }">
            <span class="font-medium">{{ value.name }}</span>
          </template>

          <template #Description="{ value }">
            {{ value.description }}
          </template>

          <template #Formula="{ value }">
            <code class="bg-gray-100 px-2 py-1 rounded">{{ value.formula }}</code>
          </template>

          <template #Category="{ value }">
            <rs-badge>{{ value.category }}</rs-badge>
          </template>

          <template #Action="{ value }">
            <div class="flex space-x-2">
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="selectFormula(value)"
              >
                Edit
                <Icon name="ph:pencil" class="w-4 h-4 ml-1" />
              </rs-button>
              <rs-button variant="danger-outline" size="sm">
                Delete
                <Icon name="ph:trash" class="w-4 h-4 ml-1" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped></style> 