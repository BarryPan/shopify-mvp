export const CREATE_CUSTOMER_TOKEN = /* GraphQL */ `
  mutation customerAccessTokenCreate($email: String!, $password: String!) {
    customerAccessTokenCreate(input: { email: $email, password: $password }) {
      customerAccessToken { accessToken expiresAt }
      userErrors { field message }
    }
  }
`;

export const CUSTOMER_QUERY = /* GraphQL */ `
  query customer($token: String!) {
    customer(customerAccessToken: $token) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const CUSTOMER_CREATE = /* GraphQL */ `
  mutation customerCreate(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    customerCreate(
      input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }
    ) {
      customer { id }
      userErrors { field message }
    }
  }
`;