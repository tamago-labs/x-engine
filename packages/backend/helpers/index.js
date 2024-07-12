
export const isNumber = (string) => {
    console.log(string)
    const pattern = /^\d+\.?\d*$/;
    return pattern.test(string);  // returns a boolean
}

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