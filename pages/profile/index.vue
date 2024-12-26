<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Employee Profile</h1>
          <p class="text-gray-500">
            View and manage your corporate profile information
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information Card -->
        <rs-card class="p-6">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b">
            <img
              class="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
              :src="`https://ui-avatars.com/api/?name=${userStore.username}&background=random`"
            />
            <div>
              <h2 class="text-xl font-semibold">{{ formData.displayName }}</h2>
              <p class="text-gray-500">{{ formData.jobTitle }}</p>
              <p class="text-sm text-gray-400">
                Employee ID: {{ formData.employeeId }}
              </p>
            </div>
          </div>

          <FormKit
            type="form"
            :actions="false"
            @submit="handleUpdateProfile"
            :config="{ validationVisibility: 'live' }"
          >
            <div class="space-y-6">
              <!-- Employee Information -->
              <h3 class="font-semibold text-lg border-b pb-2">
                Employee Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="firstName"
                  label="First Name"
                  validation="required"
                  v-model="formData.firstName"
                />
                <FormKit
                  type="text"
                  name="lastName"
                  label="Last Name"
                  validation="required"
                  v-model="formData.lastName"
                />
                <FormKit
                  type="text"
                  name="employeeId"
                  label="Employee ID"
                  :disabled="true"
                  v-model="formData.employeeId"
                />
                <FormKit
                  type="text"
                  name="payrollId"
                  label="Payroll ID"
                  :disabled="true"
                  v-model="formData.payrollId"
                />
              </div>

              <!-- Position Details -->
              <h3 class="font-semibold text-lg border-b pb-2 pt-4">
                Position Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="jobTitle"
                  label="Job Title"
                  :disabled="true"
                  v-model="formData.jobTitle"
                />
                <FormKit
                  type="text"
                  name="department"
                  label="Department"
                  :disabled="true"
                  v-model="formData.department"
                />
                <FormKit
                  type="text"
                  name="division"
                  label="Division"
                  :disabled="true"
                  v-model="formData.division"
                />
                <FormKit
                  type="text"
                  name="reportingManager"
                  label="Reporting Manager"
                  :disabled="true"
                  v-model="formData.reportingManager"
                />
                <FormKit
                  type="text"
                  name="employmentType"
                  label="Employment Type"
                  :disabled="true"
                  v-model="formData.employmentType"
                />
                <FormKit
                  type="date"
                  name="dateJoined"
                  label="Date Joined"
                  :disabled="true"
                  v-model="formData.dateJoined"
                />
              </div>

              <!-- Contact Information -->
              <h3 class="font-semibold text-lg border-b pb-2 pt-4">
                Contact Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="email"
                  name="email"
                  label="Corporate Email"
                  :disabled="true"
                  v-model="formData.email"
                />
                <FormKit
                  type="tel"
                  name="workPhone"
                  label="Work Phone"
                  :disabled="true"
                  v-model="formData.workPhone"
                />
                <FormKit
                  type="text"
                  name="extension"
                  label="Extension"
                  :disabled="true"
                  v-model="formData.extension"
                />
                <FormKit
                  type="text"
                  name="officeLocation"
                  label="Office Location"
                  :disabled="true"
                  v-model="formData.officeLocation"
                />
              </div>

              <!-- Emergency Contact -->
              <h3 class="font-semibold text-lg border-b pb-2 pt-4">
                Emergency Contact
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="emergencyContactName"
                  label="Contact Name"
                  validation="required"
                  v-model="formData.emergencyContact.name"
                />
                <FormKit
                  type="text"
                  name="emergencyContactRelationship"
                  label="Relationship"
                  validation="required"
                  v-model="formData.emergencyContact.relationship"
                />
                <FormKit
                  type="tel"
                  name="emergencyContactPhone"
                  label="Contact Phone"
                  validation="required"
                  v-model="formData.emergencyContact.phone"
                />
              </div>

              <!-- System Preferences -->
              <h3 class="font-semibold text-lg border-b pb-2 pt-4">
                System Preferences
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="timeZone"
                  label="Time Zone"
                  :options="timeZoneOptions"
                  v-model="formData.timeZone"
                />
                <FormKit
                  type="select"
                  name="language"
                  label="Preferred Language"
                  :options="languageOptions"
                  v-model="formData.language"
                />
              </div>

              <div class="flex justify-end gap-2 mt-6">
                <rs-button variant="success" type="submit">
                  <Icon name="ph:check" class="w-4 h-4 mr-1" />
                  Save Changes
                </rs-button>
              </div>
            </div>
          </FormKit>
        </rs-card>

        <!-- Account Security Card -->
        <rs-card class="p-6">
          <h3 class="font-semibold text-lg border-b pb-2 mb-4">
            Account Security
          </h3>

          <!-- Username Section -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Username</h4>
            <FormKit
              type="text"
              name="username"
              label="Username"
              validation="required|length:3"
              :validation-messages="{
                required: 'Username is required',
                length: 'Username must be at least 3 characters',
              }"
              v-model="formData.username"
              :disabled="true"
            />
          </div>

          <!-- Email Section -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Email Address</h4>
            <FormKit
              type="email"
              name="email"
              label="Email"
              validation="required|email"
              :validation-messages="{
                required: 'Email is required',
                email: 'Please enter a valid email'
              }"
              v-model="formData.email"
              :disabled="true"
            />
          </div>

          <!-- Password Change Section -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-4">
              Change Password
            </h4>
            <FormKit
              type="form"
              :actions="false"
              @submit="handlePasswordChange"
              :config="{ validationVisibility: 'live' }"
            >
              <div class="space-y-4">
                <!-- Current Password -->
                <FormKit
                  :type="showCurrentPassword ? 'text' : 'password'"
                  name="currentPassword"
                  label="Current Password"
                  validation="required|length:8"
                  :validation-messages="{
                    required: 'Current password is required',
                    length: 'Password must be at least 8 characters',
                  }"
                  v-model="passwordData.currentPassword"
                >
                  <template #suffix>
                    <div
                      class="cursor-pointer mr-2"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <Icon
                        v-if="!showCurrentPassword"
                        name="ion:eye-outline"
                        size="19"
                      />
                      <Icon v-else name="ion:eye-off-outline" size="19" />
                    </div>
                  </template>
                </FormKit>

                <!-- New Password -->
                <FormKit
                  :type="showNewPassword ? 'text' : 'password'"
                  name="newPassword"
                  label="New Password"
                  validation="required|length:8"
                  :validation-messages="{
                    required: 'New password is required',
                    length: 'Password must be at least 8 characters',
                  }"
                  v-model="passwordData.newPassword"
                >
                  <template #suffix>
                    <div
                      class="cursor-pointer mr-2"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <Icon
                        v-if="!showNewPassword"
                        name="ion:eye-outline"
                        size="19"
                      />
                      <Icon v-else name="ion:eye-off-outline" size="19" />
                    </div>
                  </template>
                </FormKit>

                <!-- Confirm New Password -->
                <FormKit
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="confirmPassword"
                  label="Confirm New Password"
                  validation="required|confirm"
                  :validation-messages="{
                    required: 'Please confirm your new password',
                    confirm: 'Passwords do not match',
                  }"
                  :validation-rules="{
                    confirm: (value) =>
                      value === passwordData.newPassword ||
                      'Passwords do not match',
                  }"
                  v-model="passwordData.confirmPassword"
                >
                  <template #suffix>
                    <div
                      class="cursor-pointer mr-2"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <Icon
                        v-if="!showConfirmPassword"
                        name="ion:eye-outline"
                        size="19"
                      />
                      <Icon v-else name="ion:eye-off-outline" size="19" />
                    </div>
                  </template>
                </FormKit>

                <div class="flex justify-end mt-6">
                  <rs-button variant="primary" type="submit">
                    <Icon name="ph:lock-key" class="w-4 h-4 mr-1" />
                    Change Password
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </div>
        </rs-card>
      </div>

      <!-- Side Information -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Corporate Status -->
        <rs-card class="p-6">
          <h3 class="font-semibold mb-4">Corporate Status</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Organization</span>
              <span class="font-medium">{{ userStore.organization.name }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Cost Center</span>
              <span class="font-medium">{{ formData.costCenter }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Employment Status</span>
              <rs-badge color="green">Active</rs-badge>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Access Level</span>
              <rs-badge color="blue">{{ formData.accessLevel }}</rs-badge>
            </div>
          </div>
        </rs-card>

        <!-- Team & Projects -->
        <rs-card class="p-6">
          <h3 class="font-semibold mb-4">Team & Projects</h3>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm text-gray-600 mb-2">Current Team</h4>
              <p class="font-medium">{{ formData.teamName }}</p>
            </div>
            <div>
              <h4 class="text-sm text-gray-600 mb-2">Project Assignments</h4>
              <div class="flex flex-wrap gap-2">
                <rs-badge
                  v-for="project in formData.projectAssignments"
                  :key="project"
                  color="blue"
                  class="capitalize"
                >
                  {{ project }}
                </rs-badge>
              </div>
            </div>
            <div>
              <h4 class="text-sm text-gray-600 mb-2">System Roles</h4>
              <div class="flex flex-wrap gap-2">
                <rs-badge
                  v-for="role in formData.systemRoles"
                  :key="role"
                  color="green"
                  class="capitalize"
                >
                  {{ role }}
                </rs-badge>
              </div>
            </div>
          </div>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

definePageMeta({
  title: "Profile",
  middleware: ["auth"],
  breadcrumb: [{ name: "Profile", type: "current" }],
});

// Add these refs for password management
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handlePasswordChange = () => {
  // Handle password change logic here
  console.log('Password change submitted:', passwordData.value);
};

const formData = ref({
  // Basic Information
  username: userStore.username,
  firstName: "John",
  lastName: "Doe",
  displayName: "John D.",

  // Professional Information
  employeeId: "EMP123",
  department: "Engineering",
  division: "Software Development",
  jobTitle: "Senior Developer",
  reportingManager: "Sarah Smith",
  dateJoined: "2023-01-15",
  employmentType: "Full-time",
  workLocation: "HQ - Building A",

  // Contact Details
  email: userStore.organization.email,
  workPhone: "0123456789",
  extension: "4567",
  officeLocation: "Floor 3, Room 302",
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "0123456789",
  },

  // System Access & Preferences
  timeZone: "UTC-7",
  language: "English",
  accessLevel: "Level 2",
  systemRoles: ["Developer", "Project Lead"],
  lastLogin: "2024-02-20T09:30:00",

  // Corporate Information
  costCenter: "CC-DEV-001",
  projectAssignments: ["Project Alpha", "Project Beta"],
  teamName: "Core Platform Team",
  shiftSchedule: "9:00 AM - 6:00 PM",
  payrollId: "PR-2023-123",
});

const timeZoneOptions = [
  { label: "Pacific Time (UTC-8)", value: "UTC-8" },
  { label: "Eastern Time (UTC-4)", value: "UTC-4" },
  { label: "UTC", value: "UTC" },
];

const languageOptions = [
  { label: "Bahasa Melayu", value: "ms" },
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
];

const handleUpdateProfile = () => {
  // Handle profile update logic here
};
</script>

<style lang="scss" scoped></style>
