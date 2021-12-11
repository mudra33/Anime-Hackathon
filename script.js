const anime_url = 'https://api.jikan.moe/v3';

async function searchAnime(event) {
	event.preventDefault();
	const form = new FormData(this);
	const query = form.get('search') ? form.get('search') : 'naruto';
	try {
		const data = await fetch(`${anime_url}/search/anime?q=${query}&page=1`);
		res = await data.json();
		updateDom(res);
	} catch (err) {
		console.log(err);
	}
}

function pageStart() {
	const form = document.getElementById('search_form');
	form.addEventListener('submit', searchAnime);
}

function updateDom(data) {
	const searchResults = document.getElementById('search-results');

	const animeByCategories = data.results.reduce((acc, anime) => {
		const { type } = anime;
		if (acc[type] === undefined) acc[type] = [];
		acc[type].push(anime);
		return acc;
	}, {});

	searchResults.innerHTML = Object.keys(animeByCategories)
		.map((key) => {
			const animesHTML = animeByCategories[key]
				.sort((a, b) => a.episodes - b.episodes)
				.map((anime) => {
					return `
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${anime.title}</span>
                            <p>${anime.synopsis}</p>
                        </div>
                        <div class="card-action">
                            <a href="${anime.url}">Find out more</a>
                        </div>
                        <div class="card-content">
                        <p>Start Date :: ${anime.start_date}</p>
                        <p>End Date :: ${anime.end_date}</p>
                        </div>
                        <div class="card-content">
                        <p> Type :: ${anime.type}</p>
                        <p> IMDB Ratings :: ${anime.rated}  ${anime.score}</p>

                        </div>
                    </div>
                        
                    </div>
                    </div>
                `;
				})
				.join('');

			return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="kemicofa-row">${animesHTML}</div>
                </section>
            `;
		})
		.join('');
}

window.addEventListener('load', pageStart);
