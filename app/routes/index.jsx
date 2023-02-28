import { useLoaderData, useNavigate } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Text, Page, LegacyCard, ResourceList } from '@shopify/polaris';

export const meta = () => {
  return {
    title: "Hydrogen",
    description: "A custom storefront powered by Hydrogen",
  };
};

export async function loader ({ context }) {
  return await context.storefront.query(COLLECTIONS_QUERY);
}

export default function Index () {
  const { collections } = useLoaderData();

  const navigate = useNavigate();

  const handleEdit = (item) => {
    navigate(`/edit/${item.handle}`);
  }

  return (
    <Page>
      <LegacyCard>
        <ResourceList
          items={collections.nodes}
          renderItem={(item, i) => {
            const { title } = item;
            return (
              <ResourceList.Item id={i} onClick={() => handleEdit(item)} >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {title}
                </Text>
              </ResourceList.Item>
            );
          }}
        />
      </LegacyCard>
    </Page>

  );
}

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 10, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
