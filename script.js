const repositoryList = document.querySelector("#starred");
const repositoryCount = document.querySelector("#repo-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(new Date(`${dateString}T00:00:00Z`));
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repository";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;

  const date = document.createElement("time");
  date.className = "repository-date";
  date.dateTime = repository.starredAt;
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";
  metadata.textContent = repository.language;

  item.append(link, date, description, metadata);
  return item;
}

async function renderRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;

    if (repositories.length === 0) {
      repositoryList.innerHTML = '<li class="list-status">No starred repositories yet.</li>';
    }
  } catch (error) {
    repositoryCount.textContent = "";
    repositoryList.innerHTML = '<li class="list-status">Could not load repositories. Please try again later.</li>';
    console.error("Unable to load starred repositories:", error);
  }
}

renderRepositories();
