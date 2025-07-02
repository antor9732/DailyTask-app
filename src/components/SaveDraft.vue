<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Load all drafts from localStorage
const drafts = ref(JSON.parse(localStorage.getItem("drafts")) || []);

// Editing state
const editingIndex = ref(-1);
const editForm = reactive({
  date: "",
  name: "",
  focus: "",
  timeSpent: [""],
  keyInsights: [""],
  planTomorrow: [""],
});

const showModal = ref(false);

function loadDraft(index) {
  editingIndex.value = index;
  const d = drafts.value[index];
  Object.assign(editForm, JSON.parse(JSON.stringify(d)));
}

function addItem(section) {
  editForm[section].push("");
}

function isArrayFilled(arr) {
  return arr.every((item) => item && item.trim() !== "");
}

function saveDraft() {
  if (
    !editForm.date ||
    !editForm.name.trim() ||
    !editForm.focus.trim() ||
    !isArrayFilled(editForm.timeSpent) ||
    !isArrayFilled(editForm.keyInsights) ||
    !isArrayFilled(editForm.planTomorrow)
  ) {
    alert("Please fill all required fields!");
    return;
  }

  if (editingIndex.value >= 0) {
    drafts.value[editingIndex.value] = JSON.parse(JSON.stringify(editForm));
    editingIndex.value = -1;
  } else {
    drafts.value.push(JSON.parse(JSON.stringify(editForm)));
  }
  localStorage.setItem("drafts", JSON.stringify(drafts.value));
  resetForm();
  alert("Draft saved!");
}

function resetForm() {
  editForm.date = new Date().toISOString().substr(0, 10);
  editForm.name = JSON.parse(localStorage.getItem("user"))?.name || "";
  editForm.focus = "";
  editForm.timeSpent = [""];
  editForm.keyInsights = [""];
  editForm.planTomorrow = [""];
  editingIndex.value = -1;
}

function deleteDraft(index) {
  if (confirm("Are you sure you want to delete this draft?")) {
    drafts.value.splice(index, 1);
    localStorage.setItem("drafts", JSON.stringify(drafts.value));
  }
}

async function submitDraft(index) {
  const d = drafts.value[index];

  // Same validation as before
  if (
    !d.date ||
    !d.name.trim() ||
    !d.focus.trim() ||
    !isArrayFilled(d.timeSpent) ||
    !isArrayFilled(d.keyInsights) ||
    !isArrayFilled(d.planTomorrow)
  ) {
    alert("Please fill all required fields in the draft before submitting!");
    return;
  }

  // Save to localStorage history
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ ...d });
  localStorage.setItem("history", JSON.stringify(history));

  // Remove from drafts
  drafts.value.splice(index, 1);
  localStorage.setItem("drafts", JSON.stringify(drafts.value));

  showModal.value = true;
  setTimeout(() => {
    showModal.value = false;
    router.push("/thank-you");
  }, 1500);
}

resetForm();
</script>

<template>
  <div class="container py-5" style="max-width: 900px">
    <!-- Modal -->
    <div
      v-if="showModal"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background-color: rgba(0, 0, 0, 0.3); z-index: 1050"
    >
      <div class="bg-white p-4 rounded shadow text-center">
        <h4 class="mb-0">Submitted successfully!</h4>
      </div>
    </div>

    <h2 class="mb-4 text-center">Saved Drafts</h2>

    <div v-if="drafts.length === 0" class="alert alert-info">
      No drafts saved yet.
    </div>

    <div v-for="(draft, index) in drafts" :key="index" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Draft - {{ draft.date }} by {{ draft.name }}</h5>
        <p><strong>Focus:</strong> {{ draft.focus }}</p>
        <p><strong>Time Spent:</strong></p>
        <ul>
          <li v-for="(item, i) in draft.timeSpent" :key="i">{{ item }}</li>
        </ul>
        <p><strong>Key Insights:</strong></p>
        <ul>
          <li v-for="(item, i) in draft.keyInsights" :key="i">{{ item }}</li>
        </ul>
        <p><strong>Plan for Tomorrow:</strong></p>
        <ul>
          <li v-for="(item, i) in draft.planTomorrow" :key="i">{{ item }}</li>
        </ul>

        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-primary" @click="loadDraft(index)">
            Edit
          </button>
          <button class="btn btn-sm btn-success" @click="submitDraft(index)">
            Submit
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteDraft(index)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit / Add Draft Form -->
    <div class="card p-4 mt-4 bg-light">
      <h4>{{ editingIndex >= 0 ? "Edit Draft" : "Add New Draft" }}</h4>
      <form @submit.prevent="saveDraft">
        <div class="row mb-3">
          <div class="col-md-6 mb-3 mb-md-0">
            <label for="date" class="form-label fw-bold">Update Date</label>
            <input
              id="date"
              type="date"
              class="form-control"
              v-model="editForm.date"
            />
          </div>
          <div class="col-md-6">
            <label for="name" class="form-label fw-bold">Employee Name</label>
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="editForm.name"
              readonly
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="focus" class="form-label fw-bold">Daily Focus</label>
          <input
            id="focus"
            type="text"
            class="form-control"
            v-model="editForm.focus"
            placeholder="e.g., Internal Tools, Prospect Engine"
          />
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">Time Spent</label>
            <div
              v-for="(item, i) in editForm.timeSpent"
              :key="'time-' + i"
              class="mb-2"
            >
              <textarea
                class="form-control"
                v-model="editForm.timeSpent[i]"
                :placeholder="'Enter time spent item ' + (i + 1)"
                rows="2"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-sm btn-outline-primary mt-1"
              @click="addItem('timeSpent')"
            >
              + Add Item
            </button>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Key Insights</label>
            <div
              v-for="(item, i) in editForm.keyInsights"
              :key="'insight-' + i"
              class="mb-2"
            >
              <textarea
                class="form-control"
                v-model="editForm.keyInsights[i]"
                :placeholder="'Enter key insight item ' + (i + 1)"
                rows="2"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-sm btn-outline-primary mt-1"
              @click="addItem('keyInsights')"
            >
              + Add Item
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Plan for Tomorrow</label>
          <div
            v-for="(item, i) in editForm.planTomorrow"
            :key="'plan-' + i"
            class="mb-2"
          >
            <textarea
              class="form-control"
              v-model="editForm.planTomorrow[i]"
              :placeholder="'Enter plan for tomorrow item ' + (i + 1)"
              rows="2"
            ></textarea>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary mt-1"
            @click="addItem('planTomorrow')"
          >
            + Add Item
          </button>
        </div>

        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editingIndex >= 0 ? "Save Changes" : "Save Draft" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* You can add styling if needed */
</style>
