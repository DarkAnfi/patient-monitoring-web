
export const formatNumber = (amount: string | number, prefix = '$', sufix = '') => {
    const negative = parseInt(`${amount}`) < 0 ? '-' : '';
    return `${negative}${prefix}${Math.abs(parseInt(`${amount}`)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${!!sufix ? ` ${sufix}` : ''}`;
};

export const formatToRut = (rut: string) => {
    return `${rut.replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const formatToPhone = (phone: string) => {
    return `${phone.substr(0, 4)} ${phone.substr(4, 4)} ${phone.substr(8)} `;
};


const _words: Dict<string> = {
    'l.t.d': 'LTD',
    'l.t.d.': 'LTD',
    'lt': 'LT',
    'lt.': 'LT',
    'ltda': 'LTDA',
    'ltda.': 'LTDA',
    'limitada': 'LTDA',
    'limitada.': 'LTDA',
    'limit': 'LTDA',
    'ei': 'EI',
    'ei.': 'EI',
    'e.i.': 'EI',
    'e.i': 'EI',
    'e.r.l': 'ERL',
    'e.r.l.': 'ERL',
    'erl': 'ERL',
    'e.i.r': 'EIR',
    'e.i.r.': 'EIR',
    'eirl': 'EIRL',
    'eirl.': 'EIRL',
    'e.i.r.l.': 'EIRL',
    'e.i.r.l': 'EIRL',
    'irl': 'IRL',
    'i.r.l': 'IRL',
    'i.r.l.': 'IRL',
    'cia.': 'CIA',
    'cia': 'CIA',
    'cia.l': 'CIA LTDA',
    'cia.ltda': 'CIA LTDA',
    'cia.ltda.': 'CIA LTDA',
    'sp': 'SP',
    'sa': 'SA',
    's.a': 'SA',
    'sa.': 'SA',
    's.a.': 'SA',
    'spa': 'SPA',
    'spa.': 'SPA',
    's.p.a': 'SPA',
    's.p.a.': 'SPA',
    //
    'spda': 'SPDA',
    'gmr': 'GMR',
    'jdc': 'JDC',
    //
    's0tomayor': 'sotomayor',
    '0tro': 'otro',
    '0liva': 'oliva',
    '(': '',
    '(cc)': '(CC)'
};

// "E I R L"
// "EI R L"
// "S P A"

export const getNormalizeWord = (word: string) => {
    const newWord = word.toLowerCase();
    if (!!_words[newWord]) {
        return _words[newWord];
    } else {
        return word;
    }
};

export const normalizeStringName = (text: string, useDict = false) => {
    if (!text) return '';
    let newText = text.toUpperCase().trim().replaceAll(/\s+/g, ' ').replace('constructor', 'construc.').split(' ');

    newText = newText.map((str) => `${str[0]}${str.substring(1).toLowerCase()}`);

    if (useDict) {
        newText = newText.map((str) => getNormalizeWord(str));
    }

    return newText.join(' ');
};

export const symbolFormatter = (num: number, digits: number) => {
    const isNegative = num < 0;
    num = Math.abs(num);
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "C" },
        { value: 1e18, symbol: "Q" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return (isNegative ? '-' : '') + (item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0");
};