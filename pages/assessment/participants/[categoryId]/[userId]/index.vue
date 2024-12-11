<script setup>
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);

definePageMeta({
  title: "Assessment Form",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Assessment", path: "/assessment" },
    { name: "Participants", type: "parent" },
    { name: "Form", type: "current" },
  ],
});

// Framework settings (would be fetched from API)
const settings = ref({
  scoring: {
    method: "weighted_average",
    roundingDecimal: 2,
    passingScore: 65,
  },
  customization: {
    levels: [
      { id: 1, name: "Beginner", minScore: 0, maxScore: 40 },
      { id: 2, name: "Intermediate", minScore: 41, maxScore: 70 },
      { id: 3, name: "Advanced", minScore: 71, maxScore: 85 },
      { id: 4, name: "Expert", minScore: 86, maxScore: 100 },
    ],
  },
});

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

// Add computed properties for total score and competency level
const totalScore = computed(() => {
  const values = participant.value.assessment;
  if (settings.value.scoring.method === "weighted_average") {
    const total = Object.values(values).reduce((sum, val) => sum + val, 0);
    return Number(
      (total / Object.keys(values).length).toFixed(
        settings.value.scoring.roundingDecimal
      )
    );
  }
  return 0;
});

const competencyLevel = computed(() => {
  const level = settings.value.customization.levels.find(
    (level) =>
      totalScore.value >= level.minScore && totalScore.value <= level.maxScore
  );
  return {
    level: level?.name || "Not Rated",
    color: level?.color || "#666666",
  };
});

// Calculate final score based on scoring method
const calculateScore = (values) => {
  if (settings.value.scoring.method === "weighted_average") {
    const total = Object.values(values).reduce((sum, val) => sum + val, 0);
    return Number(
      (total / Object.keys(values).length).toFixed(
        settings.value.scoring.roundingDecimal
      )
    );
  }
  // Add other scoring methods as needed
  return 0;
};

// Get competency level based on score
const getCompetencyLevel = (score) => {
  return settings.value.customization.levels.find(
    (level) => score >= level.minScore && score <= level.maxScore
  );
};

const submitForm = async () => {
  try {
    isSubmitting.value = true;
    const finalScore = calculateScore(participant.value.assessment);
    const level = getCompetencyLevel(finalScore);

    console.log("Submitting assessment:", {
      ...participant.value,
      finalScore,
      level: level?.name,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/assessment/participants/${route.params.categoryId}`);
  } catch (error) {
    console.error("Error submitting assessment:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <Breadcrumb />

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
                  <p class="text-2xl font-bold">{{ totalScore }}%</p>
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
              variant="secondary"
              type="button"
              @click="router.push(`/assessment/participants/${categoryId}`)"
              :disabled="isSubmitting"
            >
              <Icon name="ph:x" class="w-4 h-4 mr-1" />
              Cancel
            </rs-button>
            <rs-button variant="success" type="submit" :loading="isSubmitting">
              <Icon name="ph:check" class="w-4 h-4 mr-1" />
              {{ isSubmitting ? "Saving..." : "Save Assessment" }}
            </rs-button>
          </div>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped></style>
