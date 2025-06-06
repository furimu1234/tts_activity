import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Link } from 'react-router-dom';
import { styled } from './styled';

export const Navigation = styled(ScrollArea.Root, {
	height: '100%',
	width: '300px',
	overflow: 'auto',
	border: '1px solid',
	borderColor: '$slate12',
});

export const Ul = styled('ul', {
	display: 'flex',
	flexDirection: 'column',
});

export const Li = styled(Link, {
	padding: '24px',
	textDecoration: 'none',
	color: '$slate12',
	'&:visited': {
		color: '$slate12',
	},
	'&:hover': {
		backgroundColor: '$slate4',
	},
	variants: {
		selected: {
			true: {
				backgroundColor: '$indigo6',
				color: '$indigo12',
				'&:visited': {
					color: '$indigo12',
				},
				'&:hover': {
					backgroundColor: '$indigo7',
				},
			},
		},
	},
});

export const Input = styled('input', {
	padding: '8px',
	width: '100%',
	border: '1px solid',
	borderColor: '$slate12',
	borderRadius: '4px',
});

export const SiteWrapper = styled('div', {
	display: 'flex',
	height: '100%',
	color: '$slate12',
	flexDirection: 'row',
	'@small': {
		flexDirection: 'column',
	},
	'@xsmall': {
		flexDirection: 'column',
	},
});
