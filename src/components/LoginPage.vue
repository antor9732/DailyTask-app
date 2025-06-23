<template>
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
    <div style="margin-top:10px;">
      <router-link to="/register">Don't have an account? Register</router-link>
    </div>
  </div>
</template>

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
    username.value === user.username &&
    password.value === user.password
  ) {
    router.push("/daily-update");
  } else {
    alert("Invalid User ID or Password");
  }
}
</script>

<style scoped>
.login-wrapper {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
