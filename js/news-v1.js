const newsSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=0&single=true&output=csv';

async function fetchDocsData(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('#contents');

        if (!content) {
            console.error('No #contents found in Google Doc!');
            return;
        }
        return content;
    } catch (error) {
        console.log('Error fetching docs data', error);
        return;
    }
}

export async function fetchArticlesData() {
    try {
        const response = await fetch(newsSheetsURL);
        const text = await response.text();
        const rows = text.split(/\r?\n/).map(row => row.split(","));
        const headers = rows[0];

        const data = rows.slice(1).map(row => {
            return Object.fromEntries(
                headers.map((header, i) => {
                    const cell = row[i];
                    return [header.toLowerCase().split(' ')[0], cell];
                }))
        });

        return await Promise.all(data.map(async d => ({
            ...d,
            content: await fetchDocsData(d.googledocs).catch(() => '')
        })))
    } catch (error) {
        console.log('Error fetching sheets data', error);
        return [];
    }
};

function getTimeAgo(date) {
    const timeAgoMs = Date.now() - new Date(date).getTime();

    if (!date || timeAgoMs < 0) return 'today';

    const days = Math.floor(timeAgoMs / 1000 / 60 / 60 / 24);
    const months = Math.floor(days / 30.416);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) {
        return days === 1 ? 'yesterday' : `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return 'today';
}

function formatDate(date, format) {
    if (format === 'us') {
        return date.split('-')[0].length < 4 ? date.split('-').reverse().join('-') : date;
    }
    else if (format === 'eu') {
        return date.split('-')[0].length === 4 ? date.split('-').reverse().join('.') : date;
    }
}

async function appendArticle(articleData, index, container) {
    const { image, date, title, content } = articleData;
    const articleTemplate = `
        <img class="article-image" src="${image}">
        <div class="article-overlay"></div>
        <div class="article-text">
            <p class="article-time-ago">${getTimeAgo(formatDate(date, 'us'))}</p>
            <p class="article-title">${title}</p>
        </div>
        <div class="article-background"></div>
    `;

    const article = document.createElement('li');
    article.classList.add('article');
    article.id = `article-${index}`;
    article.innerHTML = articleTemplate;

    container.appendChild(article);

    if (index === 0) {
        const docContent = content.querySelector('.doc-content');

        if (docContent) {
            docContent.className = '';
            docContent.classList.add('doc-content');
        }

        const links = content.querySelectorAll('a');

        if (links) {
            for (const link of links) {
                link.parentNode.style.textDecoration = 'none';

                const linkColor = getComputedStyle(document.documentElement).getPropertyValue('--color-blue-flashy');
                link.style.color = linkColor;
            }
        }

        currentNewsDate.innerText = formatDate(date, 'eu');
        currentNewsContent.innerHTML = content.innerHTML;
    }
}

export async function displayNewsList(data, container) {
    for (let i = 0; i < data.length; i++) {
        await appendArticle(data[i], i, container);
    }
}

const currentNewsDate = document.getElementById('current-news-date');
const currentNewsContent = document.getElementById('current-news-content');

export function displaySelectedNews(index, data) {
    const { content, date } = data[index];
    const docContent = content.querySelector('.doc-content');

    if (docContent) {
        docContent.className = '';
        docContent.classList.add('doc-content');
    }

    const links = content.querySelectorAll('a');

    if (links) {
        for (const link of links) {
            link.parentNode.style.textDecoration = 'none';

            const linkColor = getComputedStyle(document.documentElement).getPropertyValue('--color-blue-flashy');
            link.style.color = linkColor;
        }
    }

    currentNewsDate.innerText = formatDate(date, 'eu');
    currentNewsContent.innerHTML = content.innerHTML;
}

