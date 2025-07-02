// convertFont.cjs

const { convert } = require("jspdf-font");

convert("src/assets/fonts/NotoSans-Regular.ttf", {
  output: "src/assets/fonts/NotoSans.js",
})
  .then(() => {
    console.log("✅ Font converted successfully!");
  })
  .catch((err) => {
    console.error("❌ Error converting font:", err);
  });
