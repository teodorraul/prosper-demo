import { NodeIfStyle } from './nodeIf.css';

export const NodeIf: React.FC<{ expanded?: boolean }> = ({ expanded }) => {
	return (
		<span className={NodeIfStyle}>
			{expanded ? 'EXECUTE ONLY IF:' : 'IF'}
		</span>
	);
};
