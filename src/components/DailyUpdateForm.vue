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

const showModal = ref(false); // Submit modal
const showDraftModal = ref(false); // Draft save modal

function addItem(section) {
  form[section].push("");
}

function isArrayFilled(arr) {
  return arr.every((item) => item && item.trim() !== "");
}

function validateForm() {
  return (
    form.date &&
    form.name.trim() &&
    form.focus.trim() &&
    isArrayFilled(form.timeSpent) &&
    isArrayFilled(form.keyInsights) &&
    isArrayFilled(form.planTomorrow)
  );
}

async function submitUpdate() {
  if (!validateForm()) {
    alert("Please fill all required fields!");
    return;
  }

  // Save to localStorage history
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ ...form });
  localStorage.setItem("history", JSON.stringify(history));

  showModal.value = true; // Show submit modal

  setTimeout(() => {
    showModal.value = false;
    router.push("/thank-you");
  }, 1500);
}

function saveDraft() {
  if (!validateForm()) {
    alert("Please fill all required fields to save draft!");
    return;
  }

  let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  drafts.push({ ...form });
  localStorage.setItem("drafts", JSON.stringify(drafts));

  showDraftModal.value = true;

  setTimeout(() => {
    showDraftModal.value = false;
    router.push("/thank-you");
  }, 1500);

  // Reset form
  form.date = new Date().toISOString().substr(0, 10);
  form.name = user.name || "";
  form.focus = "";
  form.timeSpent = [""];
  form.keyInsights = [""];
  form.planTomorrow = [""];
}
</script>

<template>
  <div 
    class="gradientMove container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center p-4"
    style="background: linear-gradient(45deg, #7b2ff2, #22388A); 
           background-size: 600% 600%; 
           animation: gradientMove 15s ease infinite;"
  >
    <!-- Submit Modal -->
    <div
      v-if="showModal"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background-color: rgba(0,0,0,0.3); z-index: 1050;"
    >
      <div class="bg-white p-4 rounded shadow text-center">
        <h4 class="mb-0">Submitted successfully!</h4>
      </div>
    </div>

    <!-- Draft Modal -->
    <div
      v-if="showDraftModal"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background-color: rgba(0,0,0,0.3); z-index: 1050;"
    >
      <div class="bg-white p-4 rounded shadow text-center">
        <h4 class="mb-0">Draft saved successfully!</h4>
      </div>
    </div>

    <div class="text-center text-white mb-4">
      <h1>Daily Work Update</h1>
      <p>Submit your progress and plans</p>
    </div>

    <form
      @submit.prevent="submitUpdate"
      class="bg-white p-4 rounded shadow-sm w-100"
      
    >
      <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
          <label for="date" class="form-label fw-bold text-secondary">Update Date</label>
          <input id="date" type="date" class="form-control" v-model="form.date" />
        </div>
        <div class="col-md-6">
          <label for="name" class="form-label fw-bold text-secondary">Employee Name</label>
          <input id="name" type="text" class="form-control" v-model="form.name" readonly />
        </div>
      </div>

      <div class="mb-3">
        <label for="focus" class="form-label fw-bold text-secondary">Daily Focus</label>
        <input
          id="focus"
          type="text"
          class="form-control"
          v-model="form.focus"
          placeholder="e.g., Internal Tools, Prospect Engine"
        />
      </div>

      <!-- Side by Side: Time Spent & Key Insights -->
      <div class="row mb-4">
        <!-- Time Spent -->
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Time Spent</label>
          <div v-for="(item, index) in form.timeSpent" :key="'time-' + index" class="mb-2">
            <textarea
              class="form-control"
              v-model="form.timeSpent[index]"
              :placeholder="'Enter time spent item ' + (index + 1)"
              rows="3"
            ></textarea>
          </div>
          <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addItem('timeSpent')">
            + Add Item
          </button>
        </div>

        <!-- Key Insights -->
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Key Insights</label>
          <div v-for="(item, index) in form.keyInsights" :key="'insight-' + index" class="mb-2">
            <textarea
              class="form-control"
              v-model="form.keyInsights[index]"
              :placeholder="'Enter key insight item ' + (index + 1)"
              rows="3"
            ></textarea>
          </div>
          <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addItem('keyInsights')">
            + Add Item
          </button>
        </div>
      </div>

      <!-- Plan Tomorrow Section -->
      <div class="mb-4">
        <label class="form-label fw-bold text-secondary">Plan for Tomorrow</label>
        <div v-for="(item, index) in form.planTomorrow" :key="'plan-' + index" class="mb-2">
          <textarea
            class="form-control"
            v-model="form.planTomorrow[index]"
            :placeholder="'Enter plan for tomorrow item ' + (index + 1)"
            rows="3"
          ></textarea>
        </div>
        <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addItem('planTomorrow')">
          + Add Item
        </button>
      </div>

      <div class="d-flex justify-content-between">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="saveDraft"
        >
          Save Draft
        </button>
        <button type="submit" class="btn btn-primary">Submit Update</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
