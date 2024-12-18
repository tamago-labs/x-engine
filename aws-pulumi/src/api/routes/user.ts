import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { ScanCommand, QueryCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { headers } from "../../utils/headers"
import { parseBody } from "../../utils/index"


export const getUserById = async (params: any) => {

    const { event } = params

    console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    try {

        if (event && event.pathParameters) {

            const userId = event.pathParameters.proxy

            const client = new DynamoDBClient()

            const command = new GetCommand({
                TableName: params.usersTableName,
                Key: {
                    "user_id": userId
                }
            });

            const { Item } = await client.send(command)

            if (Item) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        status: "ok",
                        user: Item
                    }),
                }
            } else {

                const Item = {
                    user_id: userId,
                    credits: 100,
                    messages: [
                        "An initial credit of 100 credits has been applied to your account"
                    ],
                    timestamps: [
                        new Date().valueOf()
                    ],
                    created_at: (new Date().valueOf())
                }

                const command = new PutCommand({
                    TableName: params.usersTableName,
                    Item
                })

                await client.send(command)

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        status: "ok",
                        user: Item
                    })
                }

            }

        }

        throw new Error("Invalid user ID")

    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                status: "error",
                message
            }),
        }
    }

}