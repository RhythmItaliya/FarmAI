import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationCoordinates } from '@/services/LocationService';

export interface LocationState {
  coordinates: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  accuracy: string | null;
  isWatching: boolean;
  lastUpdated: number | null;
  isLocationAvailable: boolean;
}

const initialState: LocationState = {
  coordinates: null,
  isLoading: false,
  error: null,
  accuracy: null,
  isWatching: false,
  lastUpdated: null,
  isLocationAvailable: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // Set location coordinates
    setLocation: (state, action: PayloadAction<LocationCoordinates>) => {
      state.coordinates = action.payload;
      state.isLocationAvailable = true;
      state.lastUpdated = Date.now();
      state.error = null;
    },

    // Set location loading state
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set location error
    setLocationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set location accuracy
    setLocationAccuracy: (state, action: PayloadAction<string | null>) => {
      state.accuracy = action.payload;
    },

    // Set watching state
    setLocationWatching: (state, action: PayloadAction<boolean>) => {
      state.isWatching = action.payload;
    },

    // Update location availability
    setLocationAvailable: (state, action: PayloadAction<boolean>) => {
      state.isLocationAvailable = action.payload;
      if (!action.payload) {
        state.coordinates = null;
        state.accuracy = null;
        state.lastUpdated = null;
      }
    },

    // Clear location data
    clearLocation: state => {
      state.coordinates = null;
      state.isLoading = false;
      state.error = null;
      state.accuracy = null;
      state.isWatching = false;
      state.lastUpdated = null;
      state.isLocationAvailable = false;
    },

    // Update location with all data
    updateLocation: (
      state,
      action: PayloadAction<{
        coordinates: LocationCoordinates;
        accuracy: string;
        isWatching?: boolean;
      }>
    ) => {
      state.coordinates = action.payload.coordinates;
      state.accuracy = action.payload.accuracy;
      state.isLocationAvailable = true;
      state.lastUpdated = Date.now();
      state.error = null;
      if (action.payload.isWatching !== undefined) {
        state.isWatching = action.payload.isWatching;
      }
    },
  },
});

export const {
  setLocation,
  setLocationLoading,
  setLocationError,
  setLocationAccuracy,
  setLocationWatching,
  setLocationAvailable,
  clearLocation,
  updateLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
