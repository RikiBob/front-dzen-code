import {globalError} from "@/utils/globalError.js";
import {router} from "@/main.js";


const baseURL =  import.meta.env.VITE_SERVER_URL;

const refreshToken = async () => {
    return await fetch(`${baseURL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
};

const request = async (url, options = {}) => {
    try {
        const fullURL = baseURL + url;
        let response = await fetch(fullURL, {
            ...options,
            credentials: "include",
        });

        let data = null;

        if (url === '/auth/login' && !response.ok) {
            data = await response.json();
            throw new Error(data.message || 'Login failed');
        }

        if (response.status === 401) {
            data = await response.json();

            if (data.message === 'Unauthorized') {
                await refreshToken();

                response = await fetch(fullURL, {
                    ...options,
                    credentials: "include",
                });

                if (!response.ok) {
                    await router.push('/login');
                    throw new Error(`Request failed after token refresh: ${response.status}`);
                }
            } else {
                throw new Error(data.message);
            }
        }

        if (!response.ok) {
            data = await response.json();
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return response;
    } catch (error) {
        globalError.value.push(error);
        throw error;
    }
};

export const api = {
    get: async (url, options = {}) => {
        if (options.params) {
            const query = new URLSearchParams(options.params).toString();
            url += `?${query}`;
        }

        return (await request(url, { method: 'GET' }));
    },

    getBlob: async (url, options = {}) => {
        const response = await request(url, { method: 'GET', ...options });
        if (!response.ok) {
            throw new Error(`Failed to fetch blob from ${url}: ${response.status}`);
        }
        return await response.blob();
    },

    post: async (url, body, headers = {}) => {
        let options = {
            method: 'POST',
            headers: {...headers},
        };

        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
            options.headers['Content-Type'] = 'application/json';
        }

        return await request(url, options);
    },

    remove: async (url) => {
        return await request(url, {method: 'DELETE'});
    },

    patch: async (url, body, headers = {}) => {
        let options = {
            method: 'PUT',
            headers: {...headers},
        };

        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
            options.headers['Content-Type'] = 'application/json';
        }

        return await request(url, options);
    },
}