<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Organizations</h1>
          <p class="text-gray-500">Manage all organizations in the system</p>
        </div>
        <rs-button
          variant="primary"
          @click="router.push('/admin/organization/add')"
        >
          <Icon name="ph:plus" class="w-4 h-4 mr-1" />
          Add Organization
        </rs-button>
      </div>
    </div>

    <rs-card>
      <div class="p-6">
        <rs-table
          :field="[
            'Name',
            'Description',
            'Users',
            'Groups',
            'Status',
            'Action',
          ]"
          :data="organizations"
          :options="{ hover: true, striped: true }"
          :advanced="true"
        >
          <template #Name="{ value }">
            <span class="font-medium">{{ value.name }}</span>
          </template>

          <template #Description="{ value }">
            {{ value.description }}
          </template>

          <template #Users="{ value }">
            {{ value.totalUsers }}
          </template>

          <template #Groups="{ value }">
            {{ value.totalGroups }}
          </template>

          <template #Status="{ value }">
            <rs-badge
              :color="value.status === 'Active' ? 'green' : 'gray'"
              class="capitalize"
            >
              {{ value.status }}
            </rs-badge>
          </template>

          <template #Action="{ value }">
            <div class="flex space-x-2">
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="router.push(`/organization/${value.id}`)"
              >
                <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                Manage
              </rs-button>
              <rs-button
                variant="danger-outline"
                size="sm"
                @click="handleDeleteOrganization(value.id)"
              >
                <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                Delete
              </rs-button>
            </div>
          </template>
        </rs-table>
      </div>
    </rs-card>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Organization",
  middleware: ["auth"],
  breadcrumb: [{ name: "Organization", type: "current" }],
});

// Using the same organization structure from the organization page
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

const getOrganizations = async () => {
  const resp = await $fetch("/api/organization/list");
  console.log(resp);

  organizations.value = resp.data;
};

const handleDeleteOrganization = async (orgId) => {
  try {
    const result = await $swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Here you would make the API call to delete the organization
      console.log("Deleting organization:", orgId);

      await $swal.fire(
        "Deleted!",
        "The organization has been deleted.",
        "success"
      );

      // Remove from local state
      organizations.value = organizations.value.filter(
        (org) => org.id !== orgId
      );
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
    $swal.fire(
      "Error",
      "There was an error deleting the organization.",
      "error"
    );
  }
};

onMounted(async () => {
  await getOrganizations();
});
</script>

<style lang="scss" scoped></style>
