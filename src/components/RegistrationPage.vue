<template>
  <div class="login-wrapper">
    <h1>Registration</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" type="text" v-model="name" placeholder="Enter your name" required />
      </div>
      <div class="form-group">
        <label for="gmail">Gmail</label>
        <input id="gmail" type="email" v-model="gmail" placeholder="Enter your Gmail" required />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" placeholder="Choose a username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" placeholder="Enter password" required />
      </div>
      <div class="form-group">
        <label for="repassword">Re-type Password</label>
        <input id="repassword" type="password" v-model="repassword" placeholder="Re-enter password" required />
      </div>
      <div class="actions">
        <button type="submit" class="btn primary">Register</button>
      </div>
    </form>
    <div style="margin-top:10px;">
      <router-link to="/">Already have an account? Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const gmail = ref("");
const username = ref("");
const password = ref("");
const repassword = ref("");
const router = useRouter();

function handleRegister() {
  if (!name.value || !gmail.value || !username.value || !password.value || !repassword.value) {
    alert("Please fill all fields");
    return;
  }
  if (!gmail.value.endsWith("@gmail.com")) {
    alert("Please enter a valid Gmail address");
    return;
  }
  if (password.value !== repassword.value) {
    alert("Passwords do not match");
    return;
  }
  // Save user to localStorage
  localStorage.setItem("user", JSON.stringify({
    name: name.value,
    gmail: gmail.value,
    username: username.value,
    password: password.value
  }));
  alert("Registration successful! Please login.");
  router.push("/");
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