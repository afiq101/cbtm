<script setup>
import { useUserStore } from "~/stores/user";

import Menu from "~/navigation/index.js";
import RSItem from "~/components/layouts/sidemenu/Item.vue";

const userStore = useUserStore();

// const menuItem = Menu;

const props = defineProps({
  menuItem: {
    type: Array,
    default: () => Menu,
    required: false,
  },
});

onMounted(() => {
  try {
    const el = document.querySelector(".active-menu").closest(".menu-content");
    const elParent = el.parentElement.parentElement;

    if (elParent) {
      elParent.classList.remove("hide");
      elParent.querySelector("a").classList.add("nav-open");
    }
    if (el) el.classList.remove("hide");
  } catch (e) {
    // console.log(e);
    return;
  }
});
</script>

<template>
  <div class="vertical-menu">
    <div class="py-2 px-4">
      <nuxt-link to="/">
        <div class="flex flex-auto gap-3 justify-center items-center h-[48px]">
          <!-- <img
            class="h-10 block"
            src="@/assets/img/logo/logo-word-black.svg"
            alt=""
          /> -->
          <h2 class="text-2xl font-bold">CBTM</h2>
        </div>
      </nuxt-link>
    </div>

    <div class="flex flex-col justify-between mt-4">
      <nuxt-link
        to="/organization/1"
        class="flex items-center gap-x-3 px-3 border border-gray-200 rounded-lg p-2 mx-3 cursor-pointer hover:bg-gray-100"
      >
        <img
          :src="`https://ui-avatars.com/api/?name=${userStore.organization.name}&background=random`"
          alt="Avatar"
          class="h-8 w-8 object-cover rounded-full"
        />
        <div>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ userStore.organization.name }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ userStore.organization.email }}
          </p>
        </div>
      </nuxt-link>
    </div>

    <NuxtScrollbar
      class="flex flex-col justify-between mb-6 mt-3"
      style="max-height: 82dvh"
    >
      <RSItem :items="menuItem"></RSItem>
    </NuxtScrollbar>
  </div>
</template>
