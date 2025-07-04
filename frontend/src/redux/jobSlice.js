import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        customFilters: [],
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        addCustomFilter: (state, action) => {
            if (!Array.isArray(state.customFilters)) {
                state.customFilters = [];
            }
            state.customFilters.push(action.payload);
        },
        removeCustomFilter: (state, action) => {
            state.customFilters = state.customFilters.filter(
                (filter, idx) => idx !== action.payload
            );
        },
        clearFilters: (state) => {
            state.searchedQuery = "";
            state.customFilters = [];
        },
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    addCustomFilter,
    removeCustomFilter,
    clearFilters
} = jobSlice.actions;
export default jobSlice.reducer;