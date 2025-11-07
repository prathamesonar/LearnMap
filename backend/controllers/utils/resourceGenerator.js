const axios = require('axios');

const serperApiClient = axios.create({
  baseURL: 'https://google.serper.dev',
  headers: {
    'X-API-KEY': process.env.SERPER_API_KEY,
    'Content-Type': 'application/json',
  },
});


const transformToArticles = (organicResults = []) => {
  return organicResults.slice(0, 5).map((item) => ({ // Get top 8
    id: `article-${Math.random().toString(36).substring(2, 9)}`,
    title: item.title,
    source: item.source || 'Web',
    url: item.link,
    difficulty: 'All Levels', 
    readTime: '5-10 min',  
    description: item.snippet || 'No description available.',
  }));
};


const transformToVideos = (organicResults = []) => {
  return organicResults.slice(0, 5).map((item) => ({ // Get top 8
    id: `video-${Math.random().toString(36).substring(2, 9)}`,
    title: item.title,
    source: item.source || 'YouTube',
    url: item.link,
    duration: 'N/A', 
    channel: item.source || 'YouTube',
    description: item.snippet || 'No description available.',
  }));
};


async function searchArticles(query) {
  try {
    const response = await serperApiClient.post('/search', {
      q: `${query} articles OR tutorial`,
      num: 5 
    });
    return transformToArticles(response.data.organic);
  } catch (error) {
    console.error(`Serper article search failed for query "${query}":`, error.message);
    return []; // Return empty on error
  }
}


async function searchVideos(query) {
  try {
    const response = await serperApiClient.post('/search', {
      q: `${query} video tutorial site:youtube.com`,
      num: 5
    });
    return transformToVideos(response.data.organic);
  } catch (error) {
    console.error(`Serper video search failed for query "${query}":`, error.message);
    return []; // Return empty on error
  }
}


function getMockResources(nodeTitle, mainTopic = '') {
  const query = encodeURIComponent(`${mainTopic} ${nodeTitle}`);
  
  return {
    books: [
      {
        id: `book-${Math.random()}`,
        title: `${nodeTitle} Fundamentals`,
        author: 'Expert Author',
        year: 2023,
        rating: 4.5,
        url: `https://www.google.com/search?tbm=bks&q=${query}`,
        description: `Essential reading for mastering ${nodeTitle}.`
      },
      {
        id: `book-${Math.random()}`,
        title: `The ${nodeTitle} Handbook`,
        author: 'Jane Doe',
        year: 2022,
        rating: 4.2,
        url: `https://www.google.com/search?tbm=bks&q=${query}`,
        description: `A practical, hands-on guide.`
      },
      {
        id: `book-${Math.random()}`,
        title: `Learning ${nodeTitle} from Scratch`,
        author: 'John Smith',
        year: 2024,
        rating: 4.7,
        url: `https://www.google.com/search?tbm=bks&q=${query}`,
        description: `The ultimate beginner's guide.`
      }
    ],
    courses: [
      {
        id: `course-${Math.random()}`,
        title: `Mastering ${nodeTitle}`,
        platform: 'Udemy',
        price: '$15.99',
        rating: 4.6,
        students: '50K+',
        url: `https://www.udemy.com/courses/search/?q=${query}`,
        description: `Hands-on course with projects and certifications.`
      },
      {
        id: `course-${Math.random()}`,
        title: `${nodeTitle} Bootcamp 2025`,
        platform: 'Coursera',
        price: 'Free Trial',
        rating: 4.8,
        students: '120K+',
        url: `https://www.coursera.org/search?query=${query}`,
        description: `Join thousands of learners in this top-rated course.`
      },
      {
        id: `course-${Math.random()}`,
        title: `Advanced ${nodeTitle} Concepts`,
        platform: 'Pluralsight',
        price: 'Subscription',
        rating: 4.4,
        students: '15K+',
        url: `https://www.pluralsight.com/search?q=${query}`,
        description: `Take your skills to the next level.`
      }
    ]
  };
}


async function fetchResourcesForNode(node, mainTopic) {
  const query = `${mainTopic} ${node.data.label}`;
  
  const mock = getMockResources(node.data.label, mainTopic);

  const [articleResults, videoResults] = await Promise.all([
    searchArticles(query),
    searchVideos(query)
  ]);

  return {
    articles: articleResults,
    videos: videoResults,
    books: mock.books,
    courses: mock.courses,
  };
}


async function generateResources(nodes, mainTopic) {
  const resources = {};

  const resourcePromises = nodes.map(node => 
    fetchResourcesForNode(node, mainTopic)
  );

  const results = await Promise.allSettled(resourcePromises);

  results.forEach((result, index) => {
    const nodeId = nodes[index].id;
    if (result.status === 'fulfilled') {
      resources[nodeId] = result.value;
    } else {
      console.error(`Failed to fetch resources for node ${nodeId}:`, result.reason.message);
      resources[nodeId] = { articles: [], videos: [], books: [], courses: [] };
    }
  });

  return resources;
}

module.exports = { generateResources, getMockResources };