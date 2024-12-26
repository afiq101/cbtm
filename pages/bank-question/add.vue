<template>
  <div>
    <Breadcrumb />
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Question</h1>
          <p class="text-gray-500">Create a new assessment question</p>
        </div>
        <rs-button variant="primary" @click="router.push('/bank-question')">
          <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
          Back to List
        </rs-button>
      </div>
    </div>

    <rs-card class="p-6">
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              name="type"
              label="Question Type"
              :options="questionTypes"
              validation="required"
              v-model="formData.type"
            />
            <FormKit
              type="text"
              name="category"
              label="Category"
              validation="required"
              v-model="formData.category"
              help="Group similar questions together"
            />
          </div>

          <FormKit
            type="textarea"
            name="text"
            label="Question Text"
            validation="required"
            v-model="formData.text"
            help="Enter your question"
          />

          <!-- Rating Scale Options -->
          <template v-if="formData.type === 'rating'">
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">Rating Scale Options</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="number"
                  name="minRating"
                  label="Minimum Rating"
                  validation="required|number|min:0"
                  v-model="formData.options.minRating"
                />
                <FormKit
                  type="number"
                  name="maxRating"
                  label="Maximum Rating"
                  validation="required|number|min:1"
                  v-model="formData.options.maxRating"
                />
              </div>
            </div>
          </template>

          <!-- Multiple Choice Options -->
          <template v-if="formData.type === 'choice'">
            <div class="border-t pt-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Choice Options</h3>
                <rs-button
                  variant="secondary-outline"
                  size="sm"
                  @click="addChoiceOption"
                >
                  <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                  Add Option
                </rs-button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(option, index) in formData.options.choices"
                  :key="index"
                  class="flex items-center gap-4"
                >
                  <FormKit
                    type="text"
                    :name="`option-${index}`"
                    placeholder="Enter option text"
                    validation="required"
                    v-model="option.text"
                    :classes="{
                      outer: 'flex-1 mb-0',
                    }"
                  />
                  <button
                    @click="removeChoiceOption(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="ph:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Scoring Settings -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">Scoring Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="number"
                name="weight"
                label="Question Weight (%)"
                validation="required|number|min:0|max:100"
                v-model="formData.weight"
                help="Relative importance of this question"
              />
              <FormKit
                type="checkbox"
                name="required"
                label="Required Question"
                v-model="formData.required"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-2 mt-6">
            <rs-button
              variant="secondary"
              type="button"
              @click="router.push('/bank-question')"
            >
              Cancel
            </rs-button>
            <rs-button variant="success" type="submit">Create Question</rs-button>
          </div>
        </div>
      </FormKit>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Add Question",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Question Bank", path: "/bank-question" },
    { name: "Add Question", type: "current" },
  ],
});

const router = useRouter();

// Question types from bank-question/index.vue
const questionTypes = [
  { value: "rating", label: "Rating Scale" },
  { value: "text", label: "Text Response" },
  { value: "choice", label: "Multiple Choice" },
  { value: "boolean", label: "Yes/No" },
];

// Form data structure
const formData = reactive({
  type: "rating",
  text: "",
  category: "",
  required: true,
  weight: 0,
  options: {
    minRating: 1,
    maxRating: 5,
    choices: [],
  },
});

// Add choice option
const addChoiceOption = () => {
  formData.options.choices.push({ text: "" });
};

// Remove choice option
const removeChoiceOption = (index) => {
  formData.options.choices.splice(index, 1);
};

// Handle form submission
const handleSubmit = async () => {
  try {
    // API call would go here
    console.log("Creating question:", formData);
    router.push("/bank-question");
  } catch (error) {
    console.error("Error creating question:", error);
  }
};
</script>

<style lang="scss" scoped></style>
