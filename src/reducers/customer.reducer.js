import { ACTION_TYPES } from "../actions/customer.action";

const initialState = {
    customers: [],
    customer: {},
};

export const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_CUSTOMER:
            return {
                ...state,
                customers: [...action.payload],
            };
        case ACTION_TYPES.GET_CUSTOMER_BY_ID:
            return {
                ...state,
                customer: action.payload,
            };
        case ACTION_TYPES.ADD_CUSTOMER:
            return {
                ...state,
                customers: [...action.payload],
            }
        default:
            return state;
    }
};