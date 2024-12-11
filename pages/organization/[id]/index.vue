<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Organization Details",
  middleware: ["auth"],
  breadcrumb: [{ name: "Organization", type: "current" }],
});

// Simplified organization data
const organization = ref({
  id: route.params.id,
  name: "Tech Corp",
  description: "Technology Solutions Company",
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@techcorp.com",
      role: "Admin",
      group: "Engineering",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@techcorp.com",
      role: "User",
      group: "Marketing",
    },
  ],
  groups: [
    {
      id: 1,
      name: "Engineering",
      description: "Development team",
      members: 12,
    },
    {
      id: 2,
      name: "Marketing",
      description: "Marketing team",
      members: 8,
    },
  ],
});

const activeTab = ref("users");
const searchQuery = ref("");

const filteredUsers = computed(() => {
  if (!searchQuery.value) return organization.value.users;
  const query = searchQuery.value.toLowerCase();
  return organization.value.users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.group.toLowerCase().includes(query)
  );
});

const filteredGroups = computed(() => {
  if (!searchQuery.value) return organization.value.groups;
  const query = searchQuery.value.toLowerCase();
  return organization.value.groups.filter(
    (group) =>
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query)
  );
});

const handleDeleteUser = async (userId) => {
  try {
    // Here you would typically make an API call to delete the user
    organization.value.users = organization.value.users.filter(
      (user) => user.id !== userId
    );
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Add navigation methods for forms
const navigateToAddUser = () => {
  router.push(`/organization/${route.params.id}/user/add`);
};

const navigateToAddGroup = () => {
  router.push(`/organization/${route.params.id}/group/add`);
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            {{ organization.name }}
          </h1>
          <p class="text-gray-500">{{ organization.description }}</p>
        </div>
      </div>
    </div>

    <rs-card>
      <rs-tab v-model="activeTab">
        <rs-tab-item title="Users" value="users">
          <div>
            <div class="flex justify-end items-center mb-4">
              <rs-button variant="primary" @click="navigateToAddUser">
                <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                Add User
              </rs-button>
            </div>
            <rs-table
              :field="['Name', 'Email', 'Role', 'Group', 'Action']"
              :data="filteredUsers"
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

              <template #Group="{ value }">
                {{ value.group }}
              </template>

              <template #Action="{ value }">
                <rs-button
                  variant="danger-outline"
                  size="sm"
                  @click="handleDeleteUser(value.id)"
                >
                  <Icon name="ph:trash" class="w-4 h-4" />
                </rs-button>
              </template>
            </rs-table>
          </div>
        </rs-tab-item>

        <rs-tab-item title="Groups" value="groups">
          <div class="py-2">
            <div class="flex justify-between items-center mb-4">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Search groups..."
              />
              <rs-button variant="primary" @click="navigateToAddGroup">
                <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                Add Group
              </rs-button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="group in filteredGroups"
                :key="group.id"
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-semibold">{{ group.name }}</h3>
                  <rs-badge color="blue">{{ group.members }} members</rs-badge>
                </div>
                <p class="text-sm text-gray-600">{{ group.description }}</p>
                <div class="flex justify-end mt-4">
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click="
                      navigateTo(
                        `/organization/${route.params.id}/group/1/manage`
                      )
                    "
                  >
                    Manage Members
                  </rs-button>
                </div>
              </div>
            </div>
          </div>
        </rs-tab-item>
      </rs-tab>
    </rs-card>
  </div>
</template>
