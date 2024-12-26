<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const isVertical = ref(true);
const isDesktop = ref(true);

const emit = defineEmits(["toggleMenu"]);

// const { locale } = useI18n();
// const colorMode = useColorMode();
const langList = languageList();

const locale = ref("en");

const themes = themeList();

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function rgbToHex(rgbString) {
  // Split the input string into an array of components
  const rgbArray = rgbString.split(",");

  // Convert each component to its numeric value
  const r = parseInt(rgbArray[0].trim(), 10);
  const g = parseInt(rgbArray[1].trim(), 10);
  const b = parseInt(rgbArray[2].trim(), 10);

  // Convert the numeric RGB values to hexadecimal
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // Concatenate the components and return the final hexadecimal color code
  return `#${rHex}${gHex}${bHex}`;
}

// Toggle Open/Close menu
const toggleMenu = (event) => {
  emit("toggleMenu", event);
};

// Focus on search input
function toggleSearch() {
  document.getElementById("header-search").value = "";
  document.getElementById("header-search").focus();
}

// Change language
const changeLanguage = (lang) => {
  locale.value = lang;
};

const languageNow = computed(() => {
  return langList.find((lang) => lang.value == locale.value);
});

onMounted(() => {
  // If mobile toggleMenu
  if (window.innerWidth < 768) {
    emit("toggleMenu", true);
  }
});
</script>

<template>
  <div class="w-header">
    <div class="flex items-stretch justify-between">
      <div v-if="isVertical" class="flex">
        <span class="flex items-center justify-center">
          <button class="icon-btn h-10 w-10 rounded-full" @click="toggleMenu">
            <Icon name="ic:round-menu" class="" /></button
        ></span>
      </div>
      <div class="flex" v-else>
        <nuxt-link to="/">
          <div class="flex flex-auto gap-3 justify-center items-center">
            <!-- <img
              class="h-24 block"
              src="@/assets/img/logo/logo-full-transparent.webp"
              alt=""
            /> -->
          </div>
        </nuxt-link>
      </div>

      <div class="flex gap-2 items-center justify-end">
        <VDropdown placement="bottom-end" distance="13" name="profile">
          <button
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              class="w-9 h-9 object-cover rounded-full border-2 border-gray-200"
              :src="`https://ui-avatars.com/api/?name=${userStore.username}&background=random`"
            />
            <div v-if="isDesktop" class="ml-3 text-left">
              <p
                class="font-medium text-sm text-gray-900 truncate max-w-[150px]"
              >
                {{ userStore.username }}
              </p>
              <p class="text-xs text-gray-500 truncate max-w-[150px]">
                {{ userStore.roles[0] }}
              </p>
            </div>
            <Icon
              name="ic:outline-keyboard-arrow-down"
              class="ml-2 text-gray-400"
            />
          </button>
          <template #popper>
            <ul
              class="py-2 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[200px]"
            >
              <li>
                <a
                  href="/logout"
                  class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="ic:outline-logout" class="mr-3 text-gray-400" />
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </template>
        </VDropdown>
      </div>
    </div>
  </div>

  <!-- Search Nav for Layout Vertical -->
  <div tabindex="0" class="w-header-search">
    <Icon name="ic:outline-search" class="mr-3" />
    <FormKit
      id="header-search"
      :classes="{
        outer: 'mb-0 flex-1',
      }"
      type="search"
      placeholder="Search..."
    />
  </div>
</template>

<style scoped>
:deep(.popper) {
  background: #e92791;
  padding: 20px;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}

:deep(.popper #arrow::before) {
  background: #e92791;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  background: #e92791;
}
</style>
