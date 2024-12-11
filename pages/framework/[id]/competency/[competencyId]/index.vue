<script setup>
import { useDraggable } from "@vueuse/core";

definePageMeta({
  title: "Edit Competency",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", path: "/framework/{id}" },
    { name: "Edit Competency", type: "current" },
  ],
});

const route = useRoute();
const router = useRouter();

// Mock data - would be fetched from API
const competencyData = reactive({
  id: route.params.competencyId,
  name: "Leadership Competency",
  description: "Core leadership skills assessment",
  criteria: [
    {
      id: 1,
      name: "Team Management",
      description: "Ability to manage and lead teams effectively",
      weight: 30,
      indicators: [
        {
          id: 1,
          text: "Sets clear goals and expectations",
          level: "expert",
        },
        {
          id: 2,
          text: "Provides regular feedback and coaching",
          level: "skilled",
        },
      ],
    },
  ],
  forms: [
    {
      id: 1,
      name: "Self Assessment",
      type: "self",
      status: "active",
    },
    {
      id: 2,
      name: "Manager Review",
      type: "manager",
      status: "active",
    },
  ],
});

// Available levels for indicators
const levels = [
  { value: "novice", label: "Novice" },
  { value: "capable", label: "Capable" },
  { value: "skilled", label: "Skilled" },
  { value: "expert", label: "Expert" },
];

// Add new criteria
const addCriteria = () => {
  competencyData.criteria.push({
    id: Date.now(),
    name: "",
    description: "",
    weight: 0,
    indicators: [],
  });
};

// Add indicator to criteria
const addIndicator = (criteriaId) => {
  const criteria = competencyData.criteria.find((c) => c.id === criteriaId);
  if (criteria) {
    criteria.indicators.push({
      id: Date.now(),
      text: "",
      level: "novice",
    });
  }
};

// Remove criteria
const removeCriteria = (criteriaId) => {
  const index = competencyData.criteria.findIndex((c) => c.id === criteriaId);
  if (index !== -1) {
    competencyData.criteria.splice(index, 1);
  }
};

// Remove indicator
const removeIndicator = (criteriaId, indicatorId) => {
  const criteria = competencyData.criteria.find((c) => c.id === criteriaId);
  if (criteria) {
    const index = criteria.indicators.findIndex((i) => i.id === indicatorId);
    if (index !== -1) {
      criteria.indicators.splice(index, 1);
    }
  }
};

// Navigate to form editor
const editForm = (formId) => {
  router.push(
    `/framework/${route.params.id}/competency/${route.params.competencyId}/form/${formId}`
  );
};

// Add new form
const addForm = () => {
  router.push(
    `/framework/${route.params.id}/competency/${route.params.competencyId}/form/add`
  );
};

const handleSubmit = async () => {
  try {
    // API call would go here
    console.log("Updating competency:", competencyData);
    router.push(`/framework/${route.params.id}`);
  } catch (error) {
    console.error("Error updating competency:", error);
  }
};

// Add these refs for drag state
const draggedCriteria = ref(null);
const draggedIndicator = ref(null);

// Criteria drag handlers
const onCriteriaDragStart = (criteria, event) => {
  draggedCriteria.value = criteria;
  event.target.classList.add("dragging");
};

const onCriteriaDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedCriteria.value = null;
};

const onCriteriaDragOver = (targetCriteria, event) => {
  event.preventDefault();
  if (!draggedCriteria.value || targetCriteria.id === draggedCriteria.value.id)
    return;

  const sourceIndex = competencyData.criteria.findIndex(
    (c) => c.id === draggedCriteria.value.id
  );
  const targetIndex = competencyData.criteria.findIndex(
    (c) => c.id === targetCriteria.id
  );

  if (sourceIndex !== -1 && targetIndex !== -1) {
    const [movedCriteria] = competencyData.criteria.splice(sourceIndex, 1);
    competencyData.criteria.splice(targetIndex, 0, movedCriteria);
  }
};

// Indicator drag handlers
const onIndicatorDragStart = (indicator, criteriaId, event) => {
  draggedIndicator.value = { indicator, criteriaId };
  event.target.classList.add("dragging");
};

const onIndicatorDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedIndicator.value = null;
};

const onIndicatorDragOver = (targetIndicator, targetCriteriaId, event) => {
  event.preventDefault();
  if (
    !draggedIndicator.value ||
    (targetIndicator.id === draggedIndicator.value.indicator.id &&
      targetCriteriaId === draggedIndicator.value.criteriaId)
  )
    return;

  const sourceCriteria = competencyData.criteria.find(
    (c) => c.id === draggedIndicator.value.criteriaId
  );
  const targetCriteria = competencyData.criteria.find(
    (c) => c.id === targetCriteriaId
  );

  if (sourceCriteria && targetCriteria) {
    const sourceIndex = sourceCriteria.indicators.findIndex(
      (i) => i.id === draggedIndicator.value.indicator.id
    );
    const targetIndex = targetCriteria.indicators.findIndex(
      (i) => i.id === targetIndicator.id
    );

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedIndicator] = sourceCriteria.indicators.splice(sourceIndex, 1);
      targetCriteria.indicators.splice(targetIndex, 0, movedIndicator);
    }
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Edit Competency</h1>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Competency Form -->
      <div class="lg:col-span-2">
        <rs-card class="p-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="space-y-6">
              <FormKit
                type="text"
                name="name"
                label="Competency Name"
                validation="required"
                v-model="competencyData.name"
              />

              <FormKit
                type="textarea"
                name="description"
                label="Description"
                validation="required"
                v-model="competencyData.description"
              />

              <!-- Criteria Section -->
              <div class="border-t pt-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Assessment Criteria</h3>
                  <rs-button
                    variant="secondary-outline"
                    size="sm"
                    @click="addCriteria"
                  >
                    <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                    Add Criteria
                  </rs-button>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="criteria in competencyData.criteria"
                    :key="criteria.id"
                    class="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200"
                    draggable="true"
                    @dragstart="onCriteriaDragStart(criteria, $event)"
                    @dragend="onCriteriaDragEnd($event)"
                    @dragover="onCriteriaDragOver(criteria, $event)"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <Icon
                            name="ph:dots-six-vertical"
                            class="w-4 h-4 text-gray-400 cursor-move"
                          />
                          <FormKit
                            type="text"
                            :name="`criteria-${criteria.id}-name`"
                            label="Criteria Name"
                            validation="required"
                            v-model="criteria.name"
                          />
                        </div>
                      </div>
                      <button
                        @click="removeCriteria(criteria.id)"
                        class="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormKit
                        type="textarea"
                        :name="`criteria-${criteria.id}-description`"
                        label="Description"
                        v-model="criteria.description"
                      />
                      <FormKit
                        type="number"
                        :name="`criteria-${criteria.id}-weight`"
                        label="Weight (%)"
                        validation="required|number|min:0|max:100"
                        v-model="criteria.weight"
                      />
                    </div>

                    <!-- Indicators -->
                    <div class="space-y-4 pl-6">
                      <template
                        v-for="indicator in criteria.indicators"
                        :key="indicator.id"
                      >
                        <div
                          class="border rounded p-4 bg-gray-50 hover:shadow-sm transition-shadow duration-200"
                          draggable="true"
                          @dragstart="
                            onIndicatorDragStart(indicator, criteria.id, $event)
                          "
                          @dragend="onIndicatorDragEnd($event)"
                          @dragover="
                            onIndicatorDragOver(indicator, criteria.id, $event)
                          "
                        >
                          <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                              <Icon
                                name="ph:dots-six-vertical"
                                class="w-4 h-4 text-gray-400 cursor-move"
                              />
                              <h5 class="font-medium">Indicator</h5>
                            </div>
                            <button
                              @click="
                                removeIndicator(criteria.id, indicator.id)
                              "
                              class="text-red-500 hover:text-red-700"
                            >
                              <Icon name="ph:x" class="w-4 h-4" />
                            </button>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="md:col-span-3">
                              <FormKit
                                type="textarea"
                                :name="`indicator-${indicator.id}-text`"
                                label="Indicator"
                                validation="required"
                                v-model="indicator.text"
                              />
                            </div>
                            <div class="md:col-span-1">
                              <FormKit
                                type="select"
                                :name="`indicator-${indicator.id}-level`"
                                label="Level"
                                :options="levels"
                                v-model="indicator.level"
                              />
                            </div>
                          </div>
                        </div>
                      </template>

                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="addIndicator(criteria.id)"
                        class="ml-6"
                      >
                        <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                        Add Indicator
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end gap-2 mt-6">
                <rs-button
                  variant="secondary"
                  type="button"
                  @click="router.push(`/framework/${route.params.id}`)"
                >
                  Cancel
                </rs-button>
                <rs-button variant="success" type="submit">
                  Save Changes
                </rs-button>
              </div>
            </div>
          </FormKit>
        </rs-card>
      </div>

      <!-- Forms Sidebar -->
      <div class="lg:col-span-1">
        <rs-card class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Assessment Forms</h3>
            <rs-button variant="primary-outline" size="sm" @click="addForm">
              <Icon name="ph:plus" class="w-4 h-4 mr-1" />
              Add Form
            </rs-button>
          </div>

          <div class="space-y-4">
            <div
              v-for="form in competencyData.forms"
              class="border rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ form.name }}</h4>
                  <span class="text-sm text-gray-500 capitalize">
                    {{ form.type }} Assessment
                  </span>
                </div>
                <rs-badge :color="form.status === 'active' ? 'green' : 'gray'">
                  {{ form.status }}
                </rs-badge>
              </div>
              <div class="flex justify-end mt-4">
                <rs-button
                  variant="secondary-outline"
                  size="sm"
                  @click="editForm(form.id)"
                >
                  <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                  Edit Form
                </rs-button>
              </div>
            </div>
          </div>
        </rs-card>
      </div>
    </div>
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

.hover\:shadow-md:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Add smooth transitions */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

/* Improve form layout */
.formkit-label {
  font-weight: 500;
  color: #374151;
}

.formkit-input,
.formkit-textarea {
  border-color: #e5e7eb;
  border-radius: 0.375rem;
}

.formkit-input:focus,
.formkit-textarea:focus {
  border-color: #3b82f6;
  ring-color: #93c5fd;
}
</style>
