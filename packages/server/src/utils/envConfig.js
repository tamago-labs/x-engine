import dotenv from "dotenv"
import { cleanEnv, num, host, port, str, testOnly } from "envalid"

dotenv.config() 

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ devDefault: testOnly("development"), choices: ["development", "production", "test"] }),
    HOST: host({ devDefault: testOnly("localhost") }),
    PORT: port({ devDefault: testOnly(8000) }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
    COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
})