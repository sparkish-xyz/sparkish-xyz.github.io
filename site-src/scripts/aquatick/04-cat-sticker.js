(function () {
  var sticker = document.querySelector('.cat-sticker');

  if (!sticker) return;
  sticker.addEventListener('click', function () {
    var original = sticker.textContent;
    sticker.textContent = sticker.dataset.activeText || original;
    sticker.style.transform = 'rotate(-8deg) scale(1.1)';
    setTimeout(function () {
      sticker.textContent = original;
      sticker.style.transform = 'rotate(12deg) scale(1)';
    }, 1100);
  });
})();
