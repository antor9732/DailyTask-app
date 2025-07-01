<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user")) || {};

const form = reactive({
  name: user.name || "",
  gmail: user.gmail || "",
  username: user.username || "",
  role: user.role || "",
  designation: user.designation || "",
  company: user.company || "",
  profileImage: user.profileImage || "",
});

const showModal = ref(false);

function onImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.profileImage = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleSave() {
  if (!form.name || !form.gmail || !form.username) {
    alert("Please fill all fields");
    return;
  }
  localStorage.setItem("user", JSON.stringify(form));
  showModal.value = true;
  setTimeout(() => {
    showModal.value = false;
    router.push("/profile");
  }, 1500);
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
      style="border-radius: 16px; background: #fff"
    >
      <h1 class="mb-4 text-center fw-bold" style="color: #4f46e5">
        Edit Profile
      </h1>
      <div v-if="form.profileImage" class="text-center mt-2">
        <img
          :src="form.profileImage"
          alt="Preview"
          class="rounded-circle border border-2"
          style="
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-color: #4caf50;
          "
        />
      </div>
      <form @submit.prevent="handleSave">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="name" class="form-label fw-semibold">Full Name</label>
            <input
              id="name"
              type="text"
              v-model="form.name"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="gmail" class="form-label fw-semibold">Gmail</label>
            <input
              id="gmail"
              type="email"
              v-model="form.gmail"
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="username" class="form-label fw-semibold"
              >Username</label
            >
            <input
              id="username"
              type="text"
              v-model="form.username"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="role" class="form-label fw-semibold">User Role</label>
            <input
              id="role"
              type="text"
              v-model="form.role"
              class="form-control"
              placeholder="e.g. admin, user"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="designation" class="form-label fw-semibold"
              >Designation</label
            >
            <input
              id="designation"
              type="text"
              v-model="form.designation"
              class="form-control"
              placeholder="e.g. Developer"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="company" class="form-label fw-semibold"
              >Company Name</label
            >
            <input
              id="company"
              type="text"
              v-model="form.company"
              class="form-control"
              placeholder="e.g. ABC Ltd."
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="profileImage" class="form-label fw-semibold"
            >Profile Image</label
          >
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            @change="onImageChange"
            class="form-control"
          />
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-success px-4 fw-semibold">
            Save
          </button>
        </div>
      </form>
    </div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background: rgba(0, 0, 0, 0.3); z-index: 9999"
    >
      <div class="bg-white p-4 rounded shadow text-center">
        <h2 class="mb-2" style="color: #4caf50">Profile updated!</h2>
        <p>Your profile has been updated successfully.</p>
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
