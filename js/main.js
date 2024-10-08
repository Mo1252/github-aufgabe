document.getElementById('searchBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {

        fetchUserRepos(username);
    }
});

function displayError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
}

function clearError() {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';
}

function clearRepoList() {
    const reposList = document.getElementById('repoList');
    reposList.innerHTML = '';
}

function clearDatails() {
    const issuesList = document.getElementById('issues');
    const commitsList = document.getElementById('commits');
    commitsList.innerHTML = '';
    issuesList.innerHTML = '';
}

async function fetchUserRepos(username) {
    clearError();
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=10`)
        const repos = await response.json();
        if (repos.length === 0) {
            displayError('Der Benutzer hat keine Repositories');
        } else {
            displayUserRepos(repos);
        
        }
    } catch (error) {
        displayError('Der Benutzer wurde nicht gefunden');
    }
}

function displayUserRepos(repos) {
    clearDatails();
    const reposList = document.getElementById('repoList');
    reposList.innerHTML = '';
    repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.name;
        reposList.appendChild(li);
        li.addEventListener('click', () => fetchRepoDetails(repo.owner.login, repo.name));
    });
}


async function fetchRepoDetails(username, repoName) {
    setUrlParams({ username, repoName });
    try {
        const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/issues`);
        const issues = await issuesResponse.json();
        const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`);
        const commits = await commitsResponse.json();
        displayCommitsIssues(issues, commits);
      
    } catch (error) {
        displayError('Fehler beim Abrufen der Repository-Details');
    }
}

function displayCommitsIssues(issues, commits) {
    clearRepoList();
    const issuesList = document.getElementById('issues');
    const commitsList = document.getElementById('commits');
    const commitsTitle = document.getElementById('commit-title');
    const issuesTitle = document.getElementById('issues-title');
    issuesList.innerHTML = '';
    commitsList.innerHTML = '';
    commitsTitle.innerHTML = '<h5 class="mt-4"><strong>Commits von diesem Repository</strong></h5>'
    issuesTitle.innerHTML = '<h5><strong>Issues von diesem Repository</strong></h5>'

    commits.forEach(commit => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${commit.commit.message}</strong></br> erstellt von ${commit.commit.author.name} am ${new Date(commit.commit.author.date).toLocaleDateString()}<br><a href="${commit.html_url}" class="btn-commit mt-3 d-inline-block" target="_blank" >Zum Commit</a>`;
        commitsList.appendChild(li);
    })
    issues.forEach(issue => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${issue.title}</strong> erstellt am ${new Date(issue.created_at).toLocaleDateString()} von  ${issue.user.login}<br><a href="${issue.html_url}" class="btn-commit  mt-3 d-inline-block" target="_blank">Zum Issue</a>`;
        issuesList.appendChild(li);
    })
}



document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    if (params.username) {
        document.getElementById('username').value = params.username;
        fetchUserRepos(params.username);
    }
});

function setUrlParams(params) {
    const url = new URL(window.location.href);
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            url.searchParams.set(key, params[key]);
        }
    }
    window.history.pushState({}, '', url);
}



function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        username: urlParams.get('username'),
        repoName: urlParams.get('repoName')
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = getUrlParams();
    if (params.username) {
        document.getElementById('username').value = params.username;
        await fetchUserRepos(params.username);
        if (params.repoName) {
            fetchRepoDetails(params.username, params.repoName);
        }
    }
});