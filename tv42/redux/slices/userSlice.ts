import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Permissions {
  id: number;
  name: string;
  value: string;
  description: string;
  category: string;
}

// Kullanıcı bilgileri için tip tanımlaması
interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  group_id: number;
  status: number;
  permissions: Permissions[];
  user?: User; // user alanını ekliyoruz
}

// State tipini tanımlıyoruz
interface UserState {
  user: User | null; // Kullanıcı verisi doğrudan burada
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Başlangıç durumu
const initialState: UserState = {
  user: null, // user direkt burada, kullanıcı bilgileri
  isAuthenticated: false,
  loading: false,
  error: null,
};


// Async thunk için kullanıcı giriş işlemi
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync', // Action type
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // API çağrısı
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Giriş verilerini API'ye gönderiyoruz
      });

      console.log("API'ye istek gönderildi"); // Console log eklenebilir

      // Yanıt doğrulama
      if (!response.ok) {
        return rejectWithValue('Giriş başarısız');
      }

      // Başarılı ise veriyi alıyoruz
      const data = await response.json();
      console.log('Giriş başarılı, gelen veri:', data); // Gelen veriyi kontrol edebiliriz
      return data; // API'den gelen yanıtı (token ve kullanıcı bilgilerini) döndürüyoruz
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      console.error('Hata:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


// Slice oluşturuluyor
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null; // Kullanıcı çıkış yapınca 'user' null olmalı
      state.isAuthenticated = false;
    },
    setUserPermissions(state, action: PayloadAction<{ groupId: number; permissions: Permissions[] }>) {
      if (state.user) {
        // permissions'ları güncelliyoruz
        state.user.permissions = action.payload.permissions.map((permission) => ({
          id: permission.id,
          name: permission.name,
          value: permission.value,
          description: permission.description,
          category: permission.category,
        }));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // Kullanıcıyı buraya ekliyoruz
        state.isAuthenticated = true;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else {
          state.error = 'Bir hata oluştu';
        }
      });
  },
});

export const { logoutUser, setUserPermissions } = userSlice.actions;

export default userSlice.reducer;
