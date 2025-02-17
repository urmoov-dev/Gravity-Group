<script>
  export let product = {
    image: '',
    title: '',
    description: '',
    price: 0
  };
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
  <img 
    src={product.image} 
    alt={product.title}
    class="h-48 w-full object-cover"
  />
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-900">{product.title}</h3>
    <p class="mt-1 text-gray-600">{product.description}</p>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
      <button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Comprar
      </button>
    </div>
  </div>
</div> 