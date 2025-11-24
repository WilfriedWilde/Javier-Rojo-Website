export async function injectHTML (id, page) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const response = await fetch(page);
    const html = await response.text();

    element.innerHTML = html;
}