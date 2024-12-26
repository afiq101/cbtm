<script setup>
const route = useRoute();
const router = useRouter();

const { $swal } = useNuxtApp();

definePageMeta({
  title: "Add Group",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Organization", path: `/organization/1` },
    { name: "Add Group", type: "current" },
  ],
});

const name = ref("");
const description = ref("");

const handleAddGroup = async () => {
  try {
    // Here you would typically make an API call to add the group
    console.log("Adding group:", name.value, description.value);

    const resp = await $fetch("/api/group/add", {
      method: "POST",
      initialCache: false,
      body: JSON.stringify({
        name: name.value,
        description: description.value,
      }),
    });

    console.log(resp);

    // Navigate back to organization details
    // router.push(`/organization/${route.params.id}`);

    if (resp.statusCode === 200) {
      router.push(`/organization/${route.params.id}`);
    } else {
      $swal.fire({
        position: "center",
        title: "Error",
        text: resp.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error("Error adding group:", error);
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Group</h1>
          <p class="text-gray-500">Add a new group to the organization</p>
        </div>
      </div>
    </div>
    <rs-card class="p-4">
      <FormKit
        type="form"
        :config="{ validationVisibility: 'live' }"
        :actions="false"
        @submit.prevent="handleAddGroup()"
      >
        <FormKit
          type="text"
          name="name"
          label="Group Name"
          validation="required|length:3"
          v-model="name"
          :validation-messages="{
            required: 'Group name is required',
            length: 'Name must be at least 3 characters',
          }"
        />

        <FormKit
          type="textarea"
          name="description"
          label="Description"
          validation="required|length:10"
          v-model="description"
          :validation-messages="{
            required: 'Description is required',
            length: 'Description must be at least 10 characters',
          }"
        />

        <div class="flex justify-end gap-2 mt-4">
          <rs-button
            variant="secondary"
            type="button"
            @click.prevent="router.push(`/organization/${route.params.id}`)"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button
            variant="success"
            @click="handleAddGroup()"
            :disabled="!name || !description"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Create Group
          </rs-button>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>
