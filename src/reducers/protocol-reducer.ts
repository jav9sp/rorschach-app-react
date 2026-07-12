import type { Answer } from "../utils/buildMasterSummary";

export type ProtocolActions =
  | { type: "add-response"; payload: { answer: Omit<Answer, "N"> } }
  | { type: "delete-response"; payload: { id: Answer["N"] } }
  | { type: "clear-responses" };

export type ProtocolState = {
  responses: Answer[];
};

export const initialState: ProtocolState = {
  responses: [],
};

function renumber(responses: Omit<Answer, "N">[]): Answer[] {
  return responses.map((r, i) => ({ ...r, N: i + 1 }) as Answer);
}

export const protocolReducer = (
  state: ProtocolState = initialState,
  action: ProtocolActions,
): ProtocolState => {
  switch (action.type) {
    case "add-response":
      return {
        responses: renumber([...state.responses, action.payload.answer]),
      };

    case "delete-response":
      return {
        responses: renumber(
          state.responses.filter((r) => r.N !== action.payload.id),
        ),
      };

    case "clear-responses":
      return { responses: [] };

    default:
      return state;
  }
};
