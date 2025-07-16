// script.js

document.addEventListener('DOMContentLoaded', () => {
  const storyContainer = document.getElementById('story-container');
  const sourceLabel = document.getElementById('source-label');
  const fileInput = document.getElementById('fileInput');

  // Load default stories from stories.json
  fetch('stories.json')
    .then((response) => response.json())
    .then((data) => renderStories(data.stories))
    .catch((error) => {
      storyContainer.innerHTML = '<p style="color: red;">Failed to load default stories.</p>';
      console.error('Error loading stories.json:', error);
    });

  // When a user uploads a local JSON file
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.stories || !Array.isArray(json.stories)) {
          throw new Error('Invalid format');
        }
        sourceLabel.textContent = `Custom file: ${file.name}`;
        renderStories(json.stories);
      } catch (err) {
        storyContainer.innerHTML = '<p style="color:red;">Failed to load custom file. Make sure it has a "stories" array.</p>';
        console.error('Invalid JSON structure:', err);
      }
    };
    reader.readAsText(file);
  });

  // Render array of stories into the DOM
  function renderStories(stories) {
    storyContainer.innerHTML = ''; // Clear previous stories
    if (stories.length === 0) {
      storyContainer.innerHTML = '<p>No stories found.</p>';
      return;
    }

    stories.forEach((story, index) => {
      const div = document.createElement('div');
      div.className = 'story';

      const title = document.createElement('h2');
      title.textContent = story.title || `Untitled Story #${index + 1}`;

      const author = document.createElement('p');
      author.innerHTML = `<strong>Author:</strong> ${story.author || 'Unknown'}`;

      const content = document.createElement('p');
      content.textContent = story.content || 'No content provided.';

      div.appendChild(title);
      div.appendChild(author);
      div.appendChild(content);
      storyContainer.appendChild(div);
    });
  }
});
