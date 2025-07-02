<template>
  <div class="update-wrapper">
    <h1>Edit Daily Update</h1>
    <form @submit.prevent="submitEdit">
      <div class="form-group">
        <label for="date">Update Date</label>
        <input id="date" type="date" v-model="form.date" />
      </div>
      <div class="form-group">
        <label for="name">Employee Name</label>
        <input id="name" type="text" v-model="form.name" readonly />
      </div>
      <div class="form-group">
        <label for="focus">Daily Focus</label>
        <input id="focus" type="text" v-model="form.focus" />
      </div>
      <div class="form-group">
        <label>Time Spent</label>
        <div
          v-for="(item, idx) in form.timeSpent"
          :key="idx"
          style="display: flex; gap: 8px; margin-bottom: 6px"
        >
          <input
            type="text"
            v-model="form.timeSpent[idx]"
            placeholder="Time spent..."
          />
          <button
            type="button"
            @click="removeItem('timeSpent', idx)"
            v-if="form.timeSpent.length > 1"
          >
            Remove
          </button>
        </div>
        <button type="button" @click="addItem('timeSpent')">Add More</button>
      </div>
      <div class="form-group">
        <label>Key Insights</label>
        <div
          v-for="(item, idx) in form.keyInsights"
          :key="idx"
          style="display: flex; gap: 8px; margin-bottom: 6px"
        >
          <input
            type="text"
            v-model="form.keyInsights[idx]"
            placeholder="Key insight..."
          />
          <button
            type="button"
            @click="removeItem('keyInsights', idx)"
            v-if="form.keyInsights.length > 1"
          >
            Remove
          </button>
        </div>
        <button type="button" @click="addItem('keyInsights')">Add More</button>
      </div>
      <div class="form-group">
        <label>Plan for Tomorrow</label>
        <div
          v-for="(item, idx) in form.planTomorrow"
          :key="idx"
          style="display: flex; gap: 8px; margin-bottom: 6px"
        >
          <input
            type="text"
            v-model="form.planTomorrow[idx]"
            placeholder="Plan for tomorrow..."
          />
          <button
            type="button"
            @click="removeItem('planTomorrow', idx)"
            v-if="form.planTomorrow.length > 1"
          >
            Remove
          </button>
        </div>
        <button type="button" @click="addItem('planTomorrow')">Add More</button>
      </div>
      <button type="submit" class="btn primary">Save Changes</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const index = Number(route.params.index);

let history = JSON.parse(localStorage.getItem("history")) || [];
// Ensure arrays are always present
const form = reactive({
  date: history[index]?.date || "",
  name: history[index]?.name || "",
  focus: history[index]?.focus || "",
  timeSpent: history[index]?.timeSpent ? [...history[index].timeSpent] : [""],
  keyInsights: history[index]?.keyInsights
    ? [...history[index].keyInsights]
    : [""],
  planTomorrow: history[index]?.planTomorrow
    ? [...history[index].planTomorrow]
    : [""],
});

function addItem(section) {
  form[section].push("");
}
function removeItem(section, idx) {
  if (form[section].length > 1) form[section].splice(idx, 1);
}

function submitEdit() {
  history[index] = { ...form };
  localStorage.setItem("history", JSON.stringify(history));
  router.push("/history");
}
</script>
