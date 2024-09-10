import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { MainPage } from "src/components/mainPage";
import { MainPageHeader } from "src/components/mainPageHeader";
import { Sidebar } from "src/components/sidebar";
import { Supa } from "src/supabase";

export const RouteAgents = () => {
	const fetchAgents = useCallback(async () => {
		const { data, error } = await Supa.from("agents_2018").select();
		console.log(data, error);
	}, []);

	useEffect(() => {
		fetchAgents();
	}, [fetchAgents]);

	const actions = useMemo(() => {
		return [<button>Create Agent</button>];
	}, []);

	return (
		<MainPage>
			<MainPageHeader title="Agents" actions={actions} />
		</MainPage>
	);
};
