<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

function handleLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (
    user &&
    (
      username.value === user.username ||
      username.value === user.gmail
    ) &&
    password.value === user.password
  ) {
    router.push("/daily-update");
  } else {
    alert("Invalid User ID or Password");
  }
}
</script>

<template>
  <div class="bg-animated"></div>
  <div class="login-wrapper">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div class="actions">
        <button type="submit" class="btn primary">Login</button>
      </div>
    </form>
    <div style="margin-top: 10px">
      <router-link to="/register">Don't have an account? Register</router-link>
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

.login-wrapper {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.13);
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  text-align: right;
}

.btn.primary {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary:hover {
  background-color: #45a049;
}
</style>
