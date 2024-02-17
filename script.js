// Function to fetch news data from NewsAPI

window.addEventListener("load", () => {
    createNewsCards("all");
    attachCategoryEventListeners();
});

function reload() {
    window.location.reload();
}

//https://newsapi.org/v2/everything?q=keyword&apiKey=5a24983322a249eaaeafcc4638851ee7
// https://newsapi.org/v2/everything?q=all&apiKey=5a24983322a249eaaeafcc4638851ee7
//api; pub_38332b4a075d7cf4b96cbf44c3c6974da3d9f
// https://newsdata.io/api/1/news?apikey=pub_38332b4a075d7cf4b96cbf44c3c6974da3d9f&q=pizza
//https://newsapi.org/v2/everything?q=${category}&apiKey=${apiKey}
// async function fetchNews(category) {
//     const apiKey = 'pub_38332b4a075d7cf4b96cbf44c3c6974da3d9f';
//     const apiUrl = 'https://newsdata.io/api/1/news?apikey=${apiKey}&q=${category}';

//     try {
//     const response = await fetch(apiUrl);

//     if (!response.ok) {
//         throw new Error(`Failed to fetch news. Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.articles;
//     } catch (error) {
//     console.error('Error fetching news:', error);
//     return [];
//     }
// }

//updated code--------------------------------------
async function fetchNews(category) {
  const apiKey = process.env.NEWS_API_KEY; // Use environment variable for secure storage
  const apiUrl = `https://newsapi.org/v2/everything?q=${category}&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text(); // Try to get more details from the response
      throw new Error(`Failed to fetch news. Status: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return []; // Return an empty array on error
  }
}

//---------------------------------------------------

// Create a Set to store unique article URLs
const uniqueArticles = new Set();

// Function to create news cards and populate with data
async function createNewsCards(category) {
    const newsContainer = document.querySelector('.news-container');

    const newsData = await fetchNews(category);

    newsData.forEach(article => {
        // Check if the article URL is already added
        if (!uniqueArticles.has(article.url)) {
            const card = document.createElement('div');
            card.classList.add('news-card');

            // Populate card content...

            const image = document.createElement('img');
            image.src = article.urlToImage || 'placeholder.jpg';
            image.alt = 'News Image';
            card.appendChild(image);

            const title = document.createElement('h2');
            title.classList.add('news-title');
            title.textContent = article.title || 'News Title';
            card.appendChild(title);

            const source = document.createElement('p');
            source.classList.add('news-source');
            source.textContent = `Source: ${article.source.name || 'Unknown Source'}`;
            card.appendChild(source);

            const date = document.createElement('p');
            date.classList.add('news-date');
            date.textContent = article.publishedAt ? new Date(article.publishedAt).toDateString() : 'Unknown Date';
            card.appendChild(date);

            const summary = document.createElement('p');
            summary.classList.add('news-summary');
            summary.textContent = article.description || 'News summary not available.';
            card.appendChild(summary);

            const articleLink = document.createElement('a');
            articleLink.href = article.url; // Use the article URL from the API response
            articleLink.target = '_blank'; // Open in a new window/tab

            // Add a click event listener to the card
            card.addEventListener('click', function () {
                articleLink.click(); // Programmatically trigger the link click
            });
            card.appendChild(articleLink);

            newsContainer.appendChild(card);

            // Add the article URL to the Set to prevent duplicates
            uniqueArticles.add(article.url);
        }
    });
}


// Call the function to populate news cards
createNewsCards("all");

// Function to filter news by category and populate news cards
async function filterAndDisplayNews(category) {
    console.log('Selected Category:', category);

    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = ''; // Clear existing news cards

    createNewsCards(category);

    // const newsData = await fetchNews(category);
    // const newsCardTemplate = document.getElementById('news-card-template');

    // newsData.forEach(article => {
    //     console.log('Article Category:', article.category);

    //     if (category === 'all' || (article.category && article.category.toLowerCase() === category.toLowerCase())) {
    //         const cardClone = newsCardTemplate.content.cloneNode(true);
    //         const card = cardClone.querySelector('.news-card');

    //         // Populate card content as before...
    //         const image = card.querySelector('img');
    //         image.src = article.urlToImage || 'placeholder.jpg';
    //         image.alt = 'News Image';

    //         const title = card.querySelector('.news-title');
    //         title.textContent = article.title || 'News Title';

    //         const source = card.querySelector('.news-source');
    //         source.textContent = `Source: ${article.source.name || 'Unknown Source'}`;

    //         const date = card.querySelector('.news-date');
    //         date.textContent = article.publishedAt ? new Date(article.publishedAt).toDateString() : 'Unknown Date';

    //         const summary = card.querySelector('.news-summary');
    //         summary.textContent = article.description || 'News summary not available.';

    //         newsContainer.appendChild(cardClone);
    //     }
    // });
}

// Event listeners for category clicks
// document.querySelector('.finance-category').addEventListener('click', function () {
//     filterAndDisplayNews('finance');
//     filterAndDisplayNews('business');
//     filterAndDisplayNews('economy');
// });
// document.querySelector(".technology-category").addEventListener('click', function () {
//     filterAndDisplayNews('technology');
//     filterAndDisplayNews('artificial inteligence');
// });
// document.querySelector('.sports-category').addEventListener('click', function () {
//     filterAndDisplayNews('sports');
//     filterAndDisplayNews('football');
//     filterAndDisplayNews('hockey');
//     filterAndDisplayNews('asia%20cup');
//     filterAndDisplayNews('world%20cup');
//     filterAndDisplayNews('basketball');
// });

// document.querySelector('.politics-category').addEventListener('click', function () {
//     filterAndDisplayNews('politics');
//     filterAndDisplayNews('government');
//     filterAndDisplayNews('elections');
//     filterAndDisplayNews('russia');
    
// });

// // Default to displaying all news
// filterAndDisplayNews('all');


// Function to attach event listeners to category links
function attachCategoryEventListeners() {
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior
            const category = link.getAttribute('id');
            console.log(category);
            filterAndDisplayNews(category);
        });
    });
}

// Call the function to attach event listeners
attachCategoryEventListeners();

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    console.log(query);
    if (!query) return;
    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = '';
    createNewsCards(query);
});
