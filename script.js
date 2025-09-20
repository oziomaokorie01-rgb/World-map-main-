// Event Data: name, city, date, image, description, type, coords
const events = [
  {
    name: "Composability Day",
    city: "Denver, USA",
    date: "Feb 2024",
    img: "images/denver.png",
    type: "past",
    coords: [39.7392,-104.9903],
    desc: "An afternoon event where we discussed all things composability."
  },
  {
    name: "Espresso Brews",
    city: "San Francisco, USA",
    date: "March 2024",
    img: "images/san-francisco.png",
    type: "past",
    coords: [37.7749,-122.4194],
    desc: "With Electric Capital during ETHSF week."
  },
  {
    name: "Mainnet Speech",
    city: "New York, USA",
    date: "April 2024",
    img: "images/new-york.png",
    type: "past",
    coords: [40.7128,-74.0060],
    desc: "Espresso CEO Benafisch speaking at mainnet in New York."
  },
  {
    name: "Crypto Cannes",
    city: "Cannes, France",
    date: "May 2024",
    img: "images/cannes.png",
    type: "past",
    coords: [43.5528,7.0174],
    desc: "Espresso in Cannes with pétanque tourney and crypto chats."
  },
  {
    name: "Back to Future",
    city: "Bangkok, Thailand",
    date: "June 2024",
    img: "images/bangkok.png",
    type: "past",
    coords: [13.7563,100.5018],
    desc: "Back to the Future event in Bangkok featuring Cartesi + Espresso apps."
  },
  {
    name: "EthCC Brussels",
    city: "Brussels, Belgium",
    date: "July 2024",
    img: "images/brussels.png",
    type: "past",
    coords: [50.8503,4.3517],
    desc: "Cartesi x Espresso at EthCC Brussels exploring modular blockchain futures."
  },
  {
    name: "ETHBerlin Judge",
    city: "Berlin, Germany",
    date: "Aug 2024",
    img: "images/berlin.png",
    type: "past",
    coords: [52.5200,13.4050],
    desc: "Espresso Systems Product Manager judging at ETHBerlin."
  },
  {
    name: "Seoul Meetup",
    city: "Seoul, South Korea",
    date: "Sept 2025",
    img: "images/seoul.png",
    type: "future",
    coords: [37.5665,126.9780],
    desc: "Espresso happy hour in Seoul with swag and top-secret drop."
  },
  {
    name: "Buenos Aires Meetup",
    city: "Buenos Aires, Argentina",
    date: "Sept 2025",
    img: "images/buenos-aires.png",
    type: "future",
    coords: [-34.6037,-58.3816],
    desc: "Future Espresso meetup in Buenos Aires (details coming soon)."
  }
];

// Custom 10x10px icons
const pastIcon = L.icon({
  iconUrl: 'images/past.png',
  iconSize: [10, 10]
});
const futureIcon = L.icon({
  iconUrl: 'images/future.png',
  iconSize: [10, 10]
});

// Map setup (dark theme)
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
}).addTo(map);

// Marker and event popup logic
let markers = [], currentIndex = 0;
events.forEach((ev,i) => {
  const icon = ev.type === "past" ? pastIcon : futureIcon;
  const marker = L.marker(ev.coords, {icon})
    .bindPopup(`
      <b>${ev.name}</b> <br>
      <small>${ev.city}, ${ev.date}</small><br>
      <img src="${ev.img}" alt="${ev.name}"><br>
      <span style="color:#bbb;font-size:13px;">${ev.desc}</span>
    `)
    .addTo(map);
  markers.push(marker);
});

// Event cards below map
function renderCards(selectedIdx) {
  const container = document.getElementById("eventCards");
  container.innerHTML = "";
  events.forEach((ev, i) => {
    container.innerHTML += `
      <div class="event-card${selectedIdx===i?' selected':''}" id="event-card-${i}">
        <h4>${ev.name}</h4>
        <div><b>City:</b> ${ev.city}</div>
        <div><b>Date:</b> ${ev.date}</div>
        <img src="${ev.img}" alt="${ev.name}">
        <div class="desc">${ev.desc}</div>
      </div>
    `;
  });
}

// Navigation logic
function showEvent(idx) {
  if (idx < 0) idx = events.length - 1;
  if (idx >= events.length) idx = 0;
  currentIndex = idx;
  map.setView(events[currentIndex].coords, 4);
  markers[currentIndex].openPopup();
  renderCards(currentIndex);
  // Scroll event card into view for accessibility
  setTimeout(() => {
    const el = document.getElementById(`event-card-${currentIndex}`);
    if (el) el.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }, 100);
}
function prevEvent() { showEvent(currentIndex-1); }
function nextEvent() { showEvent(currentIndex+1); }
renderCards(currentIndex);
showEvent(currentIndex);

// Clicking event card opens popup and centers map
document.getElementById("eventCards").addEventListener("click", (e) => {
  const card = e.target.closest(".event-card");
  if (!card) return;
  const idx = Array.from(document.getElementsByClassName("event-card")).indexOf(card);
  if (idx >= 0) showEvent(idx);
});