<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const gmail = ref("");
const username = ref("");
const password = ref("");
const repassword = ref("");
const role = ref("employee"); // Default role
const router = useRouter();

const showModal = ref(false);

function handleRegister() {
  if (
    !name.value ||
    !gmail.value ||
    !username.value ||
    !password.value ||
    !repassword.value
  ) {
    alert("Please fill all fields");
    return;
  }
  if (password.value !== repassword.value) {
    alert("Passwords do not match");
    return;
  }
  // Save user to localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({
      name: name.value,
      gmail: gmail.value,
      username: username.value,
      password: password.value,
      role: role.value,
    })
  );
  showModal.value = true;
  setTimeout(() => {
    showModal.value = false;
    router.push("/");
  }, 1500);
}
</script>

<template>
  <div class="bg-animated"></div>
  <div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div
      class="card shadow p-4"
      style="max-width: 550px; width: 100%; z-index: 1"
    >
      <h1 class="mb-4 text-center">Registration</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            v-model="name"
            class="form-control"
            placeholder="Enter your name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="gmail" class="form-label">Gmail</label>
          <input
            id="gmail"
            type="email"
            v-model="gmail"
            class="form-control"
            placeholder="Enter your Gmail"
            required
          />
        </div>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="form-control"
            placeholder="Choose a username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="role" class="form-label">Role</label>
          <select id="role" v-model="role" class="form-select" required>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="form-control"
            placeholder="Enter password"
            required
          />
        </div>
        <div class="mb-3">
          <label for="repassword" class="form-label">Re-type Password</label>
          <input
            id="repassword"
            type="password"
            v-model="repassword"
            class="form-control"
            placeholder="Re-enter password"
            required
          />
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-success">Register</button>
        </div>
      </form>
      <div class="mt-3 text-center">
        <router-link to="/">Already have an account? Login</router-link>
      </div>
    </div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.3)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4">
          <h2 class="mb-2">Registration successful!</h2>
          <p>Please login to continue.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-animated {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientMove 12s ease infinite;
}
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
