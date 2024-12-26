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
        :field="tableHeaders"
        :data="superusers"
        :basic="false"
        :advanced="true"
        :options="{
          variant: 'default',
          striped: true,
          hover: true,
        }"
        :optionsAdvanced="{
          sortable: true,
          filterable: true,
          responsive: true,
        }"
        :pageSize="10"
      >
        <!-- Custom slot for actions column -->
        <template #actions="{ value }">
          <div class="flex justify-end space-x-2">
            <rs-button
              variant="texts-primary"
              size="sm"
              @click="editUser(value.id)"
            >
              Edit
            </rs-button>
            <rs-button
              variant="texts-danger"
              size="sm"
              @click="deleteUser(value.id)"
            >
              Delete
            </rs-button>
          </div>
        </template>

        <!-- Custom slot for date formatting -->
        <template #created_at="{ text }">
          {{ formatDate(text) }}
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
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'created_at', label: 'Created At' },
  { key: 'actions', label: 'Actions' },
];

// Fetch superusers on component mount
onMounted(async () => {
  try {
    const response = await fetch('/api/superusers');
    superusers.value = await response.json();
  } catch (error) {
    console.error('Error fetching superusers:', error);
  }
});

const navigateToCreate = () => {
  router.push('/admin/superuser/add');
};

const editUser = (userId) => {
  router.push(`/admin/superuser/${userId}/edit`);
};

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this superuser?')) return;
  
  try {
    await fetch(`/api/superusers/${userId}`, {
      method: 'DELETE',
    });
    superusers.value = superusers.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error('Error deleting superuser:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>
