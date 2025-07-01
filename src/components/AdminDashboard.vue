<template>
  <div class="container-fluid min-vh-100 bg-light">
    <div class="row">
      <nav class="col-md-2 d-none d-md-block bg-dark sidebar py-4">
        <div class="sidebar-sticky">
          <h2 class="text-white mb-4">Admin Panel</h2>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active text-white bg-primary rounded mb-2" href="#">Users</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white mb-2" href="#">Settings</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      <main class="col-md-10 ms-sm-auto px-md-4 py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2">Dashboard</h1>
          <span class="badge bg-success fs-6">Admin</span>
        </div>
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card text-center shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Total Users</h5>
                <p class="card-text display-6">{{ filteredUsers.length }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-center shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Active Users</h5>
                <p class="card-text display-6">{{ activeUsers }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <div class="input-group">
              <span class="input-group-text">Filter</span>
              <input v-model="filter" type="text" class="form-control" placeholder="Filter by name..." />
            </div>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th>Gmail</th>
                  <th>Username</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.username">
                  <td>{{ user.name }}</td>
                  <td>{{ user.gmail }}</td>
                  <td>{{ user.username }}</td>
                  <td>
                    <span :class="user.active ? 'badge bg-success' : 'badge bg-danger'">
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// Dummy user data (replace with real data source)
const users = ref([
  { name: "Alice", gmail: "alice@gmail.com", username: "alice", active: true },
  { name: "Bob", gmail: "bob@gmail.com", username: "bob", active: false },
  { name: "Charlie", gmail: "charlie@gmail.com", username: "charlie", active: true },
]);
const filter = ref("");
const filteredUsers = computed(() =>
  users.value.filter(u =>
    u.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);
const activeUsers = computed(() =>
  filteredUsers.value.filter(u => u.active).length
);
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
}
</style>