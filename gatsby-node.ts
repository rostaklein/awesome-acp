import { GatsbyNode } from 'gatsby';

export const onCreateBabelConfig: GatsbyNode['onCreateBabelConfig'] = ({ actions }) => {
	actions.setBabelPlugin({
		name: 'babel-plugin-import',
		options: {
			libraryName: 'antd',
			style: true,
		},
	});
};
