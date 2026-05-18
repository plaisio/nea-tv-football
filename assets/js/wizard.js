

let selectedDistance = null;
let selectedDistanceButton = null;

// Function to handle distance selection
function selectDistance(distance, event) {
  const button = event.target;

    document.getElementById('tv-size-group').classList.remove('hidden');
    document.getElementById('tv-size-group').classList.add('block');
  // Remove the selected class from the previously selected button
  if (selectedDistanceButton) {
    selectedDistanceButton.classList.remove("bg-white", "text-[#121740]");

  }

  // Add the selected class to the clicked button
  button.classList.add("bg-white", "text-[#121740]");
  selectedDistanceButton = button;

  selectedDistance = distance;

  // Set the distance text element to the button's text content
  const distanceTextElement = document.getElementById('distance-text');
  if (distanceTextElement) {
    distanceTextElement.textContent = button.textContent.trim();
  }

  // document.getElementById('tv-size-group').style.display = 'block';
  document.getElementById('recommendation-frame').style.display = 'none';

  // Hide all TV size buttons initially
  document.getElementById('tv-65').classList.add('hidden');
  document.getElementById('tv-75').classList.add('hidden');
  document.getElementById('tv-85').classList.add('hidden');

  // Show TV size buttons based on selected distance
  if (distance >= 270) {
    document.getElementById('tv-65').classList.remove('hidden');
  }
  if (distance >= 310) {
    document.getElementById('tv-75').classList.remove('hidden');
  }
  if (distance >= 320) {
    document.getElementById('tv-85').classList.remove('hidden');
  }
}


let selectedTVSizeButton = null;

// Function to handle TV size selection
function selectTVSize(currentSize, event) {
  if (selectedDistance === null) return;

  if (selectedTVSizeButton) {
    selectedTVSizeButton.classList.remove("bg-white", "text-[#121740]");
  }

  const button = event.target;
  button.classList.add("bg-white", "text-[#121740]");
  selectedTVSizeButton = button;

  // Calculate recommended TV size based on distance
  const recommendedSize = calculateRecommendedSize(selectedDistance);

  // Update badge text based on distance
// const badgeTextElement = document.getElementById('badge-text');

// if (selectedDistance <= 230) {
//   badgeTextElement.textContent = "«Έχω δει και μεγαλύτερες»"; 
// } else if (selectedDistance <= 270) {
//   badgeTextElement.textContent = "«Η μεγάλη…εικόνα»";
// } else if (selectedDistance <= 310) {
//   badgeTextElement.textContent = "«Η Απόλυτη Εμπειρία» ";
// } else {
//   badgeTextElement.textContent = "«Επική Εμβύθιση»";
// }


  // Display the recommendation
  document.getElementById('recommended-size').textContent = `${recommendedSize}"`;
  document.getElementById('recommendation-frame').style.display = 'block';

  // Update images
  document.getElementById('new-tv').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${recommendedSize}.png`;
  document.getElementById('old-tv').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${currentSize}.png`;
  document.getElementById('new-tv-mob').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${recommendedSize}small.png`;
  document.getElementById('old-tv-mob').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${currentSize}small.png`;
  document.getElementById('new-tv-tab').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${recommendedSize}_mob.png`;
  document.getElementById('old-tv-tab').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${currentSize}_mob.png`;
  // document.getElementById('frame-img').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${selectedDistance}.jpg`;
  // document.getElementById('frame-img-mob').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/${selectedDistance}_mob.jpg`;
  // document.getElementById('badge-img').src = `https://res.plaisio.gr/image/upload/Campaigns/B2C-Campaigns/2026/05-nea-tv-football/images/wizard/270.png`;


}

// Function to calculate recommended TV size
function calculateRecommendedSize(distance) {
  if (distance <= 230) return 65; // 65" for ≤230 cm
  if (distance <= 270) return 75; // 75" for ≤270 cm
  if (distance <= 310) return 85; // 85" for ≤310 cm
  if (distance > 310) return 98;  // 98" for >310 cm
  return 65; // Default fallback
}
