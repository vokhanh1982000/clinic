import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { Clinic } from '../apis/client-axios';

interface ClinicState {
  clinicInformation?: Clinic;
  loading: boolean;
  error: string;
}
export const clinicSlice = createSlice({
  name: 'clinic',
  initialState: (): ClinicState => {
    let initState: ClinicState = {
      loading: false,
      error: '',
    };
    return initState;
  },
  reducers: {
    updateClinic: (state: ClinicState, action: PayloadAction<Clinic | undefined>) => {
      state.clinicInformation = action.payload;
    },
  },
});
export default clinicSlice.reducer;
export const { updateClinic } = clinicSlice.actions;
