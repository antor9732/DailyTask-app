<template>
  <div class="profile-bg">
    <div class="profile-card" v-if="user">
      <img
        :src="user.profileImage || defaultImage"
        alt="Profile"
        class="profile-img"
      />
      <h2>{{ user.name }}</h2>
      <p><strong>Gmail:</strong> {{ user.gmail }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
    </div>
    <div v-else class="no-user">
      <p>No user found. Please login.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import defaultImage from "../assets/antor.png";

const user = ref(JSON.parse(localStorage.getItem("user")));
</script>

<style scoped>
.profile-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.13);
  padding: 40px 32px 32px 32px;
  max-width: 350px;
  width: 100%;
  text-align: center;
}
.profile-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #9333ea;
  margin-bottom: 18px;
}
h2 {
  margin: 0 0 10px 0;
  color: #4f46e5;
}
p {
  margin: 8px 0;
  color: #333;
  font-size: 1.05rem;
}
.no-user {
  color: #fff;
  font-size: 1.2rem;
  background: rgba(0,0,0,0.2);
  padding: 30px 40px;
  border-radius: 12px;
}
</style>