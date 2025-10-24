const map = L.map("map").setView([23.2599, 77.4126], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

window.addEventListener('DOMContentLoaded', () => {
  if (typeof listingLocation !== 'undefined' && listingLocation.trim() !== '') {
    performSearch(listingLocation);
  }
});

function performSearch(location) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        // Prevent map reinitialization error
        if (L.DomUtil.get('map') !== null) {
          L.DomUtil.get('map')._leaflet_id = null;
        }

        const map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map).bindPopup("<p>exact location will be provided after booking</p>").openPopup();
      }
    });
} 