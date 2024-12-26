<script setup>
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const { $swal } = useNuxtApp();

const userStore = useUserStore();

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
});

const users = ref([]);
const groups = ref([]);

const activeTab = ref("users");
const searchQuery = ref("");

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
});

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups.value;
  const query = searchQuery.value.toLowerCase();
  return groups.value.filter(
    (group) =>
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query)
  );
});

const handleDeleteUser = async (userId) => {
  try {
    const resp = await $fetch("/api/user/delete", {
      method: "POST",
      body: {
        userId: userId,
      },
    });

    console.log("RESP", resp);

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: resp.message,
        icon: "success",
      });

      getUsers();
    } else {
      $swal.fire({
        title: "Error",
        text: resp.message,
        icon: "error",
      });
    }
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

const getUsers = async () => {
  const resp = await $fetch("/api/user/list");

  console.log("Fetched Users:", resp);

  if (resp.statusCode === 200) {
    users.value = resp.data;
  }
};

const getGroups = async () => {
  const resp = await $fetch("/api/group/list");

  if (resp.statusCode === 200) {
    groups.value = resp.data;
  }

  console.log("Fetched Groups:", groups.value);
};

const handleDeleteGroup = async (groupId) => {
  console.log("GROUP ID", groupId);

  const resp = await $fetch(`/api/group/delete`, {
    method: "POST",
    body: {
      groupId: groupId,
    },
  });

  if (resp.statusCode === 200) {
    $swal.fire({
      title: "Success",
      text: resp.message,
      icon: "success",
    });

    getGroups();
  } else {
    $swal.fire({
      title: "Error",
      text: resp.message,
      icon: "error",
    });
  }
};

// Modify the data fetching functions
const getOrganizationData = async () => {
  try {
    const id = route.params.id;
    organization.value.id = id;
    // Fetch real organization data here
    loading.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([getOrganizationData(), getUsers(), getGroups()]);
  } catch (err) {
  } finally {
  }
});
</script>

<template>
  <div>
    <Breadcrumb />

    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            {{ userStore.organization.name }}
          </h1>
          <p class="text-gray-500">
            {{ userStore.organization.email }}
          </p>
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
              :field="['Name', 'Email', 'Role', 'Action']"
              :data="filteredUsers"
              :options="{ hover: true, striped: true }"
              advanced
            >
              <template #Name="{ value }">
                <span class="capitalize">{{ value.user_username }}</span>
              </template>

              <template #Email="{ value }">
                {{ value.user_email || "-" }}
              </template>

              <template #Role="{ value }">
                <rs-badge
                  :color="value.role.role_name === 'manager' ? 'blue' : 'gray'"
                  class="capitalize"
                >
                  {{ value.role.role_name }}
                </rs-badge>
              </template>

              <template #Action="{ value }">
                <rs-button
                  variant="danger-outline"
                  size="sm"
                  @click="handleDeleteUser(value.user_id)"
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

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                <div class="flex justify-end mt-4 gap-2">
                  <rs-button
                    variant="danger-outline"
                    size="sm"
                    @click="handleDeleteGroup(group.id)"
                  >
                    <Icon name="ph:trash" class="w-4 h-4" />
                  </rs-button>
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click="
                      navigateTo(
                        `/organization/${route.params.id}/group/${group.id}/manage`
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
