import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { Button } from 'src/components/button';
import { MainPage } from 'src/components/mainPage';
import { MainPageHeader } from 'src/components/mainPageHeader';
import { Table, TableCell, TableH, TableRow } from 'src/components/table';
import { useStore } from 'src/store/useStore';

export const RouteAgents = observer(() => {
	const store = useStore();

	const actions = useMemo(() => {
		return [
			<Button
				key="create"
				title="Create a New Agent"
				asyncAction={store.agents.addAgent}
			/>,
		];
	}, []);

	return (
		<MainPage>
			<MainPageHeader title="Agents" actions={actions} />
			<Table layout="100px auto">
				<TableH title="ID" />
				<TableH title="Prompt" />
				{store.agents.all.map((a) => {
					return (
						<TableRow key={a.id} to={`${a.id}`}>
							<TableCell>{a.id}</TableCell>
							<TableCell>{a.prompt}</TableCell>
						</TableRow>
					);
				})}
			</Table>
		</MainPage>
	);
});
