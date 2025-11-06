document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 20; // max tilt
      const rotateX = ((y / rect.height) - 0.5) * -20;

      const scale = 1.05; // slightly enlarge on hover

      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
  });
});
