import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
let api = "https://694168c1686bc3ca8166df39.mockapi.io/users";
const initialState: CounterState = {
  data: [],
};

export const getData = createAsyncThunk(
  "counter/getData",
  async ({ search = "", select = "" } = {}) => {
    try {
      const status = select === "true" ? true : select === "false" ? false : null;
      const { data } = await axios.get(
        search && status !== null
          ? `${api}?name=${search}&status=${status}`
          : search
            ? `${api}?name=${search}`
            : status !== null
              ? `${api}?status=${status}`
              : api,
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
export const addData = createAsyncThunk(
  "counter/addData",
  async (newUser: any) => {
    try {
      const { data } = await axios.post(api, newUser);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
export const deleteData = createAsyncThunk(
  "counter/deleteData",
  async (id: any) => {
    try {
      const { data } = await axios.delete(`${api}/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
export const editData = createAsyncThunk(
  "counter/editData",
  async ({ id, updatedUser }) => {
    try {
      const { data } = await axios.put(`${api}/${id}`, updatedUser);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(addData.fulfilled, (state, action) => {
      state.loading = false;
      state.data.push(action.payload);
    });
    builder.addCase(deleteData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((e: any) => e.id !== action.payload.id);
    });
    builder.addCase(editData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map((e: any) =>
        e.id === action.payload.id ? action.payload : e,
      );
    });
  },
});

export const {} = counterSlice.actions;

export default counterSlice.reducer;
