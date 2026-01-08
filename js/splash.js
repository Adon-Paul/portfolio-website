// Splash Screen Logic
(function initSplash() {
  // If user prefers reduced motion, skip splash
  if (typeof reduceMotion !== 'undefined' && reduceMotion) {
    document.getElementById('splash-overlay').style.display = 'none';
    return;
  }

  var text = "Adon Paul Tomy";
  var speed = 100; // ms per char
  var textArea = document.getElementById("splashText");
  var bar = document.getElementById("splashBar");
  var overlay = document.getElementById("splash-overlay");

  var i = 0;
  var totalDuration = text.length * speed; // roughly 1.4s

  // Start typing
  function typeWriter() {
    if (i < text.length) {
      textArea.innerHTML += text.charAt(i);
      i++;
      // Update bar width based on progress
      var progress = (i / text.length) * 100;
      bar.style.width = progress + "%";

      setTimeout(typeWriter, speed);
    } else {
      // Finished typing
      textArea.classList.add('glitch-active');
      textArea.setAttribute('data-text', text);

      // Wait a moment then transition to dashboard
      setTimeout(function () {
        overlay.classList.add('to-dashboard');

        // Allow interactions after transition
        setTimeout(function () {
          // Optional: remove from DOM to save memory, or just hide
          // overlay.style.display = 'none'; 
        }, 800);
      }, 600);
    }
  }

  // Start after a very brief delay to ensure load
  setTimeout(typeWriter, 500);
})();
