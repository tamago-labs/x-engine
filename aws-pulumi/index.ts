import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import { createTables } from "./infrastructure/dynamoDB"
import { getUserById } from "./src/api/routes/user"

const config = new pulumi.Config("project")
const projectName = config.get("name")

// Setup DynamoDB tables
const { usersTable } = createTables()

const generateParams = (event: any) => {
    return {
        event, 
        usersTableName: usersTable.name.get()
    }
}

// Setup all API endpoints

const projectAPI = new apigateway.RestAPI(`${projectName}-api`, {
    stageName: projectName?.includes("prod") ? "prod" : projectName?.includes("test") ? "test" : "dev",
    routes: [
        // {
        //     method: "GET",
        //     path: "/home",
        //     eventHandler: new aws.lambda.CallbackFunction(`${projectName}-home`, {
        //         callback: async (event) => await getHome(generateParams(event)),
        //     })
        // }, 
        {
            method: "GET",
            path: "/user/{proxy+}",
            eventHandler: new aws.lambda.CallbackFunction(`${projectName}-user`, {
                callback: async (event) => await getUserById(generateParams(event))
            }),
            apiKeyRequired: true
        }
    ]
})

// Create an API key to manage usage
const apiKey = new aws.apigateway.ApiKey(`${projectName}-api-key`);

// Define usage plan for an API stage
const usagePlan = new aws.apigateway.UsagePlan(`${projectName}-usage-plan`, {
    apiStages: [{
        apiId: projectAPI.api.id,
        stage: projectAPI.stage.stageName
    }],
});

// Associate the key to the plan
// tslint:disable-next-line:no-unused-expression
new aws.apigateway.UsagePlanKey(`${projectName}-usage-plan-key`, {
    keyId: apiKey.id,
    keyType: "API_KEY",
    usagePlanId: usagePlan.id,
});

export const url = projectAPI.url;
export const apiKeyValue = apiKey.value;