import { getSelectedLanguage, getTranslation } from "./translation.js";

const privacyTexts = {
    en: {
        one: {
            one: `This website is operated by <span class="bold">Javier Sánchez Rojo</span>.`,
            two: 'Protecting your personal data is important. This privacy policy explains what data is collected and how it is used.'
        },
        two: 'Personal data is any information that can identify you, such as your name or email address.',
        three: {
            one: 'If you contact us via the contact form, we collect the information you provide (such as your name and email address).',
            two: `This data is used <span class="bold">only to respond to your inquiry</span>.`,
            three: `The contact form is powered by <span class="bold">Formspree</span>, which processes the data on our behalf.`,
            four: 'Formspree complies with applicable data protection regulations.'
        },
        four: {
            one: 'This website includes embedded content from third-party platforms:',
            two: 'When you visit pages containing these embeds, your IP address and other technical data may be transmitted to these services.',
            three: 'We have no control over how these platforms process your data.',
            four: 'Please refer to their respective privacy policies for more information.'
        },
        five: {
            one: 'This website itself does not set cookies.',
            two: 'However, embedded third-party content may use cookies or similar technologies.'
        },
        six: {
            one: 'Under applicable data protection laws (GDPR), you have the right to:',
            two: 'Access your personal data',
            three: 'Request correction or deletion',
            four: 'Withdraw consent at any time',
            five: 'To exercise these rights, please contact us using the details below.'
        },
        seven: {
            one: 'If you have questions about this privacy policy or your personal data, you can contact:',
            two: `<span class="bold">Email:</span> javiersanroj@gmail.com`
        }
    },
    es: {
        one: {
            one: `Este sitio web es operado por <span class="bold">Javier Sánchez Rojo</span>.`,
            two: 'La protección de sus datos personales es importante. Esta política de privacidad explica qué datos se recopilan y cómo se utilizan.'
        },
        two: 'Los datos personales son cualquier información que permita identificarle, como su nombre o su dirección de correo electrónico.',
        three: {
            one: 'Si se pone en contacto con nosotros a través del formulario de contacto, recopilamos la información que nos proporciona (como su nombre y dirección de correo electrónico).',
            two: `Estos datos se utilizan <span class="bold">únicamente para responder a su consulta</span>.`,
            three: `El formulario de contacto funciona a través de <span class="bold">Formspree</span>, que procesa los datos en nuestro nombre.`,
            four: 'Formspree cumple con la normativa de protección de datos aplicable.'
        },
        four: {
            one: 'Este sitio web incluye contenido incrustado de plataformas de terceros:',
            two: 'Cuando visita páginas que contienen este contenido incrustado, su dirección IP y otros datos técnicos pueden ser transmitidos a estos servicios.',
            three: 'No tenemos control sobre cómo estas plataformas procesan sus datos.',
            four: 'Para más información, consulte las respectivas políticas de privacidad de estos servicios.'
        },
        five: {
            one: 'Este sitio web no utiliza cookies propias.',
            two: 'Sin embargo, el contenido incrustado de terceros puede utilizar cookies u otras tecnologías similares.'
        },
        six: {
            one: 'De acuerdo con la normativa de protección de datos aplicable (GDPR), usted tiene derecho a:',
            two: 'Acceder a sus datos personales',
            three: 'Solicitar la corrección o eliminación de sus datos',
            four: 'Retirar su consentimiento en cualquier momento',
            five: 'Para ejercer estos derechos, puede ponerse en contacto con nosotros utilizando los datos que se indican a continuación.'
        },
        seven: {
            one: 'Si tiene preguntas sobre esta política de privacidad o sobre sus datos personales, puede contactarnos en:',
            two: `<span class="bold">Correo electrónico:</span> javiersanroj@gmail.com`
        }
    }
}

export default async function initPrivacy(barbaContainer) {
    const texts = Array.from(barbaContainer.querySelectorAll('[data-privacy]'));
    displayPrivacyTexts(texts);
}

export function displayPrivacyTexts(texts) {
    texts.forEach(text => displayText(text));
}

function displayText(text) {
    const translatedText = getTranslatedText(text);
    text.innerHTML = translatedText;
}

function getTranslatedText(text) {
    const language = getSelectedLanguage();
    const textData = [language, ...text.dataset.privacy.split('-')];
    return getTranslation(privacyTexts, textData);
}
