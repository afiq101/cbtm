<script setup>
const route = useRoute();
const router = useRouter();

const { $swal } = useNuxtApp();

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
const group = ref(null);

const availableUsers = ref([]);

const searchQuery = ref("");

const filteredMembers = computed(() => {
  if (!searchQuery.value) return group.value?.members || [];
  const query = searchQuery.value.toLowerCase();
  return group.value.members.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
  );
});

const handleRemoveMember = async (memberId) => {
  try {
    const resp = await $fetch(`/api/group/remove-member`, {
      method: "POST",
      body: {
        groupId: route.params.groupId,
        member: memberId,
      },
    });

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: resp.message,
        icon: "success",
      });
      getGroupDetail();
    } else {
      $swal.fire({
        title: "Error",
        text: resp.message,
        icon: "error",
      });
    }
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
    const resp = await $fetch(`/api/group/add-member`, {
      method: "POST",
      body: {
        groupId: route.params.groupId,
        members: selectedMembers.value,
      },
    });

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: resp.message,
        icon: "success",
      });
      getGroupDetail();
    } else {
      $swal.fire({
        title: "Error",
        text: resp.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error adding members:", error);
    useToast().error("Failed to add users to the group");
  }
};

const getGroupDetail = async () => {
  const resp = await $fetch(`/api/group/detail`, {
    params: {
      groupId: route.params.groupId,
    },
  });
  group.value = resp.data;

  console.log("Group Detail:", group.value);
};

const getUsers = async () => {
  const resp = await $fetch(`/api/group/get-users`);
  console.log("Response Users:", resp);

  availableUsers.value = resp.data;
};

onMounted(() => {
  getGroupDetail();
  getUsers();
});
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            Manage {{ group?.group.group_name || "Group" }} Members
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
            <span class="capitalize">{{ value.user_username }}</span>
          </template>

          <template #Email="{ value }">
            {{ value.user_email || "-" }}
          </template>

          <template #Role="{ value }">
            <rs-badge
              :color="value.user_role === 'manager' ? 'blue' : 'gray'"
              class="capitalize"
            >
              {{ value.user_role }}
            </rs-badge>
          </template>

          <template #Action="{ value }">
            <rs-button
              variant="danger-outline"
              size="sm"
              @click="handleRemoveMember(value.user_id)"
            >
              <Icon name="ph:user-minus" class="w-4 h-4" />
            </rs-button>
          </template>
        </rs-table>
      </rs-card>

      <!-- Add Members Section -->
      <rs-card class="p-4" v-if="availableUsers.length > 0">
        <h2 class="text-lg font-semibold mb-4">Add Members</h2>
        <div class="space-y-4">
          <v-select
            v-model="selectedMembers"
            :options="
              availableUsers.map((user) => ({
                value: user.user_id,
                label: user.user_username,
              }))
            "
            multiple
            label="label"
            :reduce="(option) => option.value"
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
          <p>Did not found any users.</p>
        </div>
      </rs-card>
    </div>
  </div>
</template>
