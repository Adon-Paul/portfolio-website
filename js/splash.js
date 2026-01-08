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

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  var revealedIndex = 0; // chars visible so far
  var state = []; // { char: string, isResolved: bool, cycles: int, display: char }
  var lastRevealTime = 0;
  var speed = 180; // ms per new char (typewriter speed)

  function update(timestamp) {
    if (!lastRevealTime) lastRevealTime = timestamp;

    // Typewriter: Reveal next char slot every 'speed' ms
    if (revealedIndex < targetText.length && (timestamp - lastRevealTime > speed)) {
      state.push({
        char: targetText[revealedIndex],
        isResolved: false,
        cycles: 0,
        display: chars[Math.floor(Math.random() * chars.length)]
      });
      revealedIndex++;
      lastRevealTime = timestamp;
    }

    var output = '';
    var activeUnresolved = false;

    // Build string from state
    for (var i = 0; i < state.length; i++) {
      var s = state[i];
      if (s.isResolved) {
        output += s.char;
      } else {
        activeUnresolved = true;
        s.cycles++;

        // Resolve after X frames of scrambling (e.g., 25 frames = ~400ms)
        if (s.cycles > 25) {
          s.isResolved = true;
          output += s.char;
        } else {
          // Change the random character every 3rd frame for "tech" feel
          if (s.cycles % 3 === 0) {
            s.display = chars[Math.floor(Math.random() * chars.length)];
          }
          output += s.display;
        }
      }
    }

    textArea.textContent = output;

    // Bar progress: Based on RESOLVED characters, not just visible ones
    // This makes the bar feel like it "decrypts" along with the text
    var completion = state.filter(function (s) { return s.isResolved; }).length;
    var progress = (completion / targetText.length) * 100;
    bar.style.width = progress + "%";

    // Check if fully done
    if (revealedIndex >= targetText.length && !activeUnresolved) {
      // Animation Complete
      textArea.classList.add('glitch-active');
      textArea.setAttribute('data-text', targetText);

      setTimeout(function () {
        overlay.classList.add('to-dashboard');

        // Trigger Photo Entry
        setTimeout(function () {
          var photoWrap = document.querySelector('.photo-wrap');
          if (photoWrap) {
            photoWrap.classList.remove('photo-entry-initial');
            photoWrap.classList.add('photo-entry-active');
          }
        }, 300); // Slight delay to overlap with wipe
      }, 600);
    } else {
      requestAnimationFrame(update);
    }
  }

  // Start loop
  requestAnimationFrame(update);
})();
