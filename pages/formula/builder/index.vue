<script setup>
import { create, all } from "mathjs";
import { useDraggable } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

const math = create(all);
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Formula Editor",
  middleware: ["auth"],
  breadcrumb: [
    { name: "Formula Management", path: "/formula" },
    { name: "Editor", type: "current" },
  ],
});

const formula = ref({
  name: "",
  description: "",
  category: "",
  formulaExpression: "",
  variables: [{ name: "", description: "", weight: 1, type: "number" }],
  calculation: {
    method: "weighted_average",
    maxScore: 100,
  },
});

// Drag and drop state
const draggedItem = ref(null);
const isDragging = ref(false);

// Formula elements with unique IDs
const formulaElements = ref([]);

// Available elements for drag and drop
const availableElements = ref({
  variables: [],
  operators: [
    { id: "op1", type: "operator", symbol: "+", description: "Addition" },
    { id: "op2", type: "operator", symbol: "-", description: "Subtraction" },
    { id: "op3", type: "operator", symbol: "*", description: "Multiplication" },
    { id: "op4", type: "operator", symbol: "/", description: "Division" },
    { id: "op5", type: "operator", symbol: "^", description: "Power" },
    {
      id: "op6",
      type: "operator",
      symbol: "(",
      description: "Open Parenthesis",
    },
    {
      id: "op7",
      type: "operator",
      symbol: ")",
      description: "Close Parenthesis",
    },
    { id: "op8", type: "operator", symbol: ",", description: "Comma" },
  ],
  functions: [
    {
      id: "fn1",
      type: "function",
      name: "sqrt",
      description: "Square root of a value",
      template: "sqrt()",
      minParams: 1,
      maxParams: 1,
      example: "sqrt(x) calculates √x",
    },
    {
      id: "fn2",
      type: "function",
      name: "cbrt",
      description: "Cube root of a value",
      template: "cbrt()",
      minParams: 1,
      maxParams: 1,
      example: "cbrt(x) calculates ∛x",
    },
    {
      id: "fn3",
      type: "function",
      name: "abs",
      description: "Absolute value",
      template: "abs()",
      minParams: 1,
      maxParams: 1,
      example: "abs(x) calculates |x|",
    },
    {
      id: "fn4",
      type: "function",
      name: "pow",
      description: "Power function",
      template: "pow()",
      minParams: 2,
      maxParams: 2,
      example: "pow(x,y) calculates x^y",
    },
    {
      id: "fn5",
      type: "function",
      name: "log",
      description: "Natural logarithm",
      template: "log()",
      minParams: 1,
      maxParams: 1,
      example: "log(x) calculates ln(x)",
    },
    {
      id: "fn6",
      type: "function",
      name: "exp",
      description: "Exponential function",
      template: "exp()",
      minParams: 1,
      maxParams: 1,
      example: "exp(x) calculates e^x",
    },
    {
      id: "fn7",
      type: "function",
      name: "median",
      description: "Median of values",
      template: "median()",
      minParams: 1,
      maxParams: null,
      example: "median(x1,x2,...) calculates middle value",
    },
    {
      id: "fn8",
      type: "function",
      name: "mean",
      description: "Arithmetic mean",
      template: "mean()",
      minParams: 1,
      maxParams: null,
      example: "mean(x1,x2,...) calculates average",
    },
    {
      id: "fn9",
      type: "function",
      name: "std",
      description: "Standard deviation",
      template: "std()",
      minParams: 1,
      maxParams: null,
      example: "std(x1,x2,...) calculates standard deviation",
    },
    {
      id: "fn10",
      type: "function",
      name: "variance",
      description: "Statistical variance",
      template: "variance()",
      minParams: 1,
      maxParams: null,
      example: "variance(x1,x2,...) calculates variance",
    },
    {
      id: "fn11",
      type: "function",
      name: "min",
      description: "Minimum value",
      template: "min()",
      minParams: 1,
      maxParams: null,
      example: "min(x1,x2,...) finds smallest value",
    },
    {
      id: "fn12",
      type: "function",
      name: "max",
      description: "Maximum value",
      template: "max()",
      minParams: 1,
      maxParams: null,
      example: "max(x1,x2,...) finds largest value",
    },
  ],
});

// Update available variables when formula variables change
watch(
  () => formula.value.variables,
  (newVars) => {
    availableElements.value.variables = newVars
      .filter((v) => v.name)
      .map((v) => ({
        id: uuidv4(),
        type: "variable",
        name: v.name,
        description: v.description,
        varType: v.type,
      }));
  },
  { deep: true }
);

// Add function state management
const activeFunctionIndex = ref(null);
const functionParenthesesCount = ref(0);

// Handle function selection
const selectFunction = (func) => {
  const newElement = {
    ...func,
    id: uuidv4(),
    isOpen: true,
    parameters: [],
  };
  formulaElements.value.push(newElement);
  activeFunctionIndex.value = formulaElements.value.length - 1;
};

// Handle adding parameter to function
const addParameterToFunction = (funcIndex, parameter) => {
  if (funcIndex === null) return;

  const func = formulaElements.value[funcIndex];
  if (!func || func.type !== "function") return;

  // Add comma if needed
  if (func.parameters.length > 0) {
    func.parameters.push({
      id: uuidv4(),
      type: "operator",
      symbol: ",",
      isComma: true,
    });
  }

  // Add the parameter
  func.parameters.push(parameter);
  updateFormulaExpression();
};

// Update formula expression
const updateFormulaExpression = () => {
  let expression = "";

  formulaElements.value.forEach((el, index) => {
    if (el.type === "function") {
      expression += el.name + "(";
      if (el.parameters && el.parameters.length > 0) {
        expression += el.parameters
          .map((p) => (p.isComma ? "," : p.name || p.symbol))
          .join(" ");
      }
      expression += ")";
    } else if (el.type === "operator") {
      expression += " " + el.symbol + " ";
    } else if (el.type === "variable") {
      expression += el.name;
    }
  });

  // Clean up extra spaces and update the formula
  formula.value.formulaExpression = expression.replace(/\s+/g, " ").trim();
};

// Handle drag start
const onDragStart = (item) => {
  isDragging.value = true;
  draggedItem.value = { ...item, id: uuidv4() };
};

// Add function state tracking
const activeFunction = ref(null);

// Update function handling
const handleFunctionDrop = (funcIndex, parameter) => {
  const func = formulaElements.value[funcIndex];

  // Check if function exists
  if (!func || func.type !== "function") return;

  // Initialize parameters array if it doesn't exist
  if (!func.parameters) {
    func.parameters = [];
  }

  // Add comma if there are existing parameters
  if (func.parameters.length > 0) {
    func.parameters.push({
      id: uuidv4(),
      type: "operator",
      symbol: ",",
      isComma: true,
    });
  }

  // Add the new parameter
  func.parameters.push({
    ...parameter,
    id: uuidv4(),
  });

  updateFormulaExpression();
};

// Update drop handling
const onDrop = (event, funcIndex = null) => {
  if (!draggedItem.value) return;

  if (funcIndex !== null) {
    // Dropping into a function
    handleFunctionDrop(funcIndex, draggedItem.value);
  } else {
    // Dropping into main formula area
    formulaElements.value.push({
      ...draggedItem.value,
      id: uuidv4(),
    });
  }

  draggedItem.value = null;
  updateFormulaExpression();
};

// Update remove element function
const removeElement = (index, funcIndex = null, paramIndex = null) => {
  if (funcIndex !== null && paramIndex !== null) {
    // Remove parameter from function
    const func = formulaElements.value[funcIndex];
    if (!func.parameters) return;

    // Remove the parameter and adjacent comma if exists
    func.parameters.splice(paramIndex, 1);

    // Clean up commas
    if (func.parameters.length > 0) {
      func.parameters = func.parameters.filter(
        (p, i) => !p.isComma || (i < func.parameters.length - 1 && i > 0)
      );
    }
  } else {
    // Remove element from main formula
    formulaElements.value.splice(index, 1);
  }

  updateFormulaExpression();
};

// Add watch for formula elements to update expression
watch(
  formulaElements,
  () => {
    updateFormulaExpression();
  },
  { deep: true }
);

// Clear formula
const clearFormula = () => {
  formulaElements.value = [];
  activeFunctionIndex.value = null;
  updateFormulaExpression();
};

// Variable types
const variableTypes = [
  { value: "number", label: "Number" },
  { value: "percentage", label: "Percentage" },
  { value: "score", label: "Score" },
];

const isSubmitting = ref(false);
const formulaError = ref("");
const testResult = ref(null);

const addVariable = () => {
  formula.value.variables.push({
    name: "",
    description: "",
    weight: 1,
    type: "number",
  });
};

const removeVariable = (index) => {
  formula.value.variables.splice(index, 1);
};

// Test the formula with sample values
const testFormula = () => {
  try {
    const scope = {};

    const result = math.evaluate(formula.value.formulaExpression, scope);
    testResult.value = {
      success: true,
      value: result,
      expression: formula.value.formulaExpression,
    };
    formulaError.value = "";
  } catch (error) {
    testResult.value = null;
    formulaError.value = error.message;
  }
};

const validateFormula = () => {
  try {
    const scope = {};
    formula.value.variables.forEach((variable) => {
      scope[variable.name] = 1;
    });
    math.evaluate(formula.value.formulaExpression, scope);
    return true;
  } catch (error) {
    return false;
  }
};

const submitForm = async (formData) => {
  if (!validateFormula()) {
    formulaError.value = "Invalid formula expression";
    return;
  }

  try {
    isSubmitting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Formula saved:", formData);
    await router.push("/formula");
  } catch (error) {
    console.error("Error saving formula:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Organize functions by category
const functionCategories = ref([
  {
    name: "Basic Math",
    functions: [
      {
        id: "fn1",
        type: "function",
        name: "sqrt",
        description: "Square root",
        template: "sqrt()",
        minParams: 1,
        maxParams: 1,
        example: "√x",
      },
      {
        id: "fn2",
        type: "function",
        name: "pow",
        description: "Power",
        template: "pow()",
        minParams: 2,
        maxParams: 2,
        example: "x^y",
      },
      {
        id: "fn3",
        type: "function",
        name: "abs",
        description: "Absolute",
        template: "abs()",
        minParams: 1,
        maxParams: 1,
        example: "|x|",
      },
      {
        id: "fn4",
        type: "function",
        name: "round",
        description: "Round",
        template: "round()",
        minParams: 1,
        maxParams: 1,
        example: "⌊x⌉",
      },
      {
        id: "fn5",
        type: "function",
        name: "floor",
        description: "Floor",
        template: "floor()",
        minParams: 1,
        maxParams: 1,
        example: "⌊x⌋",
      },
      {
        id: "fn6",
        type: "function",
        name: "ceil",
        description: "Ceiling",
        template: "ceil()",
        minParams: 1,
        maxParams: 1,
        example: "⌈x⌉",
      },
    ],
  },
  {
    name: "Advanced Math",
    functions: [
      {
        id: "fn7",
        type: "function",
        name: "log",
        description: "Logarithm",
        template: "log()",
        minParams: 1,
        maxParams: 1,
        example: "ln(x)",
      },
      {
        id: "fn8",
        type: "function",
        name: "exp",
        description: "Exponential",
        template: "exp()",
        minParams: 1,
        maxParams: 1,
        example: "e^x",
      },
      {
        id: "fn9",
        type: "function",
        name: "sin",
        description: "Sine",
        template: "sin()",
        minParams: 1,
        maxParams: 1,
        example: "sin(x)",
      },
      {
        id: "fn10",
        type: "function",
        name: "cos",
        description: "Cosine",
        template: "cos()",
        minParams: 1,
        maxParams: 1,
        example: "cos(x)",
      },
      {
        id: "fn11",
        type: "function",
        name: "tan",
        description: "Tangent",
        template: "tan()",
        minParams: 1,
        maxParams: 1,
        example: "tan(x)",
      },
    ],
  },
  {
    name: "Statistics",
    functions: [
      {
        id: "fn12",
        type: "function",
        name: "mean",
        description: "Average",
        template: "mean()",
        minParams: 1,
        maxParams: null,
        example: "avg(x,y,...)",
      },
      {
        id: "fn13",
        type: "function",
        name: "median",
        description: "Middle value",
        template: "median()",
        minParams: 1,
        maxParams: null,
        example: "middle(x,y,...)",
      },
      {
        id: "fn14",
        type: "function",
        name: "std",
        description: "Standard deviation",
        template: "std()",
        minParams: 1,
        maxParams: null,
        example: "σ(x,y,...)",
      },
      {
        id: "fn15",
        type: "function",
        name: "var",
        description: "Variance",
        template: "var()",
        minParams: 1,
        maxParams: null,
        example: "var(x,y,...)",
      },
      {
        id: "fn16",
        type: "function",
        name: "max",
        description: "Maximum",
        template: "max()",
        minParams: 1,
        maxParams: null,
        example: "max(x,y,...)",
      },
      {
        id: "fn17",
        type: "function",
        name: "min",
        description: "Minimum",
        template: "min()",
        minParams: 1,
        maxParams: null,
        example: "min(x,y,...)",
      },
    ],
  },
  {
    name: "CBTM Specific",
    functions: [
      {
        id: "fn18",
        type: "function",
        name: "weightedAvg",
        description: "Weighted Average",
        template: "weightedAvg()",
        minParams: 1,
        maxParams: null,
        example: "w_avg(x,w,...)",
      },
      {
        id: "fn19",
        type: "function",
        name: "percentile",
        description: "Percentile Rank",
        template: "percentile()",
        minParams: 2,
        maxParams: 2,
        example: "pct(x,p)",
      },
      {
        id: "fn20",
        type: "function",
        name: "normalize",
        description: "Normalize Score",
        template: "normalize()",
        minParams: 3,
        maxParams: 3,
        example: "norm(x,min,max)",
      },
      {
        id: "fn21",
        type: "function",
        name: "growth",
        description: "Growth Rate",
        template: "growth()",
        minParams: 2,
        maxParams: 2,
        example: "growth(new,old)",
      },
    ],
  },
  {
    name: "Aggregation",
    functions: [
      {
        id: "fn22",
        type: "function",
        name: "sum",
        description: "Sum values",
        template: "sum()",
        minParams: 1,
        maxParams: null,
        example: "∑(x,y,...)",
      },
      {
        id: "fn23",
        type: "function",
        name: "product",
        description: "Product",
        template: "product()",
        minParams: 1,
        maxParams: null,
        example: "∏(x,y,...)",
      },
      {
        id: "fn24",
        type: "function",
        name: "count",
        description: "Count values",
        template: "count()",
        minParams: 1,
        maxParams: null,
        example: "count(x,y,...)",
      },
      {
        id: "fn25",
        type: "function",
        name: "distinct",
        description: "Unique values",
        template: "distinct()",
        minParams: 1,
        maxParams: null,
        example: "unique(x,y,...)",
      },
    ],
  },
]);

// Add constants for common values
const mathConstants = ref([
  { id: "const1", name: "π", value: Math.PI, description: "Pi constant" },
  { id: "const2", name: "e", value: Math.E, description: "Euler's number" },
  { id: "const3", name: "100%", value: 100, description: "Percentage base" },
  { id: "const4", name: "0.5", value: 0.5, description: "Half" },
]);

// Add tooltip position logic
const getTooltipPosition = (event) => {
  const rect = event.target.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  // If tooltip would go off-screen to the right, show it on the left instead
  if (rect.right + 200 > viewportWidth) {
    // 200px is approximate tooltip width
    return "right-full right-2";
  }
  return "left-full ml-2";
};

const tooltipPosition = ref("left-full ml-2");

const updateTooltipPosition = (event) => {
  tooltipPosition.value = getTooltipPosition(event);
};

// Add tab for predefined formulas
const activeTab = ref("predefined"); // 'predefined', 'functions', 'operators', 'variables'

// Keep the predefined formulas
const predefinedFormulas = ref([
  {
    id: "cbtm1",
    name: "Competency Score",
    description: "Calculate average competency score from assessors",
    displayFormula: "mean(assessor1_score, assessor2_score, assessor3_score)",
    elements: [
      {
        type: "function",
        name: "mean",
        parameters: [
          { type: "variable", name: "assessor1_score" },
          { type: "operator", symbol: "," },
          { type: "variable", name: "assessor2_score" },
          { type: "operator", symbol: "," },
          { type: "variable", name: "assessor3_score" },
        ],
      },
    ],
    variables: ["assessor1_score", "assessor2_score", "assessor3_score"],
  },
  {
    id: "cbtm2",
    name: "Competency Gap",
    description: "Calculate gap between required and current skill level",
    displayFormula: "abs(required_level - current_level)",
    elements: [
      {
        type: "function",
        name: "abs",
        parameters: [
          { type: "variable", name: "required_level" },
          { type: "operator", symbol: "-" },
          { type: "variable", name: "current_level" },
        ],
      },
    ],
    variables: ["required_level", "current_level"],
  },
  {
    id: "cbtm3",
    name: "Weighted Competency Score",
    description: "Calculate weighted average of competency scores",
    displayFormula:
      "(score1 * weight1 + score2 * weight2) / (weight1 + weight2)",
    elements: [
      { type: "operator", symbol: "(" },
      { type: "variable", name: "score1" },
      { type: "operator", symbol: "*" },
      { type: "variable", name: "weight1" },
      { type: "operator", symbol: "+" },
      { type: "variable", name: "score2" },
      { type: "operator", symbol: "*" },
      { type: "variable", name: "weight2" },
      { type: "operator", symbol: ")" },
      { type: "operator", symbol: "/" },
      { type: "operator", symbol: "(" },
      { type: "variable", name: "weight1" },
      { type: "operator", symbol: "+" },
      { type: "variable", name: "weight2" },
      { type: "operator", symbol: ")" },
    ],
    variables: ["score1", "score2", "weight1", "weight2"],
  },
  {
    id: "cbtm4",
    name: "Performance Index",
    description: "Calculate overall performance index",
    displayFormula: "(competency_score * 0.6) + (kpi_score * 0.4)",
    elements: [
      { type: "operator", symbol: "(" },
      { type: "variable", name: "competency_score" },
      { type: "operator", symbol: "*" },
      { type: "variable", name: "0.6" },
      { type: "operator", symbol: ")" },
      { type: "operator", symbol: "+" },
      { type: "operator", symbol: "(" },
      { type: "variable", name: "kpi_score" },
      { type: "operator", symbol: "*" },
      { type: "variable", name: "0.4" },
      { type: "operator", symbol: ")" },
    ],
    variables: ["competency_score", "kpi_score"],
  },
  {
    id: "cbtm5",
    name: "Growth Rate",
    description: "Calculate competency growth rate",
    displayFormula: "((new_score - old_score) / old_score) * 100",
    elements: [
      { type: "operator", symbol: "(" },
      { type: "operator", symbol: "(" },
      { type: "variable", name: "new_score" },
      { type: "operator", symbol: "-" },
      { type: "variable", name: "old_score" },
      { type: "operator", symbol: ")" },
      { type: "operator", symbol: "/" },
      { type: "variable", name: "old_score" },
      { type: "operator", symbol: ")" },
      { type: "operator", symbol: "*" },
      { type: "variable", name: "100" },
    ],
    variables: ["new_score", "old_score"],
  },
]);

// Update load predefined formula function
const loadPredefinedFormula = (presetFormula) => {
  // Clear existing formula
  formulaElements.value = [];

  // Add each element with a new ID
  presetFormula.elements.forEach((element) => {
    if (element.type === "function") {
      // Handle function with parameters
      const newFunc = {
        ...element,
        id: uuidv4(),
        parameters: element.parameters.map((param) => ({
          ...param,
          id: uuidv4(),
        })),
      };
      formulaElements.value.push(newFunc);
    } else {
      // Handle regular elements
      formulaElements.value.push({
        ...element,
        id: uuidv4(),
      });
    }
  });

  updateFormulaExpression();
};

// Group operators by type
const operatorGroups = ref([
  {
    name: "Basic",
    operators: [
      { id: "op1", symbol: "+", description: "Addition" },
      { id: "op2", symbol: "-", description: "Subtraction" },
      { id: "op3", symbol: "*", description: "Multiplication" },
      { id: "op4", symbol: "/", description: "Division" },
    ],
  },
  {
    name: "Grouping",
    operators: [
      { id: "op5", symbol: "(", description: "Open Parenthesis" },
      { id: "op6", symbol: ")", description: "Close Parenthesis" },
      { id: "op7", symbol: ",", description: "Separator" },
    ],
  },
]);

// Add this after mathConstants ref
const customVariables = ref([
  {
    id: "custom1",
    name: "Score_1",
    value: 85,
    description: "First assessment score",
  },
  {
    id: "custom2",
    name: "Weight_1",
    value: 0.6,
    description: "Weight for first score",
  },
  {
    id: "custom3",
    name: "Score_2",
    value: 92,
    description: "Second assessment score",
  },
  {
    id: "custom4",
    name: "Weight_2",
    value: 0.4,
    description: "Weight for second score",
  },
]);
</script>

<template>
  <div>
    <Breadcrumb />

    <rs-card class="p-5">
      <!-- Header with clear button -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold">Formula Builder</h2>
          <p class="text-gray-600">
            Create mathematical formulas by dragging and dropping elements
          </p>
        </div>
        <rs-button
          variant="danger-outline"
          size="sm"
          @click="formulaElements = []"
        >
          Clear Formula
        </rs-button>
      </div>

      <!-- Main grid layout -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Left sidebar - Building blocks -->
        <div class="col-span-4 border rounded-lg bg-white">
          <!-- Tabs -->
          <div class="flex border-b overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in [
                'Predefined',
                'Functions',
                'Operators',
                'Variables',
              ]"
              :key="tab"
              class="flex-none px-6 py-2 text-sm font-medium whitespace-nowrap"
              :class="{
                'border-b-2 border-blue-500 text-blue-600':
                  activeTab === tab.toLowerCase(),
                'text-gray-500 hover:text-gray-700':
                  activeTab !== tab.toLowerCase(),
              }"
              @click="activeTab = tab.toLowerCase()"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Tab content -->
          <div class="p-4">
            <!-- Predefined Formulas Tab -->
            <div v-if="activeTab === 'predefined'" class="space-y-4">
              <div
                v-for="preset in predefinedFormulas"
                :key="preset.id"
                class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                @click="loadPredefinedFormula(preset)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-blue-600">{{ preset.name }}</h4>
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click.stop="loadPredefinedFormula(preset)"
                  >
                    Use
                  </rs-button>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                  {{ preset.description }}
                </p>
                <div class="bg-gray-50 rounded p-2 mb-2">
                  <code class="text-sm font-mono">{{
                    preset.displayFormula
                  }}</code>
                </div>
                <div class="text-xs text-gray-500">
                  Variables: {{ preset.variables.join(", ") }}
                </div>
              </div>
            </div>

            <!-- Functions Tab -->
            <div v-if="activeTab === 'functions'" class="space-y-4">
              <div v-for="category in functionCategories" :key="category.name">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-medium text-sm text-gray-700">
                    {{ category.name }}
                  </h3>
                  <div class="flex-1 border-t border-gray-200"></div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="func in category.functions"
                    :key="func.id"
                    class="drag-item bg-purple-50 p-2 rounded border border-purple-100 cursor-move hover:bg-purple-100 transition-colors group relative"
                    draggable="true"
                    @dragstart="onDragStart(func)"
                    @dragend="onDragEnd"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-mono">{{ func.name }}()</span>
                      <span class="text-xs text-purple-600">{{
                        func.example
                      }}</span>
                    </div>
                    <!-- Tooltip -->
                    <div
                      class="hidden group-hover:block absolute z-10 bg-white border rounded-lg shadow-lg p-2 w-48 text-sm left-full ml-2"
                    >
                      <p class="font-medium">{{ func.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Operators Tab -->
            <div v-if="activeTab === 'operators'" class="space-y-4">
              <div v-for="group in operatorGroups" :key="group.name">
                <h3 class="font-medium text-sm text-gray-700 mb-2">
                  {{ group.name }}
                </h3>
                <div class="grid grid-cols-4 gap-2">
                  <div
                    v-for="op in group.operators"
                    :key="op.id"
                    class="drag-item bg-green-50 p-2 rounded border border-green-100 cursor-move hover:bg-green-100 transition-colors text-center"
                    draggable="true"
                    @dragstart="onDragStart({ type: 'operator', ...op })"
                    @dragend="onDragEnd"
                  >
                    {{ op.symbol }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Variables Tab -->
            <div v-if="activeTab === 'variables'" class="space-y-4">
              <!-- Formula Variables -->
              <div>
                <h3 class="font-medium text-sm text-gray-700 mb-2">
                  Formula Variables
                </h3>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="variable in availableElements.variables"
                    :key="variable.id"
                    class="drag-item bg-blue-50 p-2 rounded border border-blue-100 cursor-move hover:bg-blue-100 transition-colors"
                    draggable="true"
                    @dragstart="onDragStart(variable)"
                    @dragend="onDragEnd"
                  >
                    {{ variable.name }}
                  </div>
                </div>
              </div>

              <!-- Custom Variables Section -->
              <div class="mt-4">
                <h3 class="font-medium text-sm text-gray-700 mb-2">
                  Custom Variables
                </h3>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="variable in customVariables"
                    :key="variable.id"
                    class="drag-item bg-indigo-50 p-2 rounded border border-indigo-100 cursor-move hover:bg-indigo-100 transition-colors group relative"
                    draggable="true"
                    @dragstart="
                      onDragStart({
                        type: 'variable',
                        name: variable.value.toString(),
                      })
                    "
                    @dragend="onDragEnd"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ variable.name }}</span>
                      <span class="text-sm text-gray-600">{{
                        variable.value
                      }}</span>
                    </div>
                    <!-- Tooltip -->
                    <div
                      class="hidden group-hover:block absolute z-10 bg-white border rounded-lg shadow-lg p-2 w-48 text-sm left-full ml-2"
                    >
                      <p>{{ variable.description }}</p>
                      <p class="text-gray-600">Value: {{ variable.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Constants Section -->
              <div class="mt-4">
                <h3 class="font-medium text-sm text-gray-700 mb-2">
                  Constants
                </h3>
                <div class="grid grid-cols-4 gap-2">
                  <div
                    v-for="constant in mathConstants"
                    :key="constant.id"
                    class="drag-item bg-yellow-50 p-2 rounded border border-yellow-100 cursor-move hover:bg-yellow-100 transition-colors text-center"
                    draggable="true"
                    @dragstart="
                      onDragStart({
                        type: 'variable',
                        name: constant.value.toString(),
                      })
                    "
                    @dragend="onDragEnd"
                  >
                    {{ constant.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center - Formula Building Area -->
        <div class="col-span-8">
          <div class="bg-white border rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Formula Expression</h3>
              <rs-button
                variant="danger-outline"
                size="sm"
                @click="formulaElements = []"
              >
                Clear
              </rs-button>
            </div>

            <!-- Formula Building Area -->
            <div
              class="min-h-[200px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 mb-4"
              :class="{ 'border-blue-300 bg-blue-50': isDragging }"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <div class="flex flex-wrap gap-2">
                <template
                  v-for="(element, index) in formulaElements"
                  :key="element.id"
                >
                  <!-- Function Element -->
                  <div
                    v-if="element.type === 'function'"
                    class="drag-item p-2 rounded bg-purple-100"
                  >
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ element.name }}</span>
                      <span>(</span>
                      <!-- Function Parameters Drop Area -->
                      <div
                        class="inline-flex flex-wrap gap-1 min-w-[40px] min-h-[24px] bg-purple-50 rounded px-2 py-1"
                        @dragover.prevent
                        @drop.prevent="(e) => onDrop(e, index)"
                      >
                        <template
                          v-for="(param, pIndex) in element.parameters"
                          :key="param.id"
                        >
                          <div
                            class="drag-item p-1 rounded flex items-center gap-1"
                            :class="{
                              'bg-blue-100': param.type === 'variable',
                              'bg-green-100': param.type === 'operator',
                              'text-gray-400': param.isComma,
                            }"
                          >
                            <span>{{ param.name || param.symbol }}</span>
                            <button
                              v-if="!param.isComma"
                              @click="removeElement(index, index, pIndex)"
                              class="text-gray-500 hover:text-red-500"
                            >
                              <Icon name="ph:x" class="w-3 h-3" />
                            </button>
                          </div>
                        </template>
                      </div>
                      <span>)</span>
                      <button
                        @click="removeElement(index)"
                        class="text-gray-500 hover:text-red-500"
                      >
                        <Icon name="ph:x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Non-Function Elements -->
                  <div
                    v-else
                    class="drag-item p-2 rounded cursor-move flex items-center gap-2"
                    :class="{
                      'bg-blue-100': element.type === 'variable',
                      'bg-green-100': element.type === 'operator',
                    }"
                  >
                    <span>{{
                      element.type === "operator"
                        ? element.symbol
                        : element.name
                    }}</span>
                    <button
                      @click="removeElement(index)"
                      class="text-gray-500 hover:text-red-500"
                    >
                      <Icon name="ph:x" class="w-4 h-4" />
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- Generated Expression -->
            <FormKit
              type="textarea"
              name="formulaExpression"
              label="Generated Expression"
              v-model="formula.formulaExpression"
              :disabled="true"
              class="font-mono"
            />
          </div>

          <!-- Testing Section -->
          <div class="mt-4 bg-white border rounded-lg p-4">
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Test Formula</h3>
              <rs-button variant="secondary" size="sm" @click="testFormula">
                Run Test
              </rs-button>
            </div>
            <div
              v-if="formulaError"
              class="mt-2 text-red-500 p-2 bg-red-50 rounded"
            >
              {{ formulaError }}
            </div>

            <div v-if="testResult" class="mt-2 p-4 bg-gray-50 rounded-lg">
              <pre class="mt-2 p-2 bg-white rounded">{{
                JSON.stringify(testResult, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped>
.drag-item {
  @apply shadow-sm transition-all duration-200;

  &:hover {
    @apply shadow-md;
  }
}

.formula-area {
  @apply transition-all duration-200;

  &.dragging {
    @apply border-blue-300 bg-blue-50;
  }
}

.tab-button {
  @apply transition-all duration-200;

  &:hover {
    @apply bg-gray-50;
  }

  &.active {
    @apply bg-blue-50 text-blue-600;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
