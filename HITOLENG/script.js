document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        populateOrdersTable(data);
        populateClientsTable(data);
        createInvoice(data);
        populateProducts(data);
      })
      .catch(error => console.error("Error al cargar el JSON:", error));
  });
  
  function populateOrdersTable(data) {
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    // Recorremos todos los años y trimestres
    for (const year in data) {
      for (const quarter in data[year]) {
        data[year][quarter].forEach(order => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${order.purchaseDate}</td>
            <td>${order.deliveryDate}</td>
            <td>${order.total.toFixed(2)} €</td>
            <td>${order.client.name} ${order.client.surname}</td>
            <td>${order.products.map(p => `${p.name} (${p.units})`).join(", ")}</td>
          `;
          ordersTableBody.appendChild(tr);
        });
      }
    }
  }
  
  function populateClientsTable(data) {
    const clientsTableBody = document.querySelector('#clientsTable tbody');
    const clientsMap = {}; // Para evitar duplicados, usamos el email como clave
    for (const year in data) {
      for (const quarter in data[year]) {
        data[year][quarter].forEach(order => {
          const client = order.client;
          if (!clientsMap[client.email]) {
            clientsMap[client.email] = client;
          }
        });
      }
    }
    for (const email in clientsMap) {
      const client = clientsMap[email];
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${client.name}</td>
        <td>${client.surname}</td>
        <td>${client.phone}</td>
        <td>${client.address.street}, ${client.address.city}, ${client.address.postalCode}, ${client.address.province}</td>
        <td>${client.email}</td>
      `;
      clientsTableBody.appendChild(tr);
    }
  }
  
  function createInvoice(data) {
    const invoiceDiv = document.getElementById("invoice");
    // Seleccionamos el primer pedido del Q1 2023 para generar la factura
    let orderFound = null;
    if (data["2023"] && data["2023"]["Q1"] && data["2023"]["Q1"].length > 0) {
      orderFound = data["2023"]["Q1"][0];
    }
    if (orderFound) {
      let html = `<h2>Factura - Pedido ${orderFound.orderNumber}</h2>`;
      html += `<p><strong>Cliente:</strong> ${orderFound.client.name} ${orderFound.client.surname}</p>`;
      html += `<p><strong>Dirección:</strong> ${orderFound.client.address.street}, ${orderFound.client.address.city}, ${orderFound.client.address.postalCode}, ${orderFound.client.address.province}</p>`;
      html += `<p><strong>Teléfono:</strong> ${orderFound.client.phone}</p>`;
      html += `<table>
                 <thead>
                   <tr>
                     <th>Producto</th>
                     <th>Referencia</th>
                     <th>Precio</th>
                     <th>Unidades</th>
                     <th>Total</th>
                   </tr>
                 </thead>
                 <tbody>`;
      orderFound.products.forEach(product => {
        html += `<tr>
                  <td>${product.name}</td>
                  <td>${product.reference}</td>
                  <td>${product.price.toFixed(2)} €</td>
                  <td>${product.units}</td>
                  <td>${(product.price * product.units).toFixed(2)} €</td>
                 </tr>`;
      });
      html += `</tbody></table>`;
      html += `<p><strong>Total Factura:</strong> ${orderFound.total.toFixed(2)} €</p>`;
      invoiceDiv.innerHTML = html;
    }
  }
  
  function populateProducts(data) {
    // Productos vendidos en el Q1 2023
    const q1ProductsTableBody = document.querySelector('#q1_2023_products tbody');
    if (data["2023"] && data["2023"]["Q1"]) {
      data["2023"]["Q1"].forEach(order => {
        order.products.forEach(product => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.reference}</td>
            <td>${product.price.toFixed(2)} €</td>
            <td>${product.units}</td>
          `;
          q1ProductsTableBody.appendChild(tr);
        });
      });
    }
  
    // Productos vendidos en el Q4 2024
    const q4ProductsTableBody = document.querySelector('#q4_2024_products tbody');
    if (data["2024"] && data["2024"]["Q4"]) {
      data["2024"]["Q4"].forEach(order => {
        order.products.forEach(product => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.reference}</td>
            <td>${product.price.toFixed(2)} €</td>
            <td>${product.units}</td>
          `;
          q4ProductsTableBody.appendChild(tr);
        });
      });
    }
  }
  