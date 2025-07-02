<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  // Get the first day (Sunday) of this week
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  // Get the last day (Saturday) of this week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
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
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return d >= from && d <= to;
}

const filtered = computed(() => {
  if (filterType.value === "week") {
    return history.value.filter((item) => isThisWeek(item.date));
  }
  if (filterType.value === "month") {
    return history.value.filter((item) => isThisMonth(item.date));
  }
  if (dateFrom.value && dateTo.value) {
    return history.value.filter((item) => isInRange(item.date));
  }
  return history.value;
});

// Download CSV function
function downloadCSV() {
  if (!filtered.value.length) return;
  const rows = [
    ["Date", "Name", "Focus", "Time Spent", "Key Insights", "Plan Tomorrow"],
    ...filtered.value.map((item) => [
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
// Download PDF function

function downloadPDF() {
  if (filtered.value.length === 0) {
    alert("No data available to download");
    return;
  }

  try {
    const doc = new jsPDF();
    doc.setFont("Segoe UI Emoji", "normal");
    const currentDate = new Date().toISOString().split("T")[0];
    const userName = filtered.value[0].name || "User"; // Get name from data or use default
    const currentItem = filtered.value[0]; // Assuming filtered.value contains the data for the current day

    // Name and Date in requested format
    doc.setFontSize(18);
    doc.text(`Date : ${currentDate}`, 15, 20);
    doc.text(`Name : ${userName}`, 15, 30);

    // Focus section
    doc.setFontSize(16);
    doc.text(`Focus : ${currentItem.focus}`, 15, 45);

    // Time Spent section
    doc.setFontSize(16);
    doc.text("Time Spent:", 15, 60);
    doc.setFontSize(12);
    currentItem.timeSpent.forEach((item, index) => {
      doc.text(`• ${item}`, 25, 70 + index * 7);
    });

    // Key Insights section
    const keyInsightsY = 70 + filtered.value[0].timeSpent.length * 7 + 10;
    doc.setFontSize(16);
    doc.text("Key Insights:", 15, keyInsightsY);
    doc.setFontSize(12);
    filtered.value[0].keyInsights.forEach((item, index) => {
      doc.text(`• ${item}`, 25, keyInsightsY + 10 + index * 7);
    });

    // Plan for Tomorrow section
    const planY =
      keyInsightsY + 10 + filtered.value[0].keyInsights.length * 7 + 10;
    doc.setFontSize(16);
    doc.text("Plan for Tomorrow:", 15, planY);
    doc.setFontSize(12);
    filtered.value[0].planTomorrow.forEach((item, index) => {
      doc.text(`• ${item}`, 25, planY + 10 + index * 7);
    });

    doc.save(`daily-update-${currentDate}.pdf`);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert(`PDF generation failed: ${error.message}`);
  }
}

// Check if the date is today
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
    (h) =>
      h.date === item.date && h.name === item.name && h.focus === item.focus
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
  <div
    class="container-fluid min-vh-100 d-flex justify-content-center"
    style="
      background: linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%);
      padding: 20px;
    "
  >
    <div
      class="card shadow-lg p-4 border-0 w-100"
      style="height: fit-content; border-radius: 16px; background: #fff"
    >
      <h1 class="mb-4 fw-bold" style="color: #4f46e5; font-size: 2rem">
        Daily Task History
      </h1>
      <div
        class="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3"
      >
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            value="all"
            v-model="filterType"
            id="allRadio"
          />
          <label class="form-check-label mx-2" for="allRadio">All</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            value="week"
            v-model="filterType"
            id="weekRadio"
          />
          <label class="form-check-label mx-2" for="weekRadio">This Week</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            value="month"
            v-model="filterType"
            id="monthRadio"
          />
          <label class="form-check-label mx-2" for="monthRadio"
            >This Month</label
          >
        </div>
        <div class="d-flex align-items-center gap-2">
          <span>Custom:</span>
          <input
            type="date"
            v-model="dateFrom"
            class="form-control form-control-sm"
            style="width: 140px"
          />
          <span>to</span>
          <input
            type="date"
            v-model="dateTo"
            class="form-control form-control-sm"
            style="width: 140px"
          />
        </div>
        <div class="dropdown" style="position: relative">
          <button
            class="btn btn-success px-3 fw-semibold dropdown-toggle"
            type="button"
            id="reportDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :disabled="filtered.length === 0"
            style="z-index: 1051"
          >
            Report Download
          </button>
          <ul class="dropdown-menu" aria-labelledby="reportDropdown">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="downloadCSV"
                >Download as CSV</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.stop="downloadPDF"
                >Download as PDF</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="table-responsive">
        <table v-if="filtered.length" class="table table-bordered align-middle">
          <thead class="table-light">
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
              <td
                class="text-center align-items-center d-flex justify-content-center"
              >
                <button
                  v-if="isToday(item.date)"
                  class="btn btn-danger btn-sm"
                  style="height: max-content"
                  @click="deleteUpdate(item)"
                >
                  Delete
                </button>
                <button
                  class="btn btn-primary btn-sm ms-1"
                  style="height: max-content"
                  @click="editUpdate(idx)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center text-muted py-4">No data found.</div>
      </div>
    </div>
  </div>
</template>
