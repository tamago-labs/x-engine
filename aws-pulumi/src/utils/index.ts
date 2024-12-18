

export const parseBody = (event: any) => {
    let { body, isBase64Encoded } = event

    if (isBase64Encoded === true) {
        const base64String = body
        const buff: any = Buffer.from(base64String, "base64");
        const eventBodyStr = buff.toString('UTF-8');
        body = JSON.parse(eventBodyStr);
    } else {
        body = JSON.parse(body);
    }
    return body
}

export const roundWeek = (weeks: number, d: Date) => {
    const first_sunday = 60 * 60 * 24 * 4 * 1000 // seconds between Sunday and Thursday
    const WEEK_IN_MS = 60 * 60 * 24 * 7 * 1000; // week in ms
    const index = Math.floor((d.getTime() / (WEEK_IN_MS * weeks)));
    return new Date(index * WEEK_IN_MS * weeks - first_sunday)
}