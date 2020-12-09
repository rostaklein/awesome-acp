/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import { GatsbySSR } from 'gatsby';

import { rootElementWrapper } from './src/utils/rootElementWrapper';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
	return rootElementWrapper(element);
};
