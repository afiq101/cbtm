<script setup>
definePageMeta({
  title: "Organizations",
  middleware: ["auth"],
  breadcrumb: [{ name: "Organizations", path: "/organization" }],
});

const organizations = ref([
  {
    id: 1,
    name: "Tech Corp",
    description: "Technology Solutions Company",
    totalUsers: 150,
    totalGroups: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "Marketing Pro",
    description: "Digital Marketing Agency",
    totalUsers: 75,
    totalGroups: 5,
    status: "Active",
  },
]);

const searchQuery = ref("");

const filteredOrganizations = computed(() => {
  if (!searchQuery.value) return organizations.value;
  const query = searchQuery.value.toLowerCase();
  return organizations.value.filter(
    (org) =>
      org.name.toLowerCase().includes(query) ||
      org.description.toLowerCase().includes(query)
  );
});

const router = useRouter();

const navigateToOrgDetails = (orgId) => {
  router.push(`/organization/${orgId}`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Organizations</h1>
          <p class="text-gray-500">Manage your organizations and their users</p>
        </div>
        <rs-button variant="primary" @click="router.push('/organization/add')">
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          Add Organization
        </rs-button>
      </div>
    </div>

    <rs-card class="mb-6">
      <!-- Search using FormKit -->
      <div class="p-4 border-b">
        <FormKit
          type="text"
          name="search"
          placeholder="Search organizations..."
          suffix-icon="search"
          v-model="searchQuery"
          :classes="{
            outer: 'mb-0',
          }"
        />
      </div>

      <!-- Organizations List -->
      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="org in filteredOrganizations"
            :key="org.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToOrgDetails(org.id)"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">{{ org.name }}</h3>
              <rs-badge :color="org.status === 'Active' ? 'green' : 'gray'">
                {{ org.status }}
              </rs-badge>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ org.description }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ org.totalUsers }} Users</span>
              <span>{{ org.totalGroups }} Groups</span>
            </div>
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>
