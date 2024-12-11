<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Manage Group Members",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: `/organization/1` },
    {
      name: "Manage Members",
      type: "current",
    },
  ],
});

// Dummy data for demonstration
const group = ref({
  id: route.params.groupId,
  name: "Engineering",
  description: "Development team",
  members: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Member" },
  ],
});

const availableUsers = ref([
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "Bob Wilson", email: "bob@example.com" },
]);

const searchQuery = ref("");

const filteredMembers = computed(() => {
  if (!searchQuery.value) return group.value.members;
  const query = searchQuery.value.toLowerCase();
  return group.value.members.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
  );
});

const handleRemoveMember = async (memberId) => {
  try {
    // Here you would typically make an API call to remove the member
    group.value.members = group.value.members.filter(
      (member) => member.id !== memberId
    );
  } catch (error) {
    console.error("Error removing member:", error);
  }
};

const selectedMembers = ref([]);
const showValidationError = ref(false);

const handleAddMembers = async () => {
  if (!selectedMembers.value.length) {
    showValidationError.value = true;
    return;
  }

  showValidationError.value = false;
  try {
    // Add the selected users to the current members list
    const newMembers = availableUsers.value
      .filter((user) => selectedMembers.value.includes(user.id))
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "Member", // Default role for bulk-added users
      }));

    // Update the members list
    group.value.members = [...group.value.members, ...newMembers];

    // Remove added users from available users list
    availableUsers.value = availableUsers.value.filter(
      (user) => !selectedMembers.value.includes(user.id)
    );

    // Reset selection
    selectedMembers.value = [];

    // Show success message
    useToast().success("Users successfully added to the group");
  } catch (error) {
    console.error("Error adding members:", error);
    useToast().error("Failed to add users to the group");
  }
};

// Add computed property to show/hide the add members form
const hasAvailableUsers = computed(() => availableUsers.value.length > 0);
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            Manage {{ group.name }} Members
          </h1>
          <p class="text-gray-500">Add or remove members from this group</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Current Members Section -->
      <rs-card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Current Members</h2>
        </div>
        <rs-table
          :field="['Name', 'Email', 'Role', 'Action']"
          :data="filteredMembers"
          :options="{ hover: true, striped: true }"
          advanced
        >
          <template #Name="{ value }">
            {{ value.name }}
          </template>

          <template #Email="{ value }">
            {{ value.email }}
          </template>

          <template #Role="{ value }">
            <rs-badge :color="value.role === 'Admin' ? 'blue' : 'gray'">
              {{ value.role }}
            </rs-badge>
          </template>

          <template #Action="{ value }">
            <rs-button
              variant="danger-outline"
              size="sm"
              @click="handleRemoveMember(value.id)"
            >
              <Icon name="ph:user-minus" class="w-4 h-4" />
            </rs-button>
          </template>
        </rs-table>
      </rs-card>

      <!-- Add Members Section -->
      <rs-card class="p-4" v-if="hasAvailableUsers">
        <h2 class="text-lg font-semibold mb-4">Add Members</h2>
        <div class="space-y-4">
          <v-select
            v-model="selectedMembers"
            :options="availableUsers"
            multiple
            label="name"
            :reduce="(user) => user.id"
            placeholder="Select users to add"
          />

          <div class="text-red-500 text-sm" v-if="showValidationError">
            Please select at least one user
          </div>

          <div class="flex justify-end gap-2">
            <rs-button
              variant="secondary"
              type="button"
              @click="router.push(`/organization/${route.params.id}`)"
            >
              <Icon name="ph:x" class="w-4 h-4 mr-1" />
              Cancel
            </rs-button>
            <rs-button
              variant="success"
              type="button"
              @click="handleAddMembers"
              :disabled="!selectedMembers.length"
            >
              <Icon name="ph:user-plus" class="w-4 h-4 mr-1" />
              Add Selected Members
              <span v-if="selectedMembers.length" class="ml-1">
                ({{ selectedMembers.length }})
              </span>
            </rs-button>
          </div>
        </div>
      </rs-card>

      <!-- No Available Users Message -->
      <rs-card class="p-4" v-else>
        <div class="text-center text-gray-500">
          <Icon name="ph:users" class="w-8 h-8 mx-auto mb-2" />
          <p>All available users have been added to this group.</p>
        </div>
      </rs-card>
    </div>
  </div>
</template>
