<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Superuser</h1>
          <p class="text-gray-500">Create a new superuser account</p>
        </div>
      </div>
    </div>

    <rs-card class="p-4">
      <FormKit
        type="form"
        :config="{ validationVisibility: 'live' }"
        :actions="false"
        @submit="handleAddSuperuser"
      >
        <FormKit
          type="text"
          name="name"
          label="Username"
          validation="required|length:3"
          :validation-messages="{
            required: 'Username is required',
            length: 'Username must be at least 3 characters',
          }"
          v-model="name"
        />

        <FormKit
          type="email"
          name="email"
          label="Email"
          validation="required|email"
          :validation-messages="{
            required: 'Email is required',
            email: 'Please enter a valid email',
          }"
          v-model="email"
        />

        <FormKit
          :type="togglePasswordVisibility ? 'text' : 'password'"
          name="password"
          label="Password"
          validation="required|length:8"
          :validation-messages="{
            required: 'Password is required',
            length: 'Password must be at least 8 characters',
          }"
          v-model="password"
        >
          <template #suffix>
            <div
              class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
              @click="togglePasswordVisibility = !togglePasswordVisibility"
            >
              <Icon
                :name="togglePasswordVisibility ? 'ion:eye-off-outline' : 'ion:eye-outline'"
                class="w-5 h-5"
              />
            </div>
          </template>
        </FormKit>

        <FormKit
          :type="toggleConfirmPasswordVisibility ? 'text' : 'password'"
          name="confirmPassword"
          label="Confirm Password"
          validation="required|confirm"
          :validation-messages="{
            required: 'Please confirm your password',
            confirm: 'Passwords do not match',
          }"
          v-model="confirmPassword"
        >
          <template #suffix>
            <div
              class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
              @click="toggleConfirmPasswordVisibility = !toggleConfirmPasswordVisibility"
            >
              <Icon
                :name="toggleConfirmPasswordVisibility ? 'ion:eye-off-outline' : 'ion:eye-outline'"
                class="w-5 h-5"
              />
            </div>
          </template>
        </FormKit>

        <div class="flex justify-end gap-2 mt-4">
          <rs-button
            variant="secondary"
            type="button"
            @click="router.push('/admin/superuser')"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-1" />
            Cancel
          </rs-button>
          <rs-button
            variant="success"
            type="submit"
            :disabled="!name || !email || !password || !confirmPassword"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Add Superuser
          </rs-button>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>

<script setup>
const router = useRouter();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Add Superuser",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Superuser", path: "/admin/superuser" },
    { name: "Add", type: "current" },
  ],
});

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const togglePasswordVisibility = ref(false);
const toggleConfirmPasswordVisibility = ref(false);

const handleAddSuperuser = async () => {
  try {
    const resp = await $fetch("/api/superuser/add", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    if (resp.statusCode === 200) {
      $swal.fire({
        title: "Superuser added successfully",
        icon: "success",
        timer: 2000,
      });

      router.push("/admin/superuser");
    } else {
      $swal.fire({
        title: "Error adding superuser",
        text: resp.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error adding superuser:", error);
  }
};
</script>

<style lang="scss" scoped></style>
