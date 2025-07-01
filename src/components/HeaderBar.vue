<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import defaultImage from "../assets/imgs/default-profile.svg";

const router = useRouter();
const user = ref(null);
const showMenu = ref(false);

function loadUser() {
  user.value = JSON.parse(localStorage.getItem("user"));
}

onMounted(() => {
  loadUser();
   window.addEventListener("storage", loadUser);
});

window.dispatchEvent(new Event("storage"));

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  localStorage.removeItem("user");
  router.push("/");
  window.location.reload();
}
</script>

<template>
  <header class="header-bar" v-if="user">
    <a class="left" href="/daily-update">
      <svg class="calendar-check"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 448 512"
        fill="currentColor"
      >
        <path
          d="M128 0c13.3 0 24 10.7 24
             24v40h144V24c0-13.3 10.7-24 24-24s24 10.7 24 
             24v40h40c35.3 0 64 28.7 64 64v320c0 35.3-28.7
              64-64 64H64c-35.3 0-64-28.7-64-64V128c0-35.3 28.7-64
               64-64h40V24c0-13.3 10.7-24 24-24m272 192H48v256c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16zm-71 105L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47l95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
        />
      </svg>
      <span class="app-title">Daily Task</span>
    </a>
   
    <div class="right">
      <div class="profile-area" @click="toggleMenu">
        <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 20 20">
          <path
            d="M5 8l5 5 5-5"
            stroke="currentcolor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
        <span class="username">{{ user.name || user.username }}</span>
        <img
          :src="user.profileImage || defaultImage"
          alt="Profile"
          class="profile-img"
        />
      </div>
      <div v-if="showMenu" class="dropdown-menu" @mouseleave="showMenu = false">
        <router-link to="/profile" class="dropdown-item">Profile</router-link>
        <router-link to="/profile-edit" class="dropdown-item">Edit Profile</router-link>
        <router-link to="/history" class="dropdown-item">History</router-link>
        <router-link v-if="user.role === 'admin'" to="/admin" class="dropdown-item">Admin Dashboard</router-link>
        <router-link to="/save-draft" class="dropdown-item">Save Draft</router-link>
        <a href="/" class="dropdown-item" @click.prevent="logout">Logout</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.left {
  color: white;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 8px;
}
.calendar-check {
  color: #fff;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #9333ea, #4f46e5);
  color: #fff;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.08);
  position: sticky; /* sticky position */
  top: 0; /* always stick to top */
  z-index: 1000;
}
.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.right {
  display: flex;
  align-items: center;
  position: relative;
}
.profile-area {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 14px 6px 8px;
  border-radius: 24px;
  transition: background 0.2s;
  position: relative;
}
.profile-area:hover {
  background: rgba(255, 255, 255, 0.18);
}
.profile-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.username {
  font-weight: 500;
  color: #fff;
  margin-right: 2px;
  font-size: 1rem;
  letter-spacing: 0.2px;
}
.dropdown-icon {
  margin-left: 2px;
  transition: transform 0.2s;
}
.profile-area:active .dropdown-icon,
.profile-area:focus .dropdown-icon {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: 54px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.13);
  min-width: 160px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.18s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dropdown-item {
  padding: 10px 24px;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f5f5f5;
  color: #388e3c;
}
.middle {
  display: flex;
  align-items: center;
}
.admin-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s;
}
.admin-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>