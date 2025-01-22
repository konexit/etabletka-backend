import axios from 'axios';

export function handleAxiosError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    console.error('Axios Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
  } else {
    console.error('Unexpected Error:', error);
  }
}
