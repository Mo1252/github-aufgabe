

document.getElementById('searchBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        fetchUserRepos(username);
    }
});



console.log("test")
async function fetchUserRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=10`);
        const repos = await response.json();
        displayUserRepos(repos);
    } catch (error) {
        displayError('Fehler');
    }
}


    
function displayUserRepos(repos)
{
    const reposList =document.getElementById('repoList');
    reposList.innerHTML = '';
    repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.name;
        reposList.appendChild(li);
    });

}  
