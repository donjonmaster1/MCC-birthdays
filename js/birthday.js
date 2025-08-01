const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6UWkrXc1MeakaaZJPYzsxMO8qhN4Ds5ywb_o7sgmvw9ucISmUmJ-qBhe8po85tzVWunSeUpE0bmUr/pub?output=csv'; // replace with your sheet's CSV export URL
const BASE_IMAGE_SRC = 'Happy Birthday Template.jpg'; // put your base image in repo and reference here

const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('generateBtn');
const messageDiv = document.getElementById('message');

btn.addEventListener('click', async () => {
  messageDiv.textContent = 'Loading birthdays...';
  console.log('🟢 Button clicked');

  try {
    const res = await fetch(SHEET_CSV_URL);
    console.log('🟢 Fetched sheet:', res.status);

    if (!res.ok) throw new Error('Failed to fetch birthday sheet.');
    const csvText = await res.text();
    console.log('🟢 Sheet content:', csvText);

    const birthdays = parseCSV(csvText);
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    console.log('🟢 Today is:', todayStr);

    const matches = birthdays.filter(row => row.birthday === todayStr);
    console.log('🟢 Matches found:', matches);

    if (matches.length === 0) {
      messageDiv.textContent = "No birthdays today.";
      clearCanvas();
      return;
    }

    const name = matches[0].name;
    messageDiv.textContent = `Happy Birthday, ${name}!`;
    console.log('🟢 Drawing image for:', name);

    await generateImage(name);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    console.error('🔴 Error in main flow:', err);
    clearCanvas();
  }
});


    // Find matching birthday(s)
    const matches = birthdays.filter(row => row.birthday === todayStr);

    if (matches.length === 0) {
      messageDiv.textContent = "No birthdays today.";
      clearCanvas();
      return;
    }

    // For simplicity, pick first match if multiple
    const name = matches[0].name;
    messageDiv.textContent = `Happy Birthday, ${name}!`;

    await generateImage(name);
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    clearCanvas();
  }
});

function parseCSV(text) {
  // Very simple CSV parser assuming no commas inside fields
  const lines = text.trim().split('\n');
  const rows = lines.slice(1).map(line => {
    const [name, birthday] = line.split(',');
    return { name: name.trim(), birthday: birthday.trim() };
  });
  return rows;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function generateImage(name) {
  const img = new Image();
  img.src = BASE_IMAGE_SRC;
  await img.decode(); // wait for image to load

  // Draw base image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Draw black bar at bottom (~15% height)
  const barHeight = canvas.height * 0.15;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

  // Draw name in white, large font, centered vertically & horizontally in bar
  ctx.fillStyle = 'white';
  const fontSize = barHeight * 0.6;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(name, canvas.width / 2, canvas.height - barHeight / 2);
}
