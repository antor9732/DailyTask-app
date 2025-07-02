<script setup>
import { ref, computed } from "vue";
// Registered users loaded from localStorage (no static data)
const users = ref([]);
if (typeof window !== 'undefined') {
  const regUsers = localStorage.getItem('users');
  users.value = regUsers ? JSON.parse(regUsers) : [];

  // Make sure to update users list if registration happens in another tab
  window.addEventListener('storage', () => {
    const regUsers = localStorage.getItem('users');
    users.value = regUsers ? JSON.parse(regUsers) : [];
  });
}
const filter = ref("");
const filteredUsers = computed(() =>
  users.value.filter(u =>
    u.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);
const activeUsers = computed(() =>
  filteredUsers.value.filter(u => u.active).length
);

// Count all registered users (including admin) as employees
const totalRegisteredEmployees = computed(() => users.value.length);

// --- Daily Update Logic ---
const showDailyUpdateList = ref(false);
const showNoUpdateList = ref(false);

// Get today's date in YYYY-MM-DD
function getTodayStr() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Find users who gave update today
const todayUpdateUsers = computed(() => {
  const today = getTodayStr();
  // Get unique names from today's updates
  const names = historyData.value.filter(h => h.date === today).map(h => h.name);
  return [...new Set(names)];
});

// Find users who did NOT give update today
const notUpdatedUsers = computed(() => {
  const updated = new Set(todayUpdateUsers.value);
  return users.value.map(u => u.name).filter(name => !updated.has(name));
});

// History data from localStorage (same as HistoryPage)
const historyData = ref([]);
if (typeof window !== 'undefined') {
  const data = localStorage.getItem('history');
  historyData.value = data ? JSON.parse(data) : [];
}

// Filters for history table
const historyNameFilter = ref("");
const dateFrom = ref("");
const dateTo = ref("");

function isInRange(dateStr) {
  if (!dateFrom.value && !dateTo.value) return true;
  const d = new Date(dateStr);
  if (dateFrom.value && d < new Date(dateFrom.value)) return false;
  if (dateTo.value) {
    const to = new Date(dateTo.value);
    to.setHours(23, 59, 59, 999);
    if (d > to) return false;
  }
  return true;
}

const filteredHistory = computed(() => {
  return historyData.value.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(historyNameFilter.value.toLowerCase());
    const dateMatch = isInRange(item.date);
    return nameMatch && dateMatch;
  });
});

// Download CSV
function downloadCSV() {
  if (!filteredHistory.value.length) return;
  const rows = [
    ["Date", "Name", "Focus", "Time Spent", "Key Insights", "Plan Tomorrow"],
    ...filteredHistory.value.map((item) => [
      item.date,
      item.name,
      item.focus,
      (item.timeSpent || []).join("; "),
      (item.keyInsights || []).join("; "),
      (item.planTomorrow || []).join("; "),
    ]),
  ];
  const csvContent = rows
    .map((e) => e.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-task-history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Download PDF (simple version)
// Download PDF (HistoryPage style)
function downloadPDF() {
  if (!filteredHistory.value.length) {
    alert("No data available to download");
    return;
  }
  import('jspdf').then(jsPDFModule => {
    const jsPDF = jsPDFModule.default;
    import('jspdf-autotable').then(autoTableModule => {
      const doc = new jsPDF();
      doc.setFont("Segoe UI Emoji", "normal");
      const currentDate = new Date().toISOString().split('T')[0];
      const first = filteredHistory.value[0];
      const userName = first && first.name ? first.name : 'User';
      // Name and Date in requested format
      doc.setFontSize(18);
      doc.text(`Date : ${currentDate}`, 15, 20);
      doc.text(`Name : ${userName}`, 15, 30);
      // Focus section
      doc.setFontSize(16);
      doc.text(`Focus : ${first && first.focus ? first.focus : ''}`, 15, 45);
      // Time Spent section
      doc.setFontSize(16);
      doc.text("Time Spent:", 15, 60);
      doc.setFontSize(12);
      (first && first.timeSpent ? first.timeSpent : []).forEach((item, index) => {
        doc.text(`• ${item}`, 25, 70 + (index * 7));
      });
      // Key Insights section
      const keyInsightsY = 70 + ((first && first.timeSpent ? first.timeSpent.length : 0) * 7) + 10;
      doc.setFontSize(16);
      doc.text("Key Insights:", 15, keyInsightsY);
      doc.setFontSize(12);
      (first && first.keyInsights ? first.keyInsights : []).forEach((item, index) => {
        doc.text(`• ${item}`, 25, keyInsightsY + 10 + (index * 7));
      });
      // Plan for Tomorrow section
      const planY = keyInsightsY + 10 + ((first && first.keyInsights ? first.keyInsights.length : 0) * 7) + 10;
      doc.setFontSize(16);
      doc.text("Plan for Tomorrow:", 15, planY);
      doc.setFontSize(12);
      (first && first.planTomorrow ? first.planTomorrow : []).forEach((item, index) => {
        doc.text(`• ${item}`, 25, planY + 10 + (index * 7));
      });
      doc.save(`daily-update-${currentDate}.pdf`);
    });
  });
}
</script>


<template>
  <div class="container-fluid min-vh-100 bg-light">
    <div class="row">

      <main class="col-md-12 ms-sm-auto px-md-4 py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2">Dashboard</h1>
          <span class="badge bg-success fs-6">Admin</span>
        </div>

        <div class="row mb-4">
          <!-- Total Employees -->
          <div class="col-md-4">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">Total Employee</h5>
                <p class="card-text display-6">{{ totalRegisteredEmployees }}</p>

              </div>
            </div>
          </div>
          <!-- Total Daily Update (Active) -->
          <div class="col-md-4">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">Total Daily Update</h5>
                <p class="card-text display-6 text-primary">{{ todayUpdateUsers.length }}</p>
              </div>
            </div>
          </div>
          <!-- Not Updated Today -->
          <div class="col-md-4">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">No Daily Update</h5>
                <p class="card-text display-6 text-danger">{{ notUpdatedUsers.length }}</p>
              </div>
            </div>
          </div>
        </div>


        <!-- History Table Section with Filters and Download -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-secondary text-white d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">User Daily Task History</h5>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <input v-model="historyNameFilter" type="text" class="form-control form-control-sm" placeholder="Filter by name..." style="width: 180px;" />
              <span>Date:</span>
              <input type="date" v-model="dateFrom" class="form-control form-control-sm" style="width: 140px;" />
              <span>to</span>
              <input type="date" v-model="dateTo" class="form-control form-control-sm" style="width: 140px;" />
              <div class="dropdown" style="position: relative;">
                <button class="btn btn-success btn-sm dropdown-toggle" type="button" id="reportDropdown" data-bs-toggle="dropdown" aria-expanded="false" :disabled="filteredHistory.length === 0" style="z-index: 1051">
                  Download
                </button>
                <ul class="dropdown-menu" aria-labelledby="reportDropdown">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="downloadCSV">Download as CSV</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click.stop="downloadPDF">Download as PDF</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table v-if="filteredHistory.length" class="table table-bordered align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Focus</th>
                    <th>Time Spent</th>
                    <th>Key Insights</th>
                    <th>Plan Tomorrow</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in filteredHistory" :key="idx">
                    <td>{{ item.date }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.focus }}</td>
                    <td>
                      <ul class="mb-0 ps-3">
                        <li v-for="(t, i) in item.timeSpent" :key="i">{{ t }}</li>
                      </ul>
                    </td>
                    <td>
                      <ul class="mb-0 ps-3">
                        <li v-for="(k, i) in item.keyInsights" :key="i">{{ k }}</li>
                      </ul>
                    </td>
                    <td>
                      <ul class="mb-0 ps-3">
                        <li v-for="(p, i) in item.planTomorrow" :key="i">{{ p }}</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center text-muted py-4">No history data found.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>

.sidebar {
  min-height: 100vh;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-custom {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  min-width: 320px;
  max-width: 90vw;
  padding: 0;
  overflow: hidden;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 1rem 1.5rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

</style>