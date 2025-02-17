import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(400, { error: result.error });
      }

      // Armazenar token e redirecionar
      throw redirect(303, '/dashboard');
    } catch (error) {
      if (error instanceof Response) throw error;
      return fail(500, { error: 'Erro interno do servidor' });
    }
  }
}; 