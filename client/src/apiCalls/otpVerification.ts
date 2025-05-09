import apiClient from './index';

// Types
export interface SendOtpRequest {
  countryCode: string;
  phoneNumber: string;
}

export interface SendOtpResponse {
  message: string;
  sessionId: string;
}

export interface VerifyOtpRequest {
  countryCode: string;
  phoneNumber: string;
  sessionId: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
  user: {
    fullname: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
  };
}

// OTP Service functions
export const otpService = {
  /**
   * Send OTP to user's phone number
   * @param data Object containing countryCode and phoneNumber
   * @returns Promise with sessionId on success
   */
  sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    try {
      const response = await apiClient.post<SendOtpResponse>('/user/send-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify OTP entered by user
   * @param data Object containing countryCode, phoneNumber, sessionId and OTP code
   * @returns Promise with user data on success
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
      const response = await apiClient.post<VerifyOtpResponse>('/user/verify-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default otpService;