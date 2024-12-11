<script setup>
import { useDraggable } from "@vueuse/core";

definePageMeta({
  title: "Framework Settings",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", path: `/framework/1` },
    { name: "Settings", type: "current" },
  ],
});

const route = useRoute();
const router = useRouter();

// Mock data - would be fetched from API
const settings = reactive({
  // Basic Settings
  name: "Technical Competency Framework",
  description: "Framework for technical skills assessment",
  status: "active",

  // Scoring Settings
  scoring: {
    method: "weighted_average", // weighted_average, simple_average, custom
    roundingDecimal: 2,
    passingScore: 65,
    components: [
      { id: 1, name: "situation", weight: 20 },
      { id: 2, name: "workload", weight: 20 },
      { id: 3, name: "trigger", weight: 20 },
      { id: 4, name: "action", weight: 20 },
      { id: 5, name: "result", weight: 20 },
    ],
  },

  // Assessment Settings
  assessment: {
    allowSelfAssessment: true,
    requireManagerApproval: true,
    allowPeerReview: true,
    minimumPeerReviewers: 2,
    maximumPeerReviewers: 5,
    assessmentFrequency: "quarterly", // monthly, quarterly, semi_annual, annual
    reminderEnabled: true,
    reminderDays: 7,
  },

  // Visibility Settings
  visibility: {
    showScoreToEmployee: true,
    showComparisonStats: true,
    showPeerReviewers: false,
    showComments: true,
  },

  // Customization
  customization: {
    levels: [
      { id: 1, name: "Novice", minScore: 0, maxScore: 64, color: "#FF4444" },
      { id: 2, name: "Capable", minScore: 65, maxScore: 84, color: "#FFBB33" },
      { id: 3, name: "Skilled", minScore: 85, maxScore: 92, color: "#00C851" },
      { id: 4, name: "Expert", minScore: 93, maxScore: 100, color: "#33B5E5" },
    ],
    labels: {
      competency: "Competency",
      assessment: "Assessment",
      review: "Review",
      score: "Score",
    },
  },

  // Workflow
  workflow: {
    steps: [
      { id: 1, name: "Self Assessment", required: true, order: 1 },
      { id: 2, name: "Peer Review", required: true, order: 2 },
      { id: 3, name: "Manager Review", required: true, order: 3 },
      { id: 4, name: "Feedback Session", required: false, order: 4 },
    ],
  },
});

// Available options for dropdowns
const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
];

const scoringMethods = [
  { value: "weighted_average", label: "Weighted Average" },
  { value: "simple_average", label: "Simple Average" },
  { value: "custom", label: "Custom Formula" },
];

// Add new level
const addLevel = () => {
  settings.customization.levels.push({
    id: Date.now(),
    name: "",
    minScore: 0,
    maxScore: 100,
    color: "#000000",
  });
};

// Remove level
const removeLevel = (levelId) => {
  const index = settings.customization.levels.findIndex(
    (l) => l.id === levelId
  );
  if (index !== -1) {
    settings.customization.levels.splice(index, 1);
  }
};

// Add workflow step
const addWorkflowStep = () => {
  settings.workflow.steps.push({
    id: Date.now(),
    name: "",
    required: false,
    order: settings.workflow.steps.length + 1,
  });
};

// Remove workflow step
const removeWorkflowStep = (stepId) => {
  const index = settings.workflow.steps.findIndex((s) => s.id === stepId);
  if (index !== -1) {
    settings.workflow.steps.splice(index, 1);
  }
};

// Add methods for component management
const addComponent = () => {
  settings.scoring.components.push({
    id: Date.now(),
    name: "",
    weight: 0,
  });
};

const removeComponent = (componentId) => {
  const index = settings.scoring.components.findIndex(
    (c) => c.id === componentId
  );
  if (index !== -1) {
    settings.scoring.components.splice(index, 1);
  }
};

const totalWeight = computed(() => {
  return settings.scoring.components.reduce(
    (sum, comp) => sum + comp.weight,
    0
  );
});

const handleSubmit = async () => {
  if (totalWeight.value !== 100) {
    alert("Total component weights must equal 100%");
    return;
  }

  try {
    // API call would go here
    console.log("Updating framework settings:", settings);
    router.push(`/framework/${route.params.id}`);
  } catch (error) {
    console.error("Error updating settings:", error);
  }
};

// Add these refs for drag state
const draggedComponent = ref(null);
const draggedLevel = ref(null);

// Component drag handlers
const onComponentDragStart = (component, event) => {
  draggedComponent.value = component;
  event.target.classList.add("dragging");
};

const onComponentDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedComponent.value = null;
};

const onComponentDragOver = (targetComponent, event) => {
  event.preventDefault();
  if (
    !draggedComponent.value ||
    targetComponent.id === draggedComponent.value.id
  )
    return;

  const sourceIndex = settings.scoring.components.findIndex(
    (c) => c.id === draggedComponent.value.id
  );
  const targetIndex = settings.scoring.components.findIndex(
    (c) => c.id === targetComponent.id
  );

  if (sourceIndex !== -1 && targetIndex !== -1) {
    const [movedComponent] = settings.scoring.components.splice(sourceIndex, 1);
    settings.scoring.components.splice(targetIndex, 0, movedComponent);
  }
};

// Level drag handlers
const onLevelDragStart = (level, event) => {
  draggedLevel.value = level;
  event.target.classList.add("dragging");
};

const onLevelDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedLevel.value = null;
};

const onLevelDragOver = (targetLevel, event) => {
  event.preventDefault();
  if (!draggedLevel.value || targetLevel.id === draggedLevel.value.id) return;

  const sourceIndex = settings.customization.levels.findIndex(
    (l) => l.id === draggedLevel.value.id
  );
  const targetIndex = settings.customization.levels.findIndex(
    (l) => l.id === targetLevel.id
  );

  if (sourceIndex !== -1 && targetIndex !== -1) {
    const [movedLevel] = settings.customization.levels.splice(sourceIndex, 1);
    settings.customization.levels.splice(targetIndex, 0, movedLevel);
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-800">Framework Settings</h1>
    </div>

    <FormKit type="form" :actions="false" @submit="handleSubmit">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Settings -->
        <rs-card class="p-6">
          <h2 class="text-lg font-semibold mb-4">Basic Settings</h2>
          <div class="space-y-4">
            <FormKit
              type="text"
              name="name"
              label="Framework Name"
              validation="required"
              v-model="settings.name"
            />
            <FormKit
              type="textarea"
              name="description"
              label="Description"
              validation="required"
              v-model="settings.description"
            />
            <FormKit
              type="select"
              name="status"
              label="Status"
              :options="[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'draft', label: 'Draft' },
              ]"
              v-model="settings.status"
            />
          </div>
        </rs-card>

        <!-- Scoring Settings -->
        <rs-card class="p-6">
          <h2 class="text-lg font-semibold mb-4">Scoring Settings</h2>
          <div class="space-y-4">
            <FormKit
              type="select"
              name="scoring.method"
              label="Scoring Method"
              :options="scoringMethods"
              v-model="settings.scoring.method"
            />
            <FormKit
              type="number"
              name="scoring.roundingDecimal"
              label="Decimal Places"
              validation="required|number|min:0|max:4"
              v-model="settings.scoring.roundingDecimal"
            />
            <FormKit
              type="number"
              name="scoring.passingScore"
              label="Passing Score"
              validation="required|number|min:0|max:100"
              v-model="settings.scoring.passingScore"
            />
          </div>
        </rs-card>

        <!-- Assessment Settings -->
        <rs-card class="p-6">
          <h2 class="text-lg font-semibold mb-4">Assessment Settings</h2>
          <div class="space-y-4">
            <FormKit
              type="checkbox"
              name="assessment.allowSelfAssessment"
              label="Allow Self Assessment"
              v-model="settings.assessment.allowSelfAssessment"
            />
            <FormKit
              type="checkbox"
              name="assessment.requireManagerApproval"
              label="Require Manager Approval"
              v-model="settings.assessment.requireManagerApproval"
            />
            <FormKit
              type="checkbox"
              name="assessment.allowPeerReview"
              label="Allow Peer Review"
              v-model="settings.assessment.allowPeerReview"
            />
            <div
              v-if="settings.assessment.allowPeerReview"
              class="grid grid-cols-2 gap-4"
            >
              <FormKit
                type="number"
                name="assessment.minimumPeerReviewers"
                label="Min Reviewers"
                validation="required|number|min:1"
                v-model="settings.assessment.minimumPeerReviewers"
              />
              <FormKit
                type="number"
                name="assessment.maximumPeerReviewers"
                label="Max Reviewers"
                validation="required|number|min:1"
                v-model="settings.assessment.maximumPeerReviewers"
              />
            </div>
            <FormKit
              type="select"
              name="assessment.assessmentFrequency"
              label="Assessment Frequency"
              :options="frequencies"
              v-model="settings.assessment.assessmentFrequency"
            />
          </div>
        </rs-card>

        <!-- Visibility Settings -->
        <rs-card class="p-6">
          <h2 class="text-lg font-semibold mb-4">Visibility Settings</h2>
          <div class="space-y-4">
            <FormKit
              type="checkbox"
              name="visibility.showScoreToEmployee"
              label="Show Score to Employee"
              v-model="settings.visibility.showScoreToEmployee"
            />
            <FormKit
              type="checkbox"
              name="visibility.showComparisonStats"
              label="Show Comparison Statistics"
              v-model="settings.visibility.showComparisonStats"
            />
            <FormKit
              type="checkbox"
              name="visibility.showPeerReviewers"
              label="Show Peer Reviewers"
              v-model="settings.visibility.showPeerReviewers"
            />
            <FormKit
              type="checkbox"
              name="visibility.showComments"
              label="Show Comments"
              v-model="settings.visibility.showComments"
            />
          </div>
        </rs-card>

        <!-- Component Weights -->
        <rs-card class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Component Weights</h2>
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="addComponent"
            >
              <Icon name="ph:plus" class="w-4 h-4 mr-1" />
              Add Component
            </rs-button>
          </div>

          <div class="space-y-4">
            <div
              v-for="component in settings.scoring.components"
              :key="component.id"
              class="border rounded-lg p-4 relative bg-white"
              draggable="true"
              @dragstart="onComponentDragStart(component, $event)"
              @dragend="onComponentDragEnd($event)"
              @dragover="onComponentDragOver(component, $event)"
            >
              <div class="flex items-center gap-4">
                <Icon
                  name="ph:dots-six-vertical"
                  class="w-4 h-4 text-gray-400"
                />
                <div class="flex-1 grid grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    :name="`component-${component.id}-name`"
                    label="Component Name"
                    validation="required"
                    v-model="component.name"
                  />
                  <FormKit
                    type="number"
                    :name="`component-${component.id}-weight`"
                    label="Weight (%)"
                    validation="required|number|min:0|max:100"
                    v-model="component.weight"
                  />
                </div>
                <button
                  @click="removeComponent(component.id)"
                  class="text-red-500 hover:text-red-700 mt-6"
                >
                  <Icon name="ph:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Weight validation message -->
          <div
            :class="[
              'mt-4 text-sm',
              totalWeight === 100 ? 'text-green-500' : 'text-red-500',
            ]"
          >
            Total weights: {{ totalWeight }}% (must equal 100%)
          </div>
        </rs-card>

        <!-- Competency Levels -->
        <rs-card class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Competency Thresholds</h2>
            <rs-button variant="secondary-outline" size="sm" @click="addLevel">
              <Icon name="ph:plus" class="w-4 h-4 mr-1" />
              Add Level
            </rs-button>
          </div>

          <div class="space-y-4">
            <div
              v-for="level in settings.customization.levels"
              :key="level.id"
              class="border rounded-lg p-4 relative bg-white"
              draggable="true"
              @dragstart="onLevelDragStart(level, $event)"
              @dragend="onLevelDragEnd($event)"
              @dragover="onLevelDragOver(level, $event)"
            >
              <div class="flex items-center gap-4">
                <Icon
                  name="ph:dots-six-vertical"
                  class="w-4 h-4 text-gray-400"
                />
                <div class="flex-1 grid grid-cols-3 gap-4">
                  <FormKit
                    type="text"
                    :name="`level-${level.id}-name`"
                    label="Level Name"
                    validation="required"
                    v-model="level.name"
                  />
                  <FormKit
                    type="number"
                    :name="`level-${level.id}-min`"
                    label="Min Score"
                    validation="required|number|min:0|max:100"
                    v-model="level.minScore"
                  />
                  <FormKit
                    type="number"
                    :name="`level-${level.id}-max`"
                    label="Max Score"
                    validation="required|number|min:0|max:100"
                    v-model="level.maxScore"
                  />
                </div>
                <button
                  @click="removeLevel(level.id)"
                  class="text-red-500 hover:text-red-700 mt-6"
                >
                  <Icon name="ph:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-2">
        <rs-button
          variant="secondary"
          type="button"
          @click="router.push(`/framework/${route.params.id}`)"
        >
          Cancel
        </rs-button>
        <rs-button variant="success" type="submit"> Save Settings </rs-button>
      </div>
    </FormKit>
  </div>
</template>

<style scoped>
.dragging {
  opacity: 0.5;
  cursor: move;
}

.border {
  border-color: #e5e7eb;
}

.hover\:shadow:hover {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
