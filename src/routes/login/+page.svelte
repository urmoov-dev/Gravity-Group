<script>
    let email = "";
    let password = "";
  
    const handleLogin = () => {
      console.log("Tentativa de login com:", email, password);
      // Lógica futura de autenticação aqui
    };
  </script>
  
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-3xl font-bold text-green-500 mb-6 text-center">Login</h1>
      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <div>
          <label for="email" class="block text-sm text-gray-300 mb-2">E-mail</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="Digite seu e-mail"
            class="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm text-gray-300 mb-2">Senha</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="Digite sua senha"
            class="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-500 text-black py-2 px-4 rounded-md hover:bg-green-600 transition"
        >
          Entrar
        </button>
      </form>
      <div class="mt-4 text-center">
        <a href="#" class="text-sm text-gray-400 hover:text-green-500">Esqueceu sua senha?</a>
      </div>
    </div>
  </div>
  