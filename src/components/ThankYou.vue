<template>
  <div class="thankyou-wrapper">
    <div class="thankyou-card">
      <svg class="thankyou-icon" width="60" height="60" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#a78bfa"/>
        <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2>Thank you for your update!</h2>
      <p>Your daily update has been submitted successfully.</p>
      <div class="thankyou-actions">
        <button @click="$router.push('/daily-update')">Submit Another Update</button>
        <button @click="$router.push('/history')">View Update History</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThankYou"
};
</script>

<style scoped>
.thankyou-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
}
.thankyou-card {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(80, 0, 200, 0.08);
  text-align: center;
  max-width: 350px;
  width: 100%;
  animation: popin 0.5s;
}
@keyframes popin {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.thankyou-icon {
  margin-bottom: 18px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
h2 {
  color: #7c3aed;
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
}
p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}
.thankyou-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
button {
  background: #a78bfa;
  color: #fff;
  border: none;
  padding: 0.7rem 1.3rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #7c3aed;
}
</style>