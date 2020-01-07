const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.input-query');
const userProfile = document.querySelector('.user-profile');
const userRepos = document.querySelector('.user-repos');
const profileContainer = document.querySelector('.user-info');
const api_root = 'https://api.github.com/users';

function findUser(username) {
	return fetch(`${api_root}/${username}`)
			.then(response => response.json())
			.catch(err => console.log(err));
}

function getRepos(username) {
	return fetch(`${api_root}/${username}/repos?per_page=20`)
			.then(response => response.json())
			.catch(err => console.log(err))
}

function displayUserInfo(username) {
	if(username.name !== null && username.bio !== null) {
		userProfile.innerHTML = `
			<img src="${username.avatar_url}" alt="user's avatar image">
			<span class="name">${username.name}</span>
			<span class="login">${username.login}</span>
			<a class="github-profile" href="${username.html_url}">View profile on GitHub</a>
			<p><em>Bio:</em> ${username.bio}</p>
			<div class="follow">
				<p><em>Followers:</em> ${username.followers}</p>
				<p><em>Following:</em> ${username.following}</p>
			</div>
			<p><em>Number of public repositories:</em> ${username.public_repos}</p>
		`
	} else if(username.name === null && username.bio === null) {
		userProfile.innerHTML = `
			<img src="${username.avatar_url}" alt="user's avatar image">
			<span class="login">${username.login}</span>
			<a class="github-profile" href="${username.html_url}">View profile on GitHub</a>
			<p><em>Bio:</em> No bio available for this user</p>
			<div class="follow">
				<p><em>Followers:</em> ${username.followers}</p>
				<p><em>Following:</em> ${username.following}</p>
			</div>
			<p><em>Number of public repositories:</em> ${username.public_repos}</p>
		`
	} else if(username.name === null) {
		userProfile.innerHTML = `
			<img src="${username.avatar_url}" alt="user's avatar image">
			<span class="login">${username.login}</span>
			<a class="github-profile" href="${username.html_url}">View profile on GitHub</a>
			<p><em>Bio:</em> ${username.bio}</p>
			<div class="follow">
				<p><em>Followers:</em> ${username.followers}</p>
				<p><em>Following:</em> ${username.following}</p>
			</div>
			<p><em>Number of public repositories:</em> ${username.public_repos}</p>
		`
	} else if(username.bio === null) {
		userProfile.innerHTML = `
			<img src="${username.avatar_url}" alt="user's avatar image">
			<span class="name">${username.name}</span>
			<span class="login">${username.login}</span>
			<a class="github-profile" href="${username.html_url}">View profile on GitHub</a>
			<p><em>No Bio</em></p>
			<div class="follow">
				<p><em>Followers:</em> ${username.followers}</p>
				<p><em>Following:</em> ${username.following}</p>
			</div>
			<p><em>Number of public repositories:</em> ${username.public_repos}</p>
		`
	}
}

function displayUserRepos(userRepo) {
	let markup = `<h1 class="repos-header">User Repositories:</h1>`;
	if(userRepo == false) {
		userRepos.innerHTML =`
			<h1>This user has no repositories yet.</h2>
			`
	}
	else {
		userRepo.map(repo => {
			if(repo.description === null) {
				return markup += `
				<p class="repo-link"><a href="${repo.html_url}">${repo.name}</a></p>
				<hr>
				`
			} else {
				return markup += `
				<p class="repo-link"><a href="${repo.html_url}">${repo.name}</a></p>
				<p class="repo-description">${repo.description}</p>
				<hr>
				`
			}
		})
		userRepos.innerHTML = markup
	}
}

function loadSpinner() {
		const spinner = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif';
		const img = `<img src="${spinner}" id="spinner"/>`;
		userProfile.innerHTML = img;
		userRepos.innerHTML = img;
}

const renderUser = async function(username) {
	username = searchInput.value;
	if(username === '') {
		alert('Please enter a username!');
	} else {
		const user = await findUser(username);
		console.log(user);
		if(user.message === "Not Found") {
			profileContainer.innerHTML = `
				<p class="error-message">Sorry, the username you entered is either incorrect or does not exist. Please try again with a correct username.</p>
			`
		} else {
			loadSpinner();
			profileContainer.innerHTML = '';
			profileContainer.appendChild(userProfile);
			profileContainer.appendChild(userRepos);
			displayUserInfo(user);
			const repos = await getRepos(username);
			displayUserRepos(repos);
		}
			searchInput.value = '';
	}
}

searchButton.addEventListener('click', renderUser)