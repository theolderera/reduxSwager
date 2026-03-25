import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
let api = "http://37.27.29.18:8001/api/to-dos";
let compApi = "http://37.27.29.18:8001/completed";
export const getData = createAsyncThunk("counter/getData", async () => {
  try {
    const { data } = await axios.get(api);
    return data.data;
  } catch (error) {
    console.log(error);
  }
});

export const addData = createAsyncThunk(
  "counter/addData",
  async (newUser: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("Name", newUser.name);
      formData.append("Description", newUser.description);
      for (let i = 0; i < newUser.images.length; i++) {
        formData.append("Images", newUser.images[i]);
      }
      const { data } = await axios.post(api, formData);
      return data.data;
    } catch (error: any) {
      console.error(error);
    }
  },
);

export const deleteData = createAsyncThunk(
  "counter/deleteData",
  async (id: number) => {
    try {
      const { data } = await axios.delete(`${api}?id=${id}`);
      return data.data;
    } catch (error: any) {
      console.error(error);
    }
  },
);

export const editData = createAsyncThunk(
  "counter/editData",
  async (
    { id, updateUser }: { id: number; updateUser: any },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        id: id,
        name: updateUser.name,
        description: updateUser.description,
      };
      const { data } = await axios.put(api, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addImage = createAsyncThunk(
  "counter/addImage",
  async ({ id, images }: { id: number; images: any }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("Images", images[i]);
      }
      const { data } = await axios.post(`${api}/${id}/images`, formData);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteImg = createAsyncThunk(
  "counter/deleteImg",
  async (imageId: number) => {
    try {
      const { data } = await axios.delete(`${api}/images/${imageId}`);
      return data.data;
    } catch (error: any) {
      console.error(error);
    }
  },
);
export const completeData = createAsyncThunk(
  "counter/completeData",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${compApi}?id=${id}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  value: 0,
  data: [],
  loading: false,
  error: null,
};

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
    builder.addCase(deleteImg.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((e: any) => e.id !== action.payload.id);
    });
    builder.addCase(completeData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((e: any) => e.id !== action.payload.id);
    });
  },
});

export const {} = counterSlice.actions;

export default counterSlice.reducer;
