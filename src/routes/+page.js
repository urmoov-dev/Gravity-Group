export const ssr = false;
export const prerender = false;

export function load() {
  return {
    status: 307, // Temporary redirect
    redirect: '/login'
  };
} 