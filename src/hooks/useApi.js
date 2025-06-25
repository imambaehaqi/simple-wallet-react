import { useState, useCallback } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args); // 'result' adalah objek respons Axios

      // PERUBAHAN UTAMA: Periksa kode status HTTP terlebih dahulu
      // Kode 2xx (200-299) menandakan sukses.
      if (result.status >= 200 && result.status < 300) {

        // Jika ada body (.data) dan memiliki properti 'success', gunakan itu.
        if (result.data && typeof result.data.success !== 'undefined') {
          if (result.data.success) {
            setData(result.data.data);
            return { success: true, data: result.data.data };
          } else {
            // Sukses HTTP, tapi gagal secara logika aplikasi (success: false)
            const errorMessage = result.data.message || 'An application error occurred.';
            setError(errorMessage);
            return { success: false, error: errorMessage, errors: result.data.errors || [] };
          }
        } else {
          // Sukses HTTP, tapi tidak ada body JSON (misalnya, status 204 No Content dari DELETE)
          // Kita anggap ini sebagai sukses.
          setData(result.data || {}); // Set data ke body (bisa jadi undefined) atau objek kosong
          return { success: true, data: result.data || {} };
        }
      } else {
        // Ini seharusnya tidak terjadi karena Axios akan melempar error untuk status non-2xx,
        // tapi ini adalah lapisan pertahanan tambahan.
        throw new Error(result.statusText || "An unknown error occurred");
      }
    } catch (err) {
      // Blok catch ini sekarang terutama untuk error jaringan atau status 4xx/5xx.
      console.error("API Hook Error:", err);

      const errorMessage =
        err?.response?.data?.message || // 1. Pesan dari body error backend
        err?.message ||                 // 2. Pesan error JavaScript umum (mis. Network Error)
        'An API error occurred.';       // 3. Pesan fallback

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        errors: err?.response?.data?.errors || []
      };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, error, loading, request };
};

export default useApi;