import { formatDistanceToNow } from 'date-fns';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { Button } from 'src/components/button';
import { LoadingContainer } from 'src/components/loadingContainer';
import { MainPage } from 'src/components/mainPage';
import { MainPageHeader } from 'src/components/mainPageHeader';
import { Table, TableCell, TableH, TableRow } from 'src/components/table';
import { Text } from 'src/components/text';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { useAgents } from 'src/store/agents.hooks';
import { useStore } from 'src/store/useStore';

export const RouteAgents = observer(() => {
	const store = useStore();

	useAgents();

	const actions = useMemo(() => {
		return [
			<Button
				key="create"
				title="Create a New Agent"
				asyncAction={store.agents.createANewAgent}
			/>,
		];
	}, []);

	const handleDelete = useClickHandler(
		'agent-id',
		async (agentId, e) => {
			e.preventDefault();
			e.stopPropagation();
			await store.agents.deleteAnAgent(parseInt(agentId));
		},
		[]
	);

	return (
		<MainPage>
			<MainPageHeader title="Agents" actions={actions} />
			<LoadingContainer status={store.agents.fetchStatus} size="medium">
				<Table layout="100px 2fr 1fr 1fr min-content">
					<TableH title="ID" />
					<TableH title="Prompt" />
					<TableH title="Created at" />
					<TableH title="Updated at" />
					<TableH title="Actions" />
					{store.agents.all.map((a) => {
						return (
							<TableRow key={a.id} to={`${a.id}`}>
								<TableCell>
									<Text oneLine>{a.id}</Text>
								</TableCell>
								<TableCell oneLine>
									<Text oneLine>
										{a.workflow.generalInstructions}
									</Text>
								</TableCell>
								<TableCell oneLine>
									<Text color="subtle">
										{formatDistanceToNow(a.createdAt) +
											' ago'}
									</Text>
								</TableCell>
								<TableCell oneLine>
									<Text color="subtle">
										{a.updatedAt
											? formatDistanceToNow(a.updatedAt) +
											  ' ago'
											: '-'}
									</Text>
								</TableCell>
								<TableCell>
									<Button
										data-agent-id={a.id}
										title="Delete"
										type="textualDanger"
										asyncAction={handleDelete}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</Table>
			</LoadingContainer>
		</MainPage>
	);
});
