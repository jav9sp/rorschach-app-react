import type { Comparison } from "../types/NormativeData";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import type { Answer } from "../utils/buildMasterSummary";

export type ProtocolActions =
  | { type: "add-response"; payload: { answer: Answer } }
  | { type: "delete-response"; payload: { id: Answer["N"] } }
  | { type: "clear-responses" };

export type ProtocolState = {
  summary: StructuralSummaryData | {};
  responses: Answer[];
  comparisson: Comparison[];
};

export const initialState: ProtocolState = {
  summary: {},
  responses: [],
  comparisson: [],
};

export const protocolReducer = (
  state: ProtocolState = initialState,
  actions: ProtocolActions
) => {
  if (actions.type === "add-response") {
    let updatedResponses = [];

    const newResponse: Answer = { ...actions.payload.answer };

    updatedResponses = [...state.responses, newResponse];

    return {
      ...state,
      responses: updatedResponses,
    };
  }

  return state;
};
