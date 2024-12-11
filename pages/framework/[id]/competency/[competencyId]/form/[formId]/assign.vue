<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Assign Users to Form",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", path: `/framework/1` },
    { name: "Assign Users", type: "current" },
  ],
});

// Dummy data for demonstration
const form = ref({
  id: route.params.formId,
  name: "Self Assessment",
  type: "self",
  assignedUsers: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      group: "Engineering",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      group: "Marketing",
    },
  ],
});

// Available groups data
const groups = ref([
  { id: 1, name: "Engineering", description: "Development team", members: 12 },
  { id: 2, name: "Marketing", description: "Marketing team", members: 8 },
]);

// Available individual users
const availableUsers = ref([
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    group: "Engineering",
  },
  { id: 4, name: "Bob Wilson", email: "bob@example.com", group: "Marketing" },
]);

const searchQuery = ref("");
const selectedUsers = ref([]);
const selectedGroups = ref([]);
const assignmentType = ref("individual"); // or "group"

const filteredAssignedUsers = computed(() => {
  if (!searchQuery.value) return form.value.assignedUsers;
  const query = searchQuery.value.toLowerCase();
  return form.value.assignedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.group.toLowerCase().includes(query)
  );
});

const handleRemoveUser = async (userId) => {
  try {
    form.value.assignedUsers = form.value.assignedUsers.filter(
      (user) => user.id !== userId
    );
    useToast().success("User removed successfully");
  } catch (error) {
    console.error("Error removing user:", error);
    useToast().error("Failed to remove user");
  }
};

const handleAssign = async () => {
  try {
    if (assignmentType.value === "individual" && !selectedUsers.value.length) {
      useToast().error("Please select at least one user");
      return;
    }

    if (assignmentType.value === "group" && !selectedGroups.value.length) {
      useToast().error("Please select at least one group");
      return;
    }

    // Here you would make an API call to assign users/groups
    if (assignmentType.value === "individual") {
      const newUsers = availableUsers.value
        .filter((user) => selectedUsers.value.includes(user.id))
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          group: user.group,
        }));

      form.value.assignedUsers = [...form.value.assignedUsers, ...newUsers];
    } else {
      // Simulate adding all users from selected groups
      // In real implementation, this would come from the API
      const groupUsers = [
        {
          id: 5,
          name: "Group User 1",
          email: "user1@example.com",
          group: "Engineering",
        },
        {
          id: 6,
          name: "Group User 2",
          email: "user2@example.com",
          group: "Marketing",
        },
      ];
      form.value.assignedUsers = [...form.value.assignedUsers, ...groupUsers];
    }

    // Reset selections
    selectedUsers.value = [];
    selectedGroups.value = [];

    useToast().success("Users assigned successfully");
  } catch (error) {
    console.error("Error assigning users:", error);
    useToast().error("Failed to assign users");
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            Assign Users to {{ form.name }}
          </h1>
          <p class="text-gray-500">Manage user assignments for this form</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Current Assignments -->
      <rs-card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Current Assignments</h2>
          <FormKit
            type="text"
            v-model="searchQuery"
            placeholder="Search users..."
            :classes="{
              outer: 'mb-0',
              input: 'h-9',
            }"
          />
        </div>

        <rs-table
          :field="['Name', 'Email', 'Group', 'Action']"
          :data="filteredAssignedUsers"
          :options="{ hover: true, striped: true }"
          advanced
        >
          <template #Name="{ value }">{{ value.name }}</template>
          <template #Email="{ value }">{{ value.email }}</template>
          <template #Group="{ value }">
            <rs-badge color="blue">{{ value.group }}</rs-badge>
          </template>
          <template #Action="{ value }">
            <rs-button
              variant="danger-outline"
              size="sm"
              @click="handleRemoveUser(value.id)"
            >
              <Icon name="ph:user-minus" class="w-4 h-4" />
            </rs-button>
          </template>
        </rs-table>
      </rs-card>

      <!-- Assignment Options -->
      <rs-card class="p-4">
        <h2 class="text-lg font-semibold mb-4">Add Assignments</h2>

        <!-- Assignment Type Toggle -->
        <div class="mb-4">
          <FormKit
            type="radio"
            label="Assign by"
            v-model="assignmentType"
            :options="[
              { label: 'Individual Users', value: 'individual' },
              { label: 'Groups', value: 'group' },
            ]"
          />
        </div>

        <!-- Individual Users Selection -->
        <div v-if="assignmentType === 'individual'" class="space-y-4">
          <v-select
            v-model="selectedUsers"
            :options="availableUsers"
            multiple
            label="name"
            :reduce="(user) => user.id"
            placeholder="Select users to assign"
          />
        </div>

        <!-- Group Selection -->
        <div v-else class="space-y-4">
          <v-select
            v-model="selectedGroups"
            :options="groups"
            multiple
            label="name"
            :reduce="(group) => group.id"
            placeholder="Select groups to assign"
          />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <rs-button
            variant="secondary"
            type="button"
            @click="router.push(`/framework/${route.params.id}`)"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button variant="success" type="button" @click="handleAssign">
            <Icon name="ph:user-plus" class="w-4 h-4 mr-1" />
            Assign
            <span
              v-if="assignmentType === 'individual' && selectedUsers.length"
              class="ml-1"
            >
              ({{ selectedUsers.length }} users)
            </span>
            <span
              v-if="assignmentType === 'group' && selectedGroups.length"
              class="ml-1"
            >
              ({{ selectedGroups.length }} groups)
            </span>
          </rs-button>
        </div>
      </rs-card>
    </div>
  </div>
</template>
