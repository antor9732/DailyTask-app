<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const filterType = ref("all");
const history = ref(JSON.parse(localStorage.getItem("history")) || []);
const dateFrom = ref("");
const dateTo = ref("");

// Reset custom date filter if filterType changes
watch(filterType, (val) => {
  if (val !== "custom") {
    dateFrom.value = "";
    dateTo.value = "";
  }
});

function isThisWeek(dateStr) {
  const now = new Date();
  const input = new Date(dateStr);
  const first = now.getDate() - now.getDay();
  const last = first + 6;
  const weekStart = new Date(now.setDate(first));
  weekStart.setHours(0,0,0,0);
  const weekEnd = new Date(now.setDate(last));
  weekEnd.setHours(23,59,59,999);
  return input >= weekStart && input <= weekEnd;
}

function isThisMonth(dateStr) {
  const now = new Date();
  const input = new Date(dateStr);
  return (
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth()
  );
}

function isInRange(dateStr) {
  if (!dateFrom.value || !dateTo.value) return false;
  const d = new Date(dateStr);
  const from = new Date(dateFrom.value);
  const to = new Date(dateTo.value);
  from.setHours(0,0,0,0);
  to.setHours(23,59,59,999);
  return d >= from && d <= to;
}

const filtered = computed(() => {
  if (filterType.value === "week") {
    return history.value.filter(item => isThisWeek(item.date));
  }
  if (filterType.value === "month") {
    return history.value.filter(item => isThisMonth(item.date));
  }
  if (dateFrom.value && dateTo.value) {
    return history.value.filter(item => isInRange(item.date));
  }
  return history.value;
});

function downloadCSV() {
  if (!filtered.value.length) return;
  const rows = [
    ["Date", "Name", "Focus", "Time Spent", "Key Insights", "Plan Tomorrow"],
    ...filtered.value.map(item => [
      item.date,
      item.name,
      item.focus,
      (item.timeSpent || []).join("; "),
      (item.keyInsights || []).join("; "),
      (item.planTomorrow || []).join("; ")
    ])
  ];
  const csvContent = rows.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-task-history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function deleteUpdate(item) {
  if (!confirm("Are you sure you want to delete this update?")) return;
  // Remove from history
  const idx = history.value.findIndex(
    h =>
      h.date === item.date &&
      h.name === item.name &&
      h.focus === item.focus
  );
  if (idx !== -1) {
    history.value.splice(idx, 1);
    localStorage.setItem("history", JSON.stringify(history.value));
  }
}

function editUpdate(idx) {
  router.push({ name: "EditUpdate", params: { index: idx } });
}
</script>

<template>
  <div class="history-bg">
    <div class="history-wrapper">
      <h1>Daily Task History</h1>
      <div class="filter-bar">
        <label class="filter-box">
          <input type="radio" value="all" v-model="filterType" /> All
        </label>
        <label class="filter-box">
          <input type="radio" value="week" v-model="filterType" /> This Week
        </label>
        <label class="filter-box">
          <input type="radio" value="month" v-model="filterType" /> This Month
        </label>
        <label class="date-custom-filter">
          Custom:
          <input type="date" v-model="dateFrom" /> to
          <input type="date" v-model="dateTo" />
        </label>
        <button class="btn primary" @click="downloadCSV" :disabled="filtered.length === 0">
          Download CSV
        </button>
      </div>
      <table v-if="filtered.length" class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Focus</th>
            <th>Time Spent</th>
            <th>Key Insights</th>
            <th>Plan Tomorrow</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in filtered" :key="idx">
            <td>{{ item.date }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.focus }}</td>
            <td>
              <ul>
                <li v-for="(t, i) in item.timeSpent" :key="i">{{ t }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="(k, i) in item.keyInsights" :key="i">{{ k }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="(p, i) in item.planTomorrow" :key="i">{{ p }}</li>
              </ul>
            </td>
            <td>
              <button
                v-if="isToday(item.date)"
                class="btn danger"
                @click="deleteUpdate(item)"
              >
                Delete
              </button>
              <button
                class="btn primary"
                style="margin-left:6px"
                @click="editUpdate(idx)"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">No data found.</div>
    </div>
  </div>
</template>

<style scoped>
.history-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}
.history-wrapper {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.13);
  padding: 40px 32px 32px 32px;
  max-width: 1100px;
  width: 100%;
  margin: 32px 0;
}
h1 {
  margin-bottom: 18px;
  color: #4f46e5;
  font-size: 2rem;
  text-align: left;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-bottom: 18px;
  justify-content: space-between;
}
.filter-box,
.date-custom-filter {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 5px 0;
}
 .filter-box input {
    width: fit-content;
  }
.date-custom-filter input[type="date"] {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.btn.primary {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 8px;
  margin-top: 6px;
}
.btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: #fff;
  overflow-x: auto;
  display: block;
}
.history-table th,
.history-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 10px;
  text-align: left;
  font-size: 1rem;
  min-width: 120px;
  vertical-align: top;
}
.history-table th {
  background: #ede9fe;
  color: #4f46e5;
  position: sticky;
  top: 0;
  z-index: 1;
}
.no-data {
  color: #888;
  text-align: center;
  margin-top: 30px;
  font-size: 1.1rem;
}
.btn.danger {
  background: #e11d48;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 4px;
}
.btn.danger:hover {
  background: #be123c;
}

/* Responsive styles */
@media (max-width: 900px) {
  .history-wrapper {
    padding: 24px 8px 16px 8px;
    max-width: 100%;
  }
  .filter-bar {
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: flex-start;
    gap: 10px;
  }
  .btn.primary {
    width: 100%;
    margin-left: 0;
  }
 
}
@media (max-width: 600px) {
  .history-wrapper {
    padding: 12px 2px 8px 2px;
    border-radius: 8px;
  }
  h1 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  .filter-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  .filter-bar label,
  .filter-bar .date-custom-filter {
    font-size: 0.9rem;
    flex-direction: row;
    align-items: center;
    gap: 0
  }
 
  .filter-bar label,
  .filter-bar .date-custom-filter {
    font-size: 0.98rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .history-table th,
  .history-table td {
    font-size: 0.92rem;
    padding: 6px 4px;
    min-width: 90px;
  }
  .btn.primary, .btn.danger {
    font-size: 0.98rem;
    padding: 7px 10px;
  }
  .no-data {
    font-size: 1rem;
  }
}
</style>