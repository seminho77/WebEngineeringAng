const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cache = require('memory-cache');

const app = express();
const PORT = 5000;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const WIKIPEDIA_API_BASE_URL = 'https://en.wikipedia.org/w/api.php';

app.use(cors());
app.use(express.json());

// Fetch bear data
app.get('/api/bears', async (req, res) => {
  const title = req.query.title || 'List_of_ursids';
  const section = req.query.section || 3;
  const cacheKey = `bear_data_${title}_${section}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log('Returning cached bear data');
    return res.json({ wikitext: cachedData });
  }

  try {
    const response = await axios.get(WIKIPEDIA_API_BASE_URL, {
      params: {
        action: 'parse',
        page: title,
        prop: 'wikitext',
        section,
        format: 'json',
        origin: '*',
      },
    });
    const wikitext = response.data?.parse?.wikitext?.['*'];
    if (!wikitext) throw new Error('Invalid bear data from Wikipedia');
    cache.put(cacheKey, wikitext, CACHE_DURATION);
    res.json({ wikitext });
  } catch (error) {
    console.error('Error fetching bear data:', error.message);
    res.status(500).json({ error: 'Failed to fetch bear data' });
  }
});

// Fetch image URL
app.get('/api/images', async (req, res) => {
  const { fileName } = req.query;
  const cacheKey = `image_url_${fileName}`;
  const cachedUrl = cache.get(cacheKey);

  if (cachedUrl) {
    console.log('Returning cached image URL');
    return res.json({ url: cachedUrl });
  }

  try {
    const response = await axios.get(WIKIPEDIA_API_BASE_URL, {
      params: {
        action: 'query',
        titles: `File:${fileName}`,
        prop: 'imageinfo',
        iiprop: 'url',
        format: 'json',
        origin: '*',
      },
    });
    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];
    const imageUrl = page?.imageinfo?.[0]?.url || '';
    cache.put(cacheKey, imageUrl, CACHE_DURATION);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error fetching image URL:', error.message);
    res.status(500).json({ error: 'Failed to fetch image URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
