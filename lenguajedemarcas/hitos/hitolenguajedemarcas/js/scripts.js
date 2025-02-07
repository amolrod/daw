// la funcion para cargar los datos del json 
function cargarPedidos() {
    // para cargar el archivo json
    fetch('js/datos.json')  
        .then(response => response.json())
        .then(data => {
            const pedidosDiv = document.getElementById('pedidos');
            let html = '';

            // los años y trimestres
            for (const año in data) {
                for (const trimestre in data[año]) {
                    html += `<h2>${trimestre} ${año}</h2>`;
                    html += '<table>';
                    html += '<tr><th>Número de Pedido</th><th>Fecha de Compra</th><th>Fecha de Entrega</th><th>Total Factura</th><th>Productos</th></tr>';

                    // Recorrer los pedidos del trimestre
                    data[año][trimestre].forEach(pedido => {
                        // Calcular el total de la factura
                        let totalFactura = 0;
                        pedido.pedido.productos.forEach(producto => {
                            totalFactura += producto.precio * producto.unidades;
                        });

                        html += `<tr>
                            <td>${pedido.pedido.numero_pedido}</td>
                            <td>${pedido.pedido.fecha_compra}</td>
                            <td>${pedido.pedido.fecha_entrega}</td>
                            <td>${totalFactura.toFixed(2)}€</td>
                            <td>`;

                        // Mostrar los productos del pedido
                        pedido.pedido.productos.forEach(producto => {
                            html += `${producto.nombre} (${producto.unidades} unidades)<br>`;
                        });

                        html += `</td></tr>`;
                    });

                    html += '</table>';
                }
            }

            // insertar el html generando el div
            pedidosDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        })
}

// llamar a la funcion 
window.onload = cargarPedidos;
