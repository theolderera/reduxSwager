import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
let api = "http://37.27.29.18:8001/api/to-dos";
let compApi = "http://37.27.29.18:8001/completed";
export let apiImg = "http://37.27.29.18:8001/images";
interface IImage {
  id: number;
  imageName: string;
}
interface IData {
  id: number;
  isCompleted: boolean;
  images: IImage[];
  name: string;
  description: string;
}

const initialState = {
  value: 0,
  data: [],
  loading: false,
  error: null,
};

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
  async (newUser, { dispatch }) => {
    try {
      let formData = new FormData();
      formData.append("Name", newUser.name);
      formData.append("Description", newUser.description);
      for (let i = 0; i < newUser.images.length; i++) {
        formData.append("Images", newUser.images[i]);
      }
      const { data } = await axios.post(api, formData);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  },
);
export const deleteData = createAsyncThunk(
  "counter/deleteData",
  async (id: number, { dispatch }) => {
    try {
      await axios.delete(`${api}?id=${id}`);
      dispatch(getData());
    } catch (error) {
      console.log(error);
    }
  },
);

export const editData = createAsyncThunk(
  "counter/editData",
  async ({ id, updateUser }: { id: number; updateUser: any }, { dispatch }) => {
    try {
      const editData = {
        id: id,
        name: updateUser.name,
        description: updateUser.description,
      };
      const { data } = await axios.put(`${api}?id=${id}`, editData);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const addImg = createAsyncThunk(
  "counter/addImg",
  async ({ id, images }: { id: number; images: any }, { dispatch }) => {
    if (!images || images.length === 0) return;
    try {
      let formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("Images", images[i]);
      }
      const { data } = await axios.post(`${api}/${id}/images`, formData);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteImg = createAsyncThunk(
  "counter/deleteImg",
  async (id: number, { dispatch }) => {
    try {
      await axios.delete(`${api}/images/${id}`);
      dispatch(getData());
    } catch (error) {
      console.log(error);
    }
  },
);

export const completeData = createAsyncThunk(
  "counter/completeData",
  async (id: number, { dispatch }) => {
    try {
      await axios.put(`${compApi}?id=${id}`);
      dispatch(getData());
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
    builder.addCase(editData.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addImg.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(deleteImg.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(completeData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map((e: IData) => e.id === action.payload.id ? action.payload : e);
    });
  },
});

export const {} = counterSlice.actions;

export default counterSlice.reducer;
