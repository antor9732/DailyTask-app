<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);">
    <div class="card text-center shadow-lg p-4 border-0" style="border-radius: 20px; max-width: 550px; width: 100%; background: #fff;">
      <div class="d-flex flex-column align-items-center">
        <svg class="mb-3" width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#a78bfa"/>
          <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="mb-2 fw-bold" style="color: #7c3aed; font-size: 1.7rem; letter-spacing: 0.5px;">Thank you for your update!</h2>
        <p class="mb-4" style="color: #6b7280; font-size: 1.08rem;">Your daily update has been submitted successfully.</p>
      </div>
      <div class="d-flex flex-column flex-md-row gap-2 justify-content-center mt-2">
        <button class="btn px-4 py-2 fw-semibold shadow-sm" style="background: #a78bfa; color: #fff; border-radius: 8px;" @click="$router.push('/daily-update')">Submit Another Update</button>
        <button class="btn px-4 py-2 fw-semibold shadow-sm" style="background: #a78bfa; color: #fff; border-radius: 8px;" @click="$router.push('/history')">View Update History</button>
        <button class="btn px-4 py-2 fw-semibold shadow-sm" style="background: #a78bfa; color: #fff; border-radius: 8px;" @click="$router.push('/save-draft')">Go to Save Drafts</button>
      </div>
    </div>
  </div>
</template>

<script setup>


</script>