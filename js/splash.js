// Splash Screen Logic
(function initSplash() {
  if (typeof reduceMotion !== 'undefined' && reduceMotion) {
    var o = document.getElementById('splash-overlay');
    if (o) o.style.display = 'none';
    return;
  }

  var targetText = "Adon Paul Tomy";
  var textArea = document.getElementById("splashText");
  var bar = document.getElementById("splashBar");
  var overlay = document.getElementById("splash-overlay");

  if (!textArea || !bar || !overlay) return;

  var revealedIndex = 0;
  var lastRevealTime = 0;
  var speed = 180; // ms per new char (typewriter speed)

  function update(timestamp) {
    if (!lastRevealTime) lastRevealTime = timestamp;

    // Typewriter: Reveal next char slot every 'speed' ms
    if (revealedIndex < targetText.length && (timestamp - lastRevealTime > speed)) {
      revealedIndex++;
      lastRevealTime = timestamp;
    }

    // Simple Typewriter output
    textArea.textContent = targetText.substring(0, revealedIndex);

    // Bar progress
    var progress = (revealedIndex / targetText.length) * 100;
    bar.style.width = progress + "%";

    // Check if fully done
    if (revealedIndex >= targetText.length) {
      // Animation Complete
      textArea.classList.add('glitch-active');
      textArea.setAttribute('data-text', targetText);

      setTimeout(function () {
        overlay.classList.add('to-dashboard');
      }, 600);
    } else {
      requestAnimationFrame(update);
    }
  }

  // Start loop
  requestAnimationFrame(update);
})();
