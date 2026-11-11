import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AvailabilityStatus, MachineCondition } from '@/types';

interface CatalogState {
  searchQuery: string;
  selectedCategorySlug: string | null;
  selectedManufacturerSlug: string | null;
  selectedCondition: MachineCondition | null;
  selectedAvailability: AvailabilityStatus | null;
  selectedSpecs: Record<string, string | number>;
  sortBy: 'name_asc' | 'name_desc' | 'newest' | 'views';
  viewMode: 'grid' | 'list';
  isFilterDrawerOpen: boolean;
}

const initialState: CatalogState = {
  searchQuery: '',
  selectedCategorySlug: null,
  selectedManufacturerSlug: null,
  selectedCondition: null,
  selectedAvailability: null,
  selectedSpecs: {},
  sortBy: 'newest',
  viewMode: 'grid',
  isFilterDrawerOpen: false,
};

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategorySlug = action.payload;
      state.selectedSpecs = {}; // reset category-specific specs when category changes
    },
    setSelectedManufacturer: (state, action: PayloadAction<string | null>) => {
      state.selectedManufacturerSlug = action.payload;
    },
    setSelectedCondition: (state, action: PayloadAction<MachineCondition | null>) => {
      state.selectedCondition = action.payload;
    },
    setSelectedAvailability: (state, action: PayloadAction<AvailabilityStatus | null>) => {
      state.selectedAvailability = action.payload;
    },
    setSpecFilter: (state, action: PayloadAction<{ key: string; value: string | number | null }>) => {
      if (action.payload.value === null || action.payload.value === '') {
        delete state.selectedSpecs[action.payload.key];
      } else {
        state.selectedSpecs[action.payload.key] = action.payload.value;
      }
    },
    setSortBy: (state, action: PayloadAction<CatalogState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    toggleFilterDrawer: (state) => {
      state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategorySlug = null;
      state.selectedManufacturerSlug = null;
      state.selectedCondition = null;
      state.selectedAvailability = null;
      state.selectedSpecs = {};
      state.sortBy = 'newest';
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedManufacturer,
  setSelectedCondition,
  setSelectedAvailability,
  setSpecFilter,
  setSortBy,
  setViewMode,
  toggleFilterDrawer,
  setFilterDrawerOpen,
  resetFilters,
} = catalogSlice.actions;

export default catalogSlice.reducer;

