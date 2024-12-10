<script setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Assessment Form",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Assessment", path: "/assessment" },
    { name: "Form", type: "current" },
  ],
});

// Dummy user data
const user = ref({
  id: "EMP001",
  name: "John Doe",
  department: "Engineering",
});

const pending = ref(false);
const error = ref(null);

const participant = ref({
  id: "",
  name: "",
  department: "",
  assessment: {
    situation: 0,
    workload: 0,
    trigger: 0,
    action: 0,
    result: 0,
  },
});

// Watch for user data and update participant
watch(
  user,
  (newUser) => {
    if (newUser) {
      participant.value = {
        ...participant.value,
        id: newUser.id, // Fixed: Access id directly from newUser
        name: newUser.name, // Fixed: Access name directly from newUser
        department: newUser.department, // Fixed: Access department directly from newUser
      };
    }
  },
  { immediate: true }
);

// Computed properties for assessment calculations
const totalScore = computed(() => {
  const { situation, workload, trigger, action, result } =
    participant.value.assessment;
  const scores = [
    Number(situation),
    Number(workload),
    Number(trigger),
    Number(action),
    Number(result),
  ];

  if (scores.some((score) => isNaN(score))) {
    return 0;
  }

  return scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
});

const competencyLevel = computed(() => {
  const score = totalScore.value;
  if (score >= 93) return { level: "EXPERT", color: "#10B981" };
  if (score >= 85) return { level: "SKILLED", color: "#3B82F6" };
  if (score >= 65) return { level: "CAPABLE", color: "#F59E0B" };
  return { level: "NOVICE", color: "#EF4444" };
});

// Form submission
const isSubmitting = ref(false);
const submitForm = async (formData) => {
  try {
    isSubmitting.value = true;
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", {
      ...formData,
      userId: route.params.id,
      totalScore: totalScore.value,
      competencyLevel: competencyLevel.value.level,
    });

    await router.push("/assessment");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <Breadcrumb />

    <div v-if="pending" class="flex justify-center items-center p-8">
      <rs-spinner size="lg" />
    </div>

    <div v-else-if="error" class="text-center p-8">
      <p class="text-red-500">Error loading user data. Please try again.</p>
      <rs-button variant="primary" class="mt-4" @click="$fetch">
        Retry
      </rs-button>
    </div>

    <template v-else>
      <rs-card class="p-5">
        <div class="mb-4 flex justify-between items-center border-b pb-4">
          <div>
            <h2 class="text-xl font-semibold">
              Assessment for {{ participant.name }}
            </h2>
            <p class="text-gray-600">{{ participant.department }}</p>
          </div>
          <rs-button
            variant="secondary-outline"
            @click="router.push('/assessment')"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Back to List
          </rs-button>
        </div>

        <FormKit
          type="form"
          @submit="submitForm"
          :actions="false"
          :disabled="isSubmitting"
        >
          <div class="space-y-6">
            <!-- Participant Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormKit
                type="text"
                name="id"
                label="Employee ID"
                validation="required"
                v-model="participant.id"
                :disabled="true"
              />

              <FormKit
                type="text"
                name="name"
                label="Employee Name"
                validation="required"
                v-model="participant.name"
                :disabled="true"
              />

              <FormKit
                type="text"
                name="department"
                label="Department"
                validation="required"
                v-model="participant.department"
                :disabled="true"
              />
            </div>

            <!-- Assessment Components -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold mb-4">Assessment Components</h3>
              <div class="space-y-6">
                <FormKit
                  v-for="(_, key) in participant.assessment"
                  :key="key"
                  type="range"
                  :name="key"
                  :label="key.charAt(0).toUpperCase() + key.slice(1)"
                  validation="required|number|min:0|max:100"
                  :help="`Score: ${participant.assessment[key]}%`"
                  min="0"
                  max="100"
                  step="1"
                  v-model="participant.assessment[key]"
                />
              </div>
            </div>

            <!-- Assessment Summary -->
            <rs-card class="mt-6">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4">Assessment Summary</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Total Score</p>
                    <p class="text-2xl font-bold">
                      {{ totalScore.toFixed(2) }}%
                    </p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Competency Level</p>
                    <p
                      class="text-2xl font-bold"
                      :style="{ color: competencyLevel.color }"
                    >
                      {{ competencyLevel.level }}
                    </p>
                  </div>
                </div>
              </div>
            </rs-card>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4">
              <rs-button
                variant="danger"
                type="button"
                @click="router.push('/assessment')"
                :disabled="isSubmitting"
              >
                <Icon name="ph:x" class="w-4 h-4 mr-1" />
                Cancel
              </rs-button>
              <rs-button
                variant="success"
                type="submit"
                :loading="isSubmitting"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" />
                {{ isSubmitting ? "Saving..." : "Save Assessment" }}
              </rs-button>
            </div>
          </div>
        </FormKit>
      </rs-card>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
