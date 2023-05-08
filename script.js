/* ==========================================================================
   Constants
   ========================================================================== */

const MODEL = {
    AGREEMENT_TYPE: 'AGREEMENT_TYPE',
    EMPLOYMENT_TYPE: 'EMPLOYMENT_TYPE',
    EMPLOYEE_NAME: 'EMPLOYEE_NAME',
    EMPLOYEE_SOCIAL_SECURITY_NUMBER: 'EMPLOYEE_SOCIAL_SECURITY_NUMBER',
    EMPLOYEE_ADDRESS: 'EMPLOYEE_ADDRESS',
    EMPLOYEE_POSTAL_NUMBER: 'EMPLOYEE_POSTAL_NUMBER',
    EMPLOYEE_CITY: 'EMPLOYEE_CITY',
    EMPLOYMENT_BEGINS: 'EMPLOYMENT_BEGINS',
    EMPLOYMENT_ROLE: 'EMPLOYMENT_ROLE',
    SALARY_INITIAL_AMOUNT: 'SALARY_INITIAL_AMOUNT',
    EMPLOYEE_NOTICE_PERIOD: 'EMPLOYEE_NOTICE_PERIOD',
    EMPLOYER_NOTICE_PERIOD: 'EMPLOYER_NOTICE_PERIOD'
}

const SELECTOR = Object.fromEntries(Object.entries(MODEL).map(([k, v]) => [k, `.${pascalToHyphens(v)}`]));

const STORAGE_KEY = 'agreement';



/* ==========================================================================
   Load Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const agreement = getAgreement();
    const defaultAgreement = getDefaultAgreement();
    hydrate(agreement, defaultAgreement);
});

window.addEventListener('beforeprint', event => {
    document.documentElement.classList.add('print');
});

window.addEventListener('afterprint', event => {
    document.documentElement.classList.remove('print');
});



/* ==========================================================================
   Agreement
   ========================================================================== */

function getAgreement() {
    if (isEmpty(getStoredAgreement())) {
        return getDefaultAgreement()
    }
    return getStoredAgreement();
}

function getStoredAgreement() {
    return Store.get();
}

function getDefaultAgreement() {
    return {
        [MODEL.AGREEMENT_TYPE]: 'new',
        [MODEL.EMPLOYMENT_TYPE]: 'permanent',
        [MODEL.EMPLOYEE_NAME]: 'Anna Bengtsson',
        [MODEL.EMPLOYEE_SOCIAL_SECURITY_NUMBER]: '990102-1234',
        [MODEL.EMPLOYEE_ADDRESS]: 'Cykelstigen 1',
        [MODEL.EMPLOYEE_POSTAL_NUMBER]: '123 45',
        [MODEL.EMPLOYEE_CITY]: 'Diplomatstaden',
        [MODEL.EMPLOYMENT_BEGINS]: '1 jan 2024',
        [MODEL.EMPLOYMENT_ROLE]: 'Designer',
        [MODEL.SALARY_INITIAL_AMOUNT]: '23 400',
        [MODEL.EMPLOYEE_NOTICE_PERIOD]: '1',
        [MODEL.EMPLOYER_NOTICE_PERIOD]: '1',
    };
}

function getEmptyAgreement() {
    return {
        [MODEL.AGREEMENT_TYPE]: 'new',
        [MODEL.EMPLOYMENT_TYPE]: 'permanent',
        [MODEL.EMPLOYEE_NAME]: '',
        [MODEL.EMPLOYEE_SOCIAL_SECURITY_NUMBER]: '',
        [MODEL.EMPLOYEE_ADDRESS]: '',
        [MODEL.EMPLOYEE_POSTAL_NUMBER]: '',
        [MODEL.EMPLOYEE_CITY]: '',
        [MODEL.EMPLOYMENT_BEGINS]: '',
        [MODEL.EMPLOYMENT_ROLE]: '',
        [MODEL.SALARY_INITIAL_AMOUNT]: '',
        [MODEL.EMPLOYEE_NOTICE_PERIOD]: '',
        [MODEL.EMPLOYER_NOTICE_PERIOD]: '',
    };
}



/* ==========================================================================
   Form Functions
   ========================================================================== */

function saveForm() {
    const agreement = extractAgreementFromForm();
    Store.set(agreement);
    location.assign('/');
}

function exampleForm() {
    hydrate(getDefaultAgreement(), getDefaultAgreement());
    // Store.set(null);
    // location.assign('/edit.html');
}

function clearForm() {
    hydrate(getEmptyAgreement(), getDefaultAgreement());
}

function extractAgreementFromForm() {

    const agreement = {};

    for (const [key, value] of Object.entries(SELECTOR)) {
        const inputs = document.querySelectorAll(value);

        if (inputs.length === 1) {

            agreement[key] = inputs[0].value.trim();

        } else if (inputs.length > 1) {

            for (const input of inputs) {
                if (input.checked) {
                    console.log(input.value)
                    agreement[key] = input.value.trim();
                }
            }

        } else {

            console.log('input', value, 'not found')
        }

    }

    return agreement;
}



/* ==========================================================================
   Hydrate
   ========================================================================== */

function hydrate(agreement, defaultAgreement) {

    for (const [key, value] of Object.entries(agreement)) {

        const elements = document.querySelectorAll(SELECTOR[key]);

        if (elements.length === 1) {
            const element = elements[0];

            if (element.tagName === 'INPUT') {

                element.value = value;
                element.setAttribute('value', value);
                element.setAttribute('placeholder', defaultAgreement[key]);

            } else {
                element.innerText = value;
            }
        } else if (elements.length > 1) {

            if (elements[0].tagName === 'INPUT') {
                for (const element of elements) {
                    if (element.value === agreement[key]) {
                        element.checked = true;
                    }
                }

            } else {
                for (const element of elements) {
                    if (!element.matches(`.${agreement[key]}`)) {
                        element.style.display = 'none';
                    }
                }
            }

        } else {

            console.log('Could not hydrate element (not found):', key);
        }
    }
}



/* ==========================================================================
   Helpers
   ========================================================================== */

function pascalToHyphens(pascal) {
    return pascal.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replaceAll('_', '-');
};

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}



/* ==========================================================================
   Store
   ========================================================================== */

const Store = {
    get: () => JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {},
    set: agreement => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(agreement || {}))
}
