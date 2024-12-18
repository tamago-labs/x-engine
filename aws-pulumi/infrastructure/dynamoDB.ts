import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config("project")
const projectName = config.get("name")

export const createTables = () => {

    const usersTable = new aws.dynamodb.Table(
        `${projectName}-users`,
        {
            attributes: [
                {
                    name: "user_id",
                    type: "S"
                }
            ],
            hashKey: "user_id",
            billingMode: "PAY_PER_REQUEST"
        }
    )

    

    return {
        usersTable
    }

}