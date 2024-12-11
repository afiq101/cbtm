<script setup>
definePageMeta({
  title: "Add Assessment Form",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Frameworks", path: "/framework" },
    { name: "Details", path: "/framework/{id}" },
    { name: "Competency", path: "/framework/{id}/competency/{competencyId}" },
    { name: "Add Form", type: "current" },
  ],
});

const route = useRoute();
const router = useRouter();

const formData = reactive({
  name: "",
  description: "",
  type: "self", // self, peer, manager
  sections: [], // groups of questions
});

// Form types available
const formTypes = [
  { value: "self", label: "Self Assessment" },
  { value: "peer", label: "Peer Review" },
  { value: "manager", label: "Manager Assessment" },
];

// Question types available
const questionTypes = [
  { value: "rating", label: "Rating Scale" },
  { value: "text", label: "Text Response" },
  { value: "choice", label: "Multiple Choice" },
  { value: "boolean", label: "Yes/No" },
];

// Add new section
const addSection = () => {
  formData.sections.push({
    id: Date.now(),
    title: "",
    description: "",
    questions: [],
  });
};

// Add question to section
const addQuestion = (sectionId) => {
  const section = formData.sections.find((s) => s.id === sectionId);
  if (section) {
    section.questions.push({
      id: Date.now(),
      type: "rating",
      text: "",
      required: true,
      options: [],
      weight: 0,
    });
  }
};

// Remove section
const removeSection = (sectionId) => {
  const index = formData.sections.findIndex((s) => s.id === sectionId);
  if (index !== -1) {
    formData.sections.splice(index, 1);
  }
};

// Remove question
const removeQuestion = (sectionId, questionId) => {
  const section = formData.sections.find((s) => s.id === sectionId);
  if (section) {
    const index = section.questions.findIndex((q) => q.id === questionId);
    if (index !== -1) {
      section.questions.splice(index, 1);
    }
  }
};

const handleSubmit = async () => {
  try {
    // API call would go here
    console.log("Submitting form:", formData);
    router.push(
      `/framework/${route.params.id}/competency/${route.params.competencyId}`
    );
  } catch (error) {
    console.error("Error creating form:", error);
  }
};

// Add drag and drop state
const draggedSection = ref(null);
const draggedQuestion = ref(null);

// Handle section dragging
const onSectionDragStart = (section, event) => {
  draggedSection.value = section;
  event.target.classList.add("dragging");
};

const onSectionDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedSection.value = null;
};

const onSectionDragOver = (targetSection, event) => {
  event.preventDefault();
  if (!draggedSection.value || targetSection.id === draggedSection.value.id)
    return;

  const sourceIndex = formData.sections.findIndex(
    (s) => s.id === draggedSection.value.id
  );
  const targetIndex = formData.sections.findIndex(
    (s) => s.id === targetSection.id
  );

  if (sourceIndex !== -1 && targetIndex !== -1) {
    const [movedSection] = formData.sections.splice(sourceIndex, 1);
    formData.sections.splice(targetIndex, 0, movedSection);
  }
};

// Handle question dragging
const onQuestionDragStart = (question, sectionId, event) => {
  draggedQuestion.value = { question, sectionId };
  event.target.classList.add("dragging");
};

const onQuestionDragEnd = (event) => {
  event.target.classList.remove("dragging");
  draggedQuestion.value = null;
};

const onQuestionDragOver = (targetQuestion, targetSectionId, event) => {
  event.preventDefault();
  if (
    !draggedQuestion.value ||
    (targetQuestion.id === draggedQuestion.value.question.id &&
      targetSectionId === draggedQuestion.value.sectionId)
  )
    return;

  const sourceSection = formData.sections.find(
    (s) => s.id === draggedQuestion.value.sectionId
  );
  const targetSection = formData.sections.find((s) => s.id === targetSectionId);

  if (sourceSection && targetSection) {
    const sourceIndex = sourceSection.questions.findIndex(
      (q) => q.id === draggedQuestion.value.question.id
    );
    const targetIndex = targetSection.questions.findIndex(
      (q) => q.id === targetQuestion.id
    );

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedQuestion] = sourceSection.questions.splice(sourceIndex, 1);
      targetSection.questions.splice(targetIndex, 0, movedQuestion);
    }
  }
};
</script>

<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-800">Add Assessment Form</h1>
    </div>

    <rs-card class="p-6">
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <div class="space-y-6">
          <!-- Basic Form Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="name"
              label="Form Name"
              validation="required"
              v-model="formData.name"
            />

            <FormKit
              type="select"
              name="type"
              label="Form Type"
              :options="formTypes"
              validation="required"
              v-model="formData.type"
            />
          </div>

          <FormKit
            type="textarea"
            name="description"
            label="Description"
            validation="required"
            v-model="formData.description"
          />

          <!-- Sections -->
          <div class="border-t pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Form Sections</h3>
              <rs-button
                variant="secondary-outline"
                size="sm"
                @click="addSection"
              >
                <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                Add Section
              </rs-button>
            </div>

            <div class="space-y-6">
              <div class="space-y-4">
                <template
                  v-for="section in formData.sections"
                  :key="section.id"
                >
                  <div
                    class="border rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200"
                    draggable="true"
                    @dragstart="onSectionDragStart(section, $event)"
                    @dragend="onSectionDragEnd($event)"
                    @dragover="onSectionDragOver(section, $event)"
                  >
                    <!-- Section Header -->
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <Icon
                            name="ph:dots-six-vertical"
                            class="w-4 h-4 text-gray-400 cursor-move"
                          />
                          <FormKit
                            type="text"
                            :name="`section-${section.id}-title`"
                            label="Section Title"
                            validation="required"
                            v-model="section.title"
                          />
                        </div>
                      </div>
                      <button
                        @click="removeSection(section.id)"
                        class="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>

                    <!-- Questions -->
                    <div class="space-y-4 pl-6">
                      <template
                        v-for="question in section.questions"
                        :key="question.id"
                      >
                        <div
                          class="border rounded p-4 bg-gray-50 hover:shadow-sm transition-shadow duration-200"
                          draggable="true"
                          @dragstart="
                            onQuestionDragStart(question, section.id, $event)
                          "
                          @dragend="onQuestionDragEnd($event)"
                          @dragover="
                            onQuestionDragOver(question, section.id, $event)
                          "
                        >
                          <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                              <Icon
                                name="ph:dots-six-vertical"
                                class="w-4 h-4 text-gray-400 cursor-move"
                              />
                              <h5 class="font-medium">Question</h5>
                            </div>
                            <button
                              @click="removeQuestion(section.id, question.id)"
                              class="text-red-500 hover:text-red-700"
                            >
                              <Icon name="ph:x" class="w-4 h-4" />
                            </button>
                          </div>

                          <!-- Question Fields -->
                          <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormKit
                                type="select"
                                :name="`question-${question.id}-type`"
                                label="Question Type"
                                :options="questionTypes"
                                v-model="question.type"
                              />
                              <FormKit
                                type="number"
                                :name="`question-${question.id}-weight`"
                                label="Weight (%)"
                                validation="required|number|min:0|max:100"
                                v-model="question.weight"
                              />
                            </div>

                            <FormKit
                              type="textarea"
                              :name="`question-${question.id}-text`"
                              label="Question Text"
                              validation="required"
                              v-model="question.text"
                            />

                            <FormKit
                              type="checkbox"
                              :name="`question-${question.id}-required`"
                              label="Required"
                              v-model="question.required"
                            />
                          </div>
                        </div>
                      </template>

                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="addQuestion(section.id)"
                        class="ml-6"
                      >
                        <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                        Add Question
                      </rs-button>
                    </div>
                  </div>
                </template>
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
            <rs-button variant="success" type="submit"> Create Form </rs-button>
          </div>
        </div>
      </FormKit>
    </rs-card>
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
