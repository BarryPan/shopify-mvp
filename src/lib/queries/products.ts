export const PRODUCTS_QUERY_PAGINATED = /* GraphQL */ `
  query Products($first: Int!, $cursor: String) {
    products(first: $first, after: $cursor) {
      pageInfo { hasNextPage endCursor }     # ← 分頁資訊
      edges {
        node {
          id
          title
          handle
          images(first: 1) { 
            edges { node { url altText } } 
            }
        meta: metafield(namespace: "custom", key: "category") {
                value
                type
              }
          variants(first: 1) { edges { node { id price { amount currencyCode } } } }
        }
      }
    }
  }
`;
export const FRONT_PAGE_PRODUCTS_QUERY = /* GraphQL */ `
  query FrontPageProducts(
  $first: Int = 12
) {
  collection(handle: "frontpage") {          # ① 先定位 FrontPage
    id
    title
    products(first: $first) {            # ② 只查這個收藏底下的商品
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges { node { id price { amount currencyCode } } }
          }
        }
      }
    }
  }
}
`;

export const PRODUCTS_DETAIL = /* GraphQL */ `
   query ProductDetail(
    $id: ID!
  ) {
    node(id: $id) {
      ... on Product {
        id
        title
        description
        vendor
        tags

        collections(first: 20) {
          edges { node { id title handle } }
        }
    category: metafield(namespace: "custom", key: "category") {
          value
          type
        }

    shortdescription: metafield(namespace: "custom", key: "long_description") {
          value
          type
        }

        images(first: 10) {
          edges { node { url altText } }
        }

        variants(first: 10) {
          edges { node { id price { amount currencyCode } } }
        }
      }
    }
  }
`;