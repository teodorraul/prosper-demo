import React, { createContext, useContext } from 'react';

export type TableConfig = {
	gap: number;
};

interface TableConfigContextProps {
	config: TableConfig;
}

const TableConfigContext = createContext<TableConfigContextProps | undefined>(
	undefined
);

export const TableConfigProvider: React.FC<{
	children: React.ReactNode;
	config: TableConfig;
}> = ({ children, config }) => {
	return (
		<TableConfigContext.Provider value={{ config }}>
			{children}
		</TableConfigContext.Provider>
	);
};

export const useTableConfig = (): TableConfigContextProps => {
	const context = useContext(TableConfigContext);
	if (!context) {
		throw new Error(
			"useTableConfig must be used within a TableConfigProvider"
		);
	}
	return context;
};
