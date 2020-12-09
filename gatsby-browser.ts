import { GatsbyBrowser } from 'gatsby';

import { rootElementWrapper } from './src/utils/rootElementWrapper';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({ element }) => {
	return rootElementWrapper(element);
};
