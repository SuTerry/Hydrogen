import { useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { Button, TextField, AlphaStack } from '@shopify/polaris';
import { useState } from 'react';

export async function loader ({ params, context }) {
  const { handle } = params;
  const { collection } = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, { status: 404 });
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    collection,
  });
}

export async function action({request, context}) {
  const {session} = context;

  const [storedCartId] = await Promise.all([
    session.get('cartId'),
  ]);

  let cartId = storedCartId;

  let status = 200;
  let result;

  // TODO form action
}

export default function Edit () {
  const { collection } = useLoaderData();
  const navigate = useNavigate();
  const [value, setValue] = useState(collection.title);
  const handleChange = (newValue) => setValue(newValue);
  const handleSubmit = () => {
    navigate(`/`);
  }

  return (
    <>
      <AlphaStack gap="4" fullWidth>
        <TextField
          label="title"
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
        <Button onClick={handleSubmit}>submit</Button>
      </AlphaStack>
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      title
      handle
    }
  }
`;

const COLLECTION_MUTATION = `#graphql
mutation collectionUpdate($input: CollectionInput!) {
  collectionUpdate(input: $input) {
    collection {
      title
    }
    job {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;
