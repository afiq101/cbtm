<script setup>
definePageMeta({
  title: "Framework Details",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", type: "current" },
  ],
});

const route = useRoute();
const router = useRouter();

// Enhanced framework structure with status
const framework = ref({
  id: route.params.id,
  name: "Technical Competency Framework",
  description: "Framework for technical skills assessment",
  type: "competency",
  status: "active",
  lastModified: "2024-03-20",
  version: "1.0",
  competencies: [
    {
      id: 1,
      name: "Leadership Competency",
      description: "Leadership skills assessment",
      forms: [
        {
          id: 1,
          name: "Self Assessment",
          type: "self",
          questions: [],
        },
        {
          id: 2,
          name: "Peer Review",
          type: "peer",
          questions: [],
        },
        {
          id: 3,
          name: "Manager Assessment",
          type: "manager",
          questions: [],
        },
      ],
    },
  ],
  variables: {
    weights: {
      situation: 20,
      workload: 20,
      trigger: 20,
      action: 20,
      result: 20,
    },
    thresholds: {
      novice: 65,
      capable: 84,
      skilled: 92,
      expert: 100,
    },
  },
});

// New: Framework status options
const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

// New: Delete competency
const deleteCompetency = async (competencyId) => {
  const confirmed = await confirm(
    "Are you sure you want to delete this competency?"
  );
  if (confirmed) {
    try {
      // API call would go here
      framework.value.competencies = framework.value.competencies.filter(
        (c) => c.id !== competencyId
      );
      // Show success message
      console.log("Competency deleted successfully");
    } catch (error) {
      console.error("Error deleting competency:", error);
    }
  }
};

// New: Duplicate form
const duplicateForm = async (competencyId, formId) => {
  try {
    const competency = framework.value.competencies.find(
      (c) => c.id === competencyId
    );
    if (!competency) return;

    const originalForm = competency.forms.find((f) => f.id === formId);
    if (!originalForm) return;

    const newForm = {
      ...originalForm,
      id: Date.now(),
      name: `${originalForm.name} (Copy)`,
    };

    competency.forms.push(newForm);
    // Show success message
    console.log("Form duplicated successfully");
  } catch (error) {
    console.error("Error duplicating form:", error);
  }
};

// New: Update framework status
const updateFrameworkStatus = async (newStatus) => {
  try {
    framework.value.status = newStatus;
    // API call would go here
    console.log("Framework status updated:", newStatus);
  } catch (error) {
    console.error("Error updating framework status:", error);
  }
};

// New: Export framework
const exportFramework = () => {
  const exportData = {
    ...framework.value,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `framework-${framework.value.id}-export.json`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const addCompetency = () => {
  router.push(`/framework/${route.params.id}/competency/add`);
};

const editCompetency = (competencyId) => {
  router.push(`/framework/${route.params.id}/competency/${competencyId}`);
};

const addForm = (competencyId) => {
  router.push(
    `/framework/${route.params.id}/competency/${competencyId}/form/add`
  );
};

// Actions
const actions = {
  framework: {
    export: exportFramework,
    updateStatus: updateFrameworkStatus,
  },
  competency: {
    add: addCompetency,
    edit: editCompetency,
    delete: deleteCompetency,
  },
  form: {
    add: addForm,
    duplicate: duplicateForm,
  },
};

const activeTab = ref("overview");
const tabs = [
  { id: "overview", label: "Overview", icon: "ph:info" },
  { id: "competencies", label: "Competencies", icon: "ph:stack" },
  { id: "settings", label: "Settings", icon: "ph:gear" },
];

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};
</script>

<template>
  <div>
    <Breadcrumb class="mb-6" />

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ framework.name }}
        </h1>
        <rs-badge
          :class="[
            'px-3 py-1 text-sm font-medium rounded-full',
            framework.status === 'active'
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-50 text-gray-700',
          ]"
        >
          {{ framework.status }}
        </rs-badge>
      </div>
      <div class="flex items-center gap-3">
        <FormKit
          type="select"
          :options="statusOptions"
          v-model="framework.status"
          @change="actions.framework.updateStatus"
          :classes="{
            outer: 'mb-0',
            input:
              'h-10 min-w-[140px] rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500',
          }"
        />
        <rs-button
          variant="secondary-outline"
          class="h-10 gap-2 hover:bg-gray-50"
          @click="actions.framework.export"
        >
          <Icon name="ph:download" class="w-4 h-4" />
          Export
        </rs-button>
      </div>
    </div>

    <div class="">
      <!-- Custom Tabs -->
      <nav
        class="flex space-x-1 rounded-lg bg-gray-100 py-1 mb-2"
        aria-label="Tabs"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </nav>

      <!-- Tab Panels -->
      <div class="transition-all">
        <!-- Overview Panel -->
        <div v-show="activeTab === 'overview'" class="space-y-6">
          <rs-card class="overflow-hidden">
            <div class="p-6">
              <p class="text-gray-600 text-lg">{{ framework.description }}</p>
              <div class="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon name="ph:code" class="w-4 h-4" />
                  Version {{ framework.version }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="ph:clock" class="w-4 h-4" />
                  Last modified: {{ framework.lastModified }}
                </span>
              </div>
            </div>
          </rs-card>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Weights Card -->
            <rs-card class="overflow-hidden">
              <div class="p-6">
                <h3 class="text-lg font-medium mb-4">Component Weights</h3>
                <div class="space-y-3">
                  <div
                    v-for="(weight, key) in framework.variables.weights"
                    :key="key"
                    class="flex items-center"
                  >
                    <span class="text-gray-600 capitalize flex-1">{{
                      key
                    }}</span>
                    <div
                      class="w-48 h-2 bg-gray-100 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-primary-500 rounded-full"
                        :style="{ width: `${weight}%` }"
                      />
                    </div>
                    <span class="text-gray-900 font-medium ml-3 w-12"
                      >{{ weight }}%</span
                    >
                  </div>
                </div>
              </div>
            </rs-card>

            <!-- Thresholds Card -->
            <rs-card class="overflow-hidden">
              <div class="p-6">
                <h3 class="text-lg font-medium mb-4">Competency Thresholds</h3>
                <div class="space-y-3">
                  <div
                    v-for="(threshold, level) in framework.variables.thresholds"
                    :key="level"
                    class="flex items-center"
                  >
                    <span class="text-gray-600 capitalize flex-1">{{
                      level
                    }}</span>
                    <div
                      class="w-48 h-2 bg-gray-100 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-primary-500 rounded-full"
                        :style="{ width: `${threshold}%` }"
                      />
                    </div>
                    <span class="text-gray-900 font-medium ml-3 w-12"
                      >{{ threshold }}%</span
                    >
                  </div>
                </div>
              </div>
            </rs-card>
          </div>
        </div>

        <!-- Competencies Panel -->
        <div v-show="activeTab === 'competencies'" class="space-y-6">
          <div class="space-y-6">
            <rs-card
              v-for="competency in framework.competencies"
              :key="competency.id"
              class="overflow-hidden transition-shadow hover:shadow-md"
            >
              <div class="p-6">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <h3 class="text-xl font-medium text-gray-900">
                      {{ competency.name }}
                    </h3>
                    <p class="text-gray-600 mt-1">
                      {{ competency.description }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <rs-button
                      variant="danger-outline"
                      @click="actions.competency.delete(competency.id)"
                    >
                      <Icon name="ph:trash" class="w-4 h-4 mr-2" />
                      Delete
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      @click="actions.competency.edit(competency.id)"
                    >
                      <Icon name="ph:pencil" class="w-4 h-4 mr-2" />
                      Edit
                    </rs-button>
                    <rs-button
                      variant="primary"
                      @click="actions.competency.add"
                    >
                      <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                      Add Form
                    </rs-button>
                  </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                  <div
                    v-for="form in competency.forms"
                    :key="form.id"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <h4 class="font-medium text-gray-900">{{ form.name }}</h4>
                      <rs-badge
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          form.type === 'self'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700',
                        ]"
                      >
                        {{ form.type }}
                      </rs-badge>
                    </div>
                    <div class="flex justify-between gap-2">
                      <rs-button
                        @click="
                          navigateTo(
                            `/framework/${route.params.id}/competency/${competency.id}/form/${form.id}/assign`
                          )
                        "
                        variant="secondary"
                      >
                        <Icon name="ph:users" class="w-4 h-4 mr-2" />
                        Assign
                      </rs-button>
                      <div class="flex gap-2">
                        <rs-button
                          variant="secondary-outline"
                          @click="
                            actions.form.duplicate(competency.id, form.id)
                          "
                        >
                          <Icon name="ph:copy" class="w-4 h-4 mr-2" />
                          Duplicate
                        </rs-button>
                        <rs-button
                          variant="primary-outline"
                          @click="
                            router.push(
                              `/framework/${route.params.id}/competency/${competency.id}/form/${form.id}`
                            )
                          "
                        >
                          <Icon name="ph:pencil" class="w-4 h-4 mr-2" />
                          Edit
                        </rs-button>
                      </div>
                    </div>
                  </div>

                  <!-- Add Form Button -->
                  <button
                    @click="actions.form.add(competency.id)"
                    class="flex flex-col items-center justify-center gap-2 h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 hover:border-primary/70 hover:text-primary transition-colors"
                  >
                    <Icon name="ph:plus-circle" class="w-6 h-6" />
                    <span class="text-sm font-medium">Add Form</span>
                  </button>
                </div>
              </div>
            </rs-card>
          </div>
        </div>

        <!-- Settings Panel -->
        <div v-show="activeTab === 'settings'">
          <rs-card class="p-6 space-y-4">
            <button
              @click="navigateTo(`/framework/${route.params.id}/settings`)"
              class="relative flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-100"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-900">Manage Settings</p>
                <p class="text-sm text-gray-500">
                  Update scoring methods, assessment rules, visibility and
                  workflow settings
                </p>
              </div>
              <Icon name="ph:caret-right" class="w-4 h-4 text-gray-400" />
            </button>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-panel-enter-active,
.tab-panel-leave-active {
  transition: all 0.2s ease-in-out;
}

.tab-panel-enter-from,
.tab-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
