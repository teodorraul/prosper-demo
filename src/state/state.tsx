import React, { createContext, useReducer, useContext } from "react";

type State = {
	tasksPerYear: number;
	timeSavedPerTask: number;
	deadlineFromNowIn: number;
};

type Action =
	| {
			type: "SET_RECURRENCE";
			payload: {
				tasksPerYear: number;
			};
	  }
	| {
			type: "TIME_SAVED_PER_TASK";
			payload: {
				seconds: number;
			};
	  }
	| {
			type: "DEADLINE_FROM_NOW_IN";
			payload: {
				seconds: number;
			};
	  };

type Dispatch = (action: Action) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const Reducer = (state: State, action: Action) => {
	switch (action.type) {
		case "SET_RECURRENCE":
			return { ...state, tasksPerYear: action.payload.tasksPerYear };
		case "TIME_SAVED_PER_TASK":
			return { ...state, timeSavedPerTask: action.payload.seconds };
		case "DEADLINE_FROM_NOW_IN":
			return { ...state, deadlineFromNowIn: action.payload.seconds };
		default:
			throw new Error(`Unhandled action type`);
	}
};

export const StateProvider: React.FC<any> = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, {
		tasksPerYear: 0,
		timeSavedPerTask: 0,
		deadlineFromNowIn: 0,
	});

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

export const useState = () => {
	const context = useContext(StateContext);
	if (context === undefined) {
		throw new Error(`useState must be used within a Provider`);
	}
	return context;
};

export const useDispatch = () => {
	const context = useContext(DispatchContext);
	if (context === undefined) {
		throw new Error(`useDispatch must be used within a Provider`);
	}
	return context;
};
