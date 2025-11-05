/**
 * Method to create/update an app meta-field at Shopify.
 *
 * @param key     A handle to access the meta-field from Liquid.
 * @param value      Value of the meta-field.
 * @param graphql  graphql function from Shopify.
 *
 * @return {Promise<string>}
 */
export async function createOrUpdateAppMetafield(
  key,
  value,
  graphql,
  namespace,
  type = 'single_line_text_field'
){
  // Get app installation ID first.
  let response = await graphql(`
    query {
      currentAppInstallation {
        id
      }
    }
  `).then((res) => res.json())

  if (!response?.data?.currentAppInstallation?.id) {
    throw new Error('Invalid request!')
  }

  // Create a new meta-field if ID is not provided.
  response = await graphql(
    `
      #graphql
      mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            key
            value
            namespace
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafieldsSetInput: [
          {
            key,
            type: type,
            namespace,
            value: type === 'json' ? JSON.stringify(value) : value,
            ownerId: response.data.currentAppInstallation.id,
          },
        ],
      },
    }
  ).then((res) => res.json())

  console.log("Metafield creation response:", JSON.stringify(response, null, 2));
  
  if (response?.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error("Metafield creation errors:", response.data.metafieldsSet.userErrors);
    throw new Error(`Metafield creation failed: ${JSON.stringify(response.data.metafieldsSet.userErrors)}`);
  }

  return response?.data?.metafieldsSet?.metafields?.[0]?.id
}