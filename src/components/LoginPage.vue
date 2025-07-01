<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMsg = ref("");
const router = useRouter();

function handleLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (
    user &&
    (username.value === user.username || username.value === user.gmail) &&
    password.value === user.password
  ) {
    errorMsg.value = "";
    window.dispatchEvent(new Event("storage"));
    router.push("/daily-update");
  } else {
    errorMsg.value = "Invalid User ID or Password";
  }
}
</script>

<template>
  <div
    class="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
    style="
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientMove 12s ease infinite;
    "
  >
    <div
      class="card shadow-lg p-4 border-0 w-100"
      style="max-width: 400px; border-radius: 14px; background: #fff"
    >
      <h1 class="mb-4 text-center fw-bold" style="color: #4f46e5">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label fw-semibold">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="form-control"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label fw-semibold">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div v-if="errorMsg" class="alert alert-danger py-2 mb-2" role="alert">
          {{ errorMsg }}
        </div>
        <div class="d-flex justify-content-end mb-2">
          <button type="submit" class="btn btn-success px-4 fw-semibold">
            Login
          </button>
        </div>
      </form>
      <div class="text-center mt-2">
        <router-link to="/register"
          >Don't have an account? Register</router-link
        >
      </div>
    </div>
  </div>
</template>

<style>
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
