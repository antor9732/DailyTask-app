<script setup>
import { ref } from "vue";
import defaultImage from "../assets/imgs/default-profile.svg";

const user = ref(JSON.parse(localStorage.getItem("user")));
</script>

<template>
  <div
    class="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
    style="background: linear-gradient(120deg, #a18cd1 0%, #9333ea 100%)">
    <div
      v-if="user"
      class="card text-center shadow-lg p-4 border-0"
      style="
        border-radius: 18px;
        max-width: 550px;
        width: 100%;
        background: #fff; ">

      <img
        :src="user.profileImage || defaultImage"
        alt="Profile"
        class="rounded-circle border border-3 mb-3 mx-auto d-block"
        style="
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-color: #9333ea;
        "
      />
      <h2 class="mb-2 fw-bold" style="color: #4f46e5">{{ user.name }}</h2>
      <p class="mb-1" style="color: #333; font-size: 1.05rem">
        <strong>Gmail:</strong> {{ user.gmail }}
      </p>
      <p class="mb-1" style="color: #333; font-size: 1.05rem">
        <strong>Username:</strong> {{ user.username }}
      </p>
      <p class="mb-1" style="color: #333; font-size: 1.05rem">
        <strong>Role:</strong> {{ user.role || '-' }}
      </p>
      <p class="mb-1" style="color: #333; font-size: 1.05rem">
        <strong>Designation:</strong> {{ user.designation || '-' }}
      </p>
      <p class="mb-0" style="color: #333; font-size: 1.05rem">
        <strong>Company Name:</strong> {{ user.company || '-' }}
      </p>
      <button class="btn btn-outline-primary mt-3 px-4 fw-semibold" @click="$router.push('/profile-edit')">
        Edit Profile
      </button>
    </div>
    <div
      v-else
      class="text-white text-center p-4 rounded-3 shadow-lg"
      style="background: rgba(0, 0, 0, 0.2); font-size: 1.2rem"
    >
      <p>No user found. Please login.</p>
    </div>
  </div>
</template>
