export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $swal } = useNuxtApp();

  if (process.client) {
    // Validate every request to every page
    const res = await $fetch("/api/auth/validate", {
      method: "GET",
    });

    console.log("Validate User:", res);

    // If user is not logged in, redirect to logout page
    if (res.statusCode === 401) {
      $swal
        .fire({
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
          icon: "warning",
          confirmButtonText: "OK",
        })
        .then(() => {
          return window.location.replace("/logout");
        });
    }

    return true;
  }
});
