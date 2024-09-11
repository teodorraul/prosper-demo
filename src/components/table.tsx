import React, { CSSProperties, HTMLAttributes, useMemo } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { TableCellStyle, TableHStyle, TableRowStyle, TableStyle } from './table.css';
import { TableConfig, TableConfigProvider, useTableConfig } from './table.hook';

export const Table: React.FC<{
	layout: string;
	children: any;
	gap?: "small";
}> = ({ children, layout, gap = "small" }) => {
	const setup = useMemo<{
		styles: CSSProperties;
		config: TableConfig;
	}>(() => {
		var columnGapSize = 0;

		switch (gap) {
			case "small":
				columnGapSize = 20;
		}
		return {
			styles: {
				gridTemplateColumns: layout,
			},
			config: {
				gap: columnGapSize,
			},
		};
	}, [layout, gap]);

	return (
		<TableConfigProvider config={setup.config}>
			<div style={setup.styles} className={TableStyle}>
				{children}
			</div>
		</TableConfigProvider>
	);
};

export const TableH: React.FC<{ title: String }> = ({ title }) => {
	const { config } = useTableConfig();

	const style = useMemo<CSSProperties>(() => {
		return { paddingLeft: config?.gap, paddingRight: config.gap };
	}, [config]);

	return (
		<div className={TableHStyle} style={style}>
			{title}
		</div>
	);
};

export const TableRow: React.FC<{ children: any; to?: string }> = ({
	children,
	to,
}) => {
	const { Tag, props } = useMemo(() => {
		if (to) {
			const props: LinkProps = {
				to,
			};
			return {
				Tag: Link,
				props,
			};
		} else {
			const props: HTMLAttributes<HTMLDivElement> = {};
			return {
				Tag: "div",
				props,
			};
		}
	}, [to]);

	return (
		<Tag className={TableRowStyle} {...props}>
			{children}
		</Tag>
	);
};

export const TableCell: React.FC<{ children: any }> = ({ children }) => {
	const { config } = useTableConfig();

	const style = useMemo<CSSProperties>(() => {
		return { paddingLeft: config?.gap, paddingRight: config.gap };
	}, [config]);

	return (
		<div className={TableCellStyle} style={style}>
			{children}
		</div>
	);
};
