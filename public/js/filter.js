const filters = document.querySelectorAll('.filter');
const listings = document.querySelectorAll('.listing-body .card.cols');

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const selected = filter.getAttribute('data-filter');

    listings.forEach(card => {
      const category = card.getAttribute('data-category');
      if (selected === 'All' || selected === 'Trending' || category === selected) {
        card.parentElement.style.display = 'block';
      } else {
        card.parentElement.style.display = 'none';
      }
    });

    // Update active class
    filters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const taxToggle = document.getElementById("switchCheckDefault");
  const priceElements = document.querySelectorAll(".price");
  const taxText=document.querySelector(".tax-text");
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
      const tax=(18/100);
      const taxAmount = original * tax;
      const finalPrice = isChecked ? original + taxAmount : original;
      const textChange= isChecked ? "Display total after taxes" : "Display total before taxes";
      priceEl.innerHTML = `&#x20B9;${Math.round(finalPrice).toLocaleString("en-IN")}/night`;
      taxText.innerHTML=textChange;
    });
  });
});

// search logic
let btn = document.querySelector(".search-btn");

btn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent form submission

  let input = document.querySelector(".search-input").value.trim().toLowerCase();

  listings.forEach(listing => {
    const country = listing.getAttribute("country")?.toLowerCase();
    const city = listing.getAttribute("city")?.toLowerCase();

    if ((country && country.includes(input)) || (city && city.includes(input))) {
      listing.parentElement.style.display = 'block';
    } else {
      listing.parentElement.style.display = 'none';
    }
  });
});