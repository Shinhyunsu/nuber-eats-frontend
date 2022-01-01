import { useQuery, gql } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT, CATEGORY_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
    query category($input: CategoryInput!){
        category(input:$input){
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category{
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`

export const Category = () => {
    const params = useParams();

    const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page: 1,
                slug: params.slug
            }
        }
    })
    console.log(data);
    return <h1>Catecory</h1>;
}