<template>
  <div class="p-6">
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Superusers</h1>
      <rs-button variant="primary" @click="navigateToCreate">
        Add Superuser
      </rs-button>
    </div>

    <!-- Table using RsTable component -->
    <rs-card>
      <rs-table
        :field="['Name', 'Email', 'Organization', 'Status', 'Action']"
        :data="superusers"
        :options="{ hover: true, striped: true }"
        :advanced="true"
      >
        <template #Name="{ value }">
          <span class="font-medium">{{ value.user_username }}</span>
        </template>

        <template #Email="{ value }">
          {{ value.user_email }}
        </template>

        <template #Organization="{ value }">
          {{ value.organization }}
        </template>

        <template #Status="{ value }">
          <rs-badge
            :color="value.status === 1 ? 'green' : 'gray'"
            class="capitalize"
          >
            {{ value.status === 1 ? "Active" : "Inactive" }}
          </rs-badge>
        </template>

        <template #Action="{ value }">
          <div class="flex space-x-2">
            <!-- <rs-button
                variant="primary-outline"
                size="sm"
                @click="router.push(`/organization/${value.id}`)"
              >
                <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                Manage
              </rs-button> -->
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
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Organization",
  middleware: ["auth"],
  breadcrumb: [{ name: "Superuser", type: "current" }],
});

const router = useRouter();
const superusers = ref([]);

const tableHeaders = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "created_at", label: "Created At" },
  { key: "actions", label: "Actions" },
];

// Fetch superusers on component mount
onMounted(async () => {
  await getSuperusers();
});

const getSuperusers = async () => {
  const response = await $fetch("/api/superuser/list");

  console.log(response);
  superusers.value = response.data;
};

const navigateToCreate = () => {
  router.push("/admin/superuser/add");
};

const editUser = (userId) => {
  router.push(`/admin/superuser/${userId}/edit`);
};

const deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to delete this superuser?")) return;

  try {
    await fetch(`/api/superusers/${userId}`, {
      method: "DELETE",
    });
    superusers.value = superusers.value.filter((user) => user.id !== userId);
  } catch (error) {
    console.error("Error deleting superuser:", error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>
