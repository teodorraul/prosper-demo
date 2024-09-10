import { useCallback, useEffect } from "react";
import { Sidebar } from "src/components/sidebar";
import { Supa } from "src/supabase";

export const Index = () => {
	const fetchAgents = useCallback(async () => {
		const { data, error } = await Supa.from("agents_2018").select();
		console.log(data, error);
	}, []);

	useEffect(() => {
		fetchAgents();
	}, [fetchAgents]);

	return (
		<main>
			<Sidebar />
		</main>
	);
};
