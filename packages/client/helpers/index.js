export const slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')                   // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};


export const shortText = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}