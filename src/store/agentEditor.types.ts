import { Edge, Node } from '@xyflow/react';

import { AgentWorkflowNode, RemoteAgentEditorNode } from './agents.types';

export type AEEdge = Edge<{}>;
export type AENode = Node<{
	// id: number;
	// type: "node";
	// position: XYPosition;
}>;

export type AENodePlusParent = AENode & {
	parent: string;
};

export type MountStatus =
	| {
			status: 'mounted';
			forAgentId: string;
	  }
	| { status: 'mounting' }
	| { status: 'failedToMount' };

export type EditorAction =
	| {
			type: 'select';
			nodeId: string | undefined;
	  }
	| {
			type: 'insert-node';
			parentId: string | undefined;
			nodeId: string | undefined;
			details: RemoteAgentEditorNode;
	  }
	| {
			type: 'remove-node';
			nodeId: string;
	  };

export type HoveredNode = {
	id: string;
	side: 'left' | 'right';
};

export type SyncOperation =
	| {
			operation: 'upsert-node';
			nodeDetails: AgentWorkflowNode;
			id: string;
			parentId: string | undefined;
	  }
	| {
			operation: 'delete-node';
			id: string;
	  };

export type ActionSource = 'default' | 'undo' | 'redo' | 'skip';
