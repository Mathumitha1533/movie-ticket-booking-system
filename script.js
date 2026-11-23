document.addEventListener('DOMContentLoaded', () => {
  const testBtn = document.getElementById('testBtn');
  const testMessage = document.getElementById('testMessage');

  if (testBtn) {
    testBtn.addEventListener('click', () => {
      testMessage.textContent = '✅ JavaScript is working perfectly!';
    });
  }
});