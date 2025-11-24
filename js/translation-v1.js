// Object storing all the translations. It follows the structure 'language' => 'page' => 'section'.
const translations = {
    es: {
        home: {
            navbar: ['biografía', 'medios', 'conciertos', 'contacto'],
            subheaders: ['saxofonista', 'clarinetista', 'compositor'],
            news: ['novedades']
        }

    },
    en: {
        home: {
            navbar: ['biography', 'medias', 'concerts', 'contact'],
            subheaders: ['saxophonist', 'clarinetist', 'composer'],
            news: ['news']
        }
    }
}

// Iterate through the translations to find the corresponding texts. 
// The keys passed into the function have to match the order and names of the keys inside the translations object.
function findText(object, keys, keyIndex = 0) {
    const entries = Object.entries(object);
    const firstKey = entries[0][0];

    if (firstKey === '0') {
        return Object.values(object);
    }

    for (const entry of entries) {
        if (entry[0] === keys[keyIndex]) {
            const result = findText(entry[1], keys, keyIndex + 1);
            if (result !== undefined) return result;
        }
    }
}

export function translate(language, page, textContainers) {
    textContainers.forEach((container, i) => {
        const section = Array.from(container.classList)
            .filter(className => className.includes('translation'))
            .map(className => className.split('-')[1])
            .join('');
        const keys = [language, page, section];
        const translatedText = findText(translations, keys)[i];

        container.textContent = translatedText;
    })
}