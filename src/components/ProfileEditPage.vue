<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user")) || {};

const form = reactive({
  name: user.name || "",
  gmail: user.gmail || "",
  username: user.username || "",
  profileImage: user.profileImage || ""
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
  // if (!form.gmail.endsWith("@gmail.com")) {
  //   alert("Please enter a valid Gmail address");
  //   return;
  // }
  localStorage.setItem("user", JSON.stringify(form));
  showModal.value = true;
  setTimeout(() => {
    showModal.value = false;
    router.push("/profile");
  }, 1500);
}
</script>

<template>
  <div class="bg-animated"></div>
  <div class="edit-wrapper">
    <h1>Edit Profile</h1>
    <form @submit.prevent="handleSave">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" type="text" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="gmail">Gmail</label>
        <input id="gmail" type="email" v-model="form.gmail" required />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="form.username" required />
      </div>
      <div class="form-group">
        <label for="profileImage">Profile Image</label>
        <input id="profileImage" type="file" accept="image/*" @change="onImageChange" />
        <div v-if="form.profileImage" class="preview">
          <img :src="form.profileImage" alt="Preview" />
        </div>
      </div>
      <div class="actions">
        <button type="submit" class="btn primary">Save</button>
      </div>
    </form>
  </div>
  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Profile updated!</h2>
      <p>Your profile has been updated successfully.</p>
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.edit-wrapper {
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
.form-group input[type="text"],
.form-group input[type="email"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.preview img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: 8px;
  object-fit: cover;
  border: 2px solid #4caf50;
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
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  text-align: center;
}
</style>