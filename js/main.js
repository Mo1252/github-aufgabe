





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
        if (repos == '') {
            displayError('Die Bunetzer hat kein repositories');
        }
        displayUserRepos(repos);
    } catch (error) {
        displayError('Die Bunetzer wurde nicht gefunden');
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
    try {
        const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/issues`);
        const issues = await issuesResponse.json();
        const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`);
        const commits = await commitsResponse.json();
        displayCommitsIssues(issues, commits)
    } catch (error) {
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
    commitsTitle.innerHTML = '<h2>Commits von diesem Reposotories</h2>'
    issuesTitle.innerHTML = '<h2>Issues von diesem Reposotories</h2>'

    commits.forEach(commit => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${commit.commit.message}</strong></br> erstellt von ${commit.commit.author.name}  am ${new Date(commit.commit.author.date)}<br><a href="${commit.html_url}" class="btn-commit mt-3 d-inline-block"">Zum Commit</a>`;
        console.log(commit.commit.message)
        commitsList.appendChild(li);
    })
    issues.forEach(issue => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${issue.title}</strong> erstellet am ${new Date(issue.created_at)} von  ${issue.user.login}<br><a href="${issue.html_url}" class="btn-commit  mt-3 d-inline-block">Zum Issue</a>`;
        issuesList.appendChild(li);
    })
}

