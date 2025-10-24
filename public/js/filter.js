  const filters = document.querySelectorAll('.filter');
  const listings = document.querySelectorAll('.listing-body .card.cols');

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selected = filter.getAttribute('data-filter');

      listings.forEach(card => {
        const category = card.getAttribute('data-category');
        if (selected === 'All' || selected === 'Trending' || category === selected) {
          card.parentElement.style.display = 'block'; // show <a>
        } else {
          card.parentElement.style.display = 'none'; // hide <a>
        }
      });
    });
  });



document.addEventListener("DOMContentLoaded", () => {
  const taxToggle = document.getElementById("switchCheckDefault");
  const priceElements = document.querySelectorAll(".price");

  // Step 1: Store original prices in data attributes
  priceElements.forEach(priceEl => {
    const raw = priceEl.innerText.replace("₹", "").replace("/night", "").replace(/,/g, "");
    priceEl.dataset.original = raw;
  });

  // Step 2: Toggle tax on checkbox change
  taxToggle.addEventListener("change", () => {
    const isChecked = taxToggle.checked;

    priceElements.forEach(priceEl => {
      const original = parseFloat(priceEl.dataset.original);
      const taxAmount = original * 0.18;
      const finalPrice = isChecked ? original + taxAmount : original;

      priceEl.innerHTML = `&#x20B9;${Math.round(finalPrice).toLocaleString("en-IN")}/night`;
    });
  });
});