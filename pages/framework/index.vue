<script setup>
definePageMeta({
  title: "Assessment Frameworks",
  middleware: ["auth"],
  breadcrumb: [{ name: "Frameworks", path: "/framework" }],
});

const router = useRouter();

// Mock data - would be fetched from API
const frameworks = ref([
  {
    id: 1,
    name: "Technical Assessment",
    description: "Framework for evaluating technical skills",
    type: "Technical",
    status: "active",
    lastUpdated: "2024-03-15",
    competencyCount: 5,
    formCount: 12,
  },
  {
    id: 2,
    name: "Leadership Assessment",
    description: "Framework for evaluating leadership capabilities",
    type: "Leadership",
    status: "draft",
    lastUpdated: "2024-03-14",
    competencyCount: 3,
    formCount: 6,
  },
]);

// Navigate to framework details
const viewFramework = (id) => {
  router.push(`/framework/${id}`);
};

// Navigate to add framework page
const addFramework = () => {
  router.push("/framework/add");
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Assessment Frameworks</h1>
          <p class="text-gray-500">Manage your assessment frameworks</p>
        </div>
        <rs-button variant="primary" @click="addFramework">
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          Add Framework
        </rs-button>
      </div>
    </div>

    <rs-card class="p-6">
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="framework in frameworks"
          :key="framework.id"
          class="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
          @click="viewFramework(framework.id)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg">{{ framework.name }}</h3>
              <p class="text-gray-500">{{ framework.description }}</p>
              <div class="flex gap-4 mt-2 text-sm text-gray-600">
                <span>{{ framework.competencyCount }} Competencies</span>
                <span>{{ framework.formCount }} Forms</span>
                <span>Last updated: {{ framework.lastUpdated }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <rs-badge
                :color="framework.status === 'active' ? 'green' : 'yellow'"
                class="capitalize"
              >
                {{ framework.status }}
              </rs-badge>
              <rs-badge color="blue" class="capitalize">
                {{ framework.type }}
              </rs-badge>
            </div>
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>
