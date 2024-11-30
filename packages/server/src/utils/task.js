import FirecrawlApp from '@mendable/firecrawl-js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || ""

const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

export const attachValues = async (input) => {

    let output = []

    for (let task of input) {

        if (task.is_source_code === true) {

            const raw_source_code = task.resources[0]

            output.push({
                id: task.id,
                value: [
                    task.user_prompt,
                    `${Buffer.from(raw_source_code, 'base64').toString('utf8')}`,
                ].join("")
            })
        } else {

            let values = []
            values.push(task.user_prompt)

            for (let r of task.resources) {
                const result = (await app.scrapeUrl(r, { formats: ['markdown', 'html'] })).data.markdown
                values.push(result)
            }

            output.push({
                id: task.id,
                value: values.join("")
            })
        }

    }

    return output
}