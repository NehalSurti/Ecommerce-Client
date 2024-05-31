import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest } from "../../../utils/requestMethods";

// export const fetchAllProductsAsync = createAsyncThunk(
//   "product/fetchAllProducts",
//   async ({
//     cat = false,
//     currentPage = 0,
//     itemsPerPage = 0,
//     filters,
//     sort = "newest",
//   } = {}) => {
//     let url = "/products";

//     if (cat && filters && Object.keys(filters).length > 0) {
//       url += `?category=${cat}&pageNumber=${currentPage}&pageSize=${itemsPerPage}&filters=${JSON.stringify(
//         filters
//       )}&sort=${sort}`;
//     } else if (cat) {
//       url += `?category=${cat}&pageNumber=${currentPage}&pageSize=${itemsPerPage}&sort=${sort}`;
//     } else if (filters && Object.keys(filters).length > 0) {
//       url += `?pageNumber=${currentPage}&pageSize=${itemsPerPage}&filters=${JSON.stringify(
//         filters
//       )}&sort=${sort}`;
//     } else {
//       url += `?pageNumber=${currentPage}&pageSize=${itemsPerPage}&sort=${sort}`;
//     }

//     const response = await publicRequest.get(url);
//     return response.data;
//   }
// );

export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await publicRequest.get(`/products/find/${id}`);
    return response.data;
  }
);

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async ({
    cat = false,
    currentPage = 0,
    itemsPerPage = 0,
    filters = {},
    sort = "newest",
  } = {}) => {
    // Handle null values by replacing them with default values
    const page = currentPage ?? 0;
    const size = itemsPerPage ?? 0;
    const sorting = sort ?? "newest";

    let url = "/products";

    const params = new URLSearchParams();
    params.append("pageNumber", page);
    params.append("pageSize", size);
    params.append("sort", sorting);

    if (cat) {
      params.append("category", cat);
    }

    if (Object.keys(filters).length > 0) {
      params.append("filters", JSON.stringify(filters));
    }

    const response = await publicRequest.get(`${url}?${params.toString()}`);
    return response.data;
  }
);
