const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SecBank Card Request API",
    version: "1.0.0",
    description: "API for creating and checking customer card requests"
  },
  paths: {
    "/card-requests": {
      post: {
        summary: "Create a card request",
        description: "Creates a new customer card request and returns a unique reference.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customer_id", "customer_name", "card_type"],
                properties: {
                  customer_id: {
                    type: "string",
                    example: "CUST-1001"
                  },
                  customer_name: {
                    type: "string",
                    example: "Izuchukwu Johnbosco"
                  },
                  card_type: {
                    type: "string",
                    example: "DEBIT"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Card request created successfully"
          },
          "400": {
            description: "Invalid request data"
          }
        }
      }
    },
    "/card-requests/{reference}": {
      get: {
        summary: "Check card request status",
        description: "Checks the status of a card request using its reference.",
        parameters: [
          {
            name: "reference",
            in: "path",
            required: true,
            description: "The reference returned when the card request was created",
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Card request found"
          },
          "404": {
            description: "Card request not found"
          }
        }
      }
    }
  }
};

module.exports = swaggerDocument;