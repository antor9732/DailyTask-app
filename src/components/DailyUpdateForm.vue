<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user")) || {};

const form = reactive({
  date: new Date().toISOString().substr(0, 10),
  name: user.name || "",
  focus: "",
  timeSpent: [""],
  keyInsights: [""],
  planTomorrow: [""],
});

const showModal = ref(false); // Modal state

function addItem(section) {
  form[section].push("");
}

function isArrayFilled(arr) {
  return arr.every((item) => item && item.trim() !== "");
}

async function submitUpdate() {
  if (
    !form.date ||
    !form.name.trim() ||
    !form.focus.trim() ||
    !isArrayFilled(form.timeSpent) ||
    !isArrayFilled(form.keyInsights) ||
    !isArrayFilled(form.planTomorrow)
  ) {
    alert("Please fill all required fields!");
    return;
  }

  // Save to localStorage history
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ ...form });
  localStorage.setItem("history", JSON.stringify(history));

  showModal.value = true; // Show modal

  setTimeout(() => {
    showModal.value = false;
    router.push("/thank-you");
  }, 1500); // 1.5 second por Thank You page e
}
</script>

<template>
  <div class="update-wrapper">
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Submitted successfully!</h2>
      </div>
    </div>

    <div class="header">
      <h1>Daily Work Update</h1>
      <p>Submit your progress and plans</p>
    </div>

    <form @submit.prevent="submitUpdate">
      <div class="grid">
        <div class="form-group">
          <label class="label-icon" for="date">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-purple-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Update Date</label
          >
          <input id="date" type="date" v-model="form.date" />
        </div>
        <div class="form-group">
          <label class="label-icon" for="name">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-purple-500"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Employee Name</label
          >
          <input
            id="name"
            type="text"
            v-model="form.name"
            placeholder="Enter your Name"
            readonly
          />
        </div>
      </div>

      <div class="form-group">
        <label class="label-icon" for="focus">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 text-purple-500"
          >
            <path
              d="M12 15c-1.33-2-3.33-4-3.33-4S6.33 9.33 6 8a4 4 0 0 1 4-4c2 0 4 1.33 4 4S12 15 12 15z"
            ></path>
            <path
              d="M18.75 14.25c-1.25 0-2.5-1.25-2.5-2.5S17.5 9 18.75 9s2.5 1.25 2.5 2.5-1.25 2.5-2.5 2.5z"
            ></path>
            <path
              d="M14 18c0 1.25-1.25 2.5-2.5 2.5S9 19.25 9 18s1.25-2.5 2.5-2.5 2.5 1.25 2.5 2.5z"
            ></path>
            <path
              d="M18.75 9c1.25 0 2.5-1.25 2.5-2.5S20 4 18.75 4s-2.5 1.25-2.5 2.5 1.25 2.5 2.5 2.5z"
            ></path>
          </svg>
          Daily Focus (e.g., Internal Tools, Prospect Engine)</label
        >
        <input
          id="focus"
          type="text"
          v-model="form.focus"
          placeholder="e.g., Internal Tools, Prospect Engine, Self-Learning"
        />
      </div>

      <!-- Time Spent Section -->
      <div class="section-box">
        <label class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 text-purple-500 w-6 h-6"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Time Spent</label
        >
        <div v-for="(item, index) in form.timeSpent" :key="'time-' + index">
          <textarea
            v-model="form.timeSpent[index]"
            :placeholder="'Enter time spent item ' + (index + 1)"
          ></textarea>
        </div>
        <button type="button" class="add-btn" @click="addItem('timeSpent')">
          + Add Item
        </button>
      </div>

      <!-- Key Insights Section -->
      <div class="section-box">
        <label class="section-title"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 text-purple-500 w-6 h-6"
          >
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
          Key Insights</label
        >
        <div
          v-for="(item, index) in form.keyInsights"
          :key="'insight-' + index"
        >
          <textarea
            v-model="form.keyInsights[index]"
            :placeholder="'Enter key insight item ' + (index + 1)"
          ></textarea>
        </div>
        <button type="button" class="add-btn" @click="addItem('keyInsights')">
          + Add Item
        </button>
      </div>

      <!-- Plan for Tomorrow Section -->
      <div class="section-box">
        <label class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 text-purple-500 w-6 h-6"
          >
            <path
              d="M12 21.75V15.5A2.25 2.25 0 0 0 9.75 13.25H6.5c-2.25
               0-3.5-1.25-3.5-3.5V5.5c0-2.25 
              1.25-3.5 3.5-3.5h11c2.25 
              0 3.5 1.25 3.5 2.5v4.25c0 
              2.25-1.25 3.5-3.5 3.5h-3.25A2.25 2.25 0 0 0 12 15.5Z"
            ></path>
          </svg>
          Plan for Tomorrow</label
        >
        <div v-for="(item, index) in form.planTomorrow" :key="'plan-' + index">
          <textarea
            v-model="form.planTomorrow[index]"
            :placeholder="'Enter plan for tomorrow item ' + (index + 1)"
          ></textarea>
        </div>
        <button type="button" class="add-btn" @click="addItem('planTomorrow')">
          + Add Item
        </button>
      </div>

      <div class="actions">
        <button type="button" class="btn secondary">Save Draft</button>
        <button type="submit" class="btn primary">Submit Update</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.modal-content p {
  margin-bottom: 2rem;
  color: #666;
}

.btn.primary {
  background-color: #5c67f2;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn.primary:hover {
  background-color: #5058c9;
}
</style>
