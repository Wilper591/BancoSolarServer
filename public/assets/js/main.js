const URL_BASE = "https://bancosolar.onrender.com/apiV1";
const setInfoModal = (nombre, balance, id) => {
  $("#nombreEdit").val(nombre);
  $("#balanceEdit").val(balance);
  $("#editButton").attr("onclick", `editUsuario('${id}')`);
};

const editUsuario = async (id) => {
  const nombre = $("#nombreEdit").val();
  const balance = $("#balanceEdit").val();
  const regexNombre = /^[A-Za-zñÑ\sáíéóúÁÍÉÓÚäÄëËïÏöÖüÜ]+$/;
  const regexBalance = /^\d+$/;
  nombre = nombre.toLowerCase().replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  if (!regexNombre.test(nombre)) {
    alert("El nombre solo puede contener letras");
    return;
  }
  if (nombre.length < 3) {
    alert("El nombre ingresado no puede ser menor a 3 carácteres");
    return;
  }
  if (nombre.length > 50) {
    alert("El nombre ingresado no puede ser mayor a 50 carácteres");
    return;
  }
  if (!regexBalance.test(balance)) {
    alert("El balance solo puede contener números");
    return;
  }
  if (parseInt(balance) > 1000000) {
    alert("El balance máximo permitido es 1000000");
    return;
  }
  try {
    const { data } = await axios.put(`${URL_BASE}/users/usuario/?id=${id}`, {
      nombre,
      balance,
    });
    $("#exampleModal").modal("hide");
    location.reload();
  } catch (e) {
    alert("Algo salió mal..." + e);
  }
};

$("form:first").submit(async (e) => {
  e.preventDefault();
  let nombre = $("form:first input:first").val();
  let balance = Number($("form:first input:nth-child(2)").val());
  const regexNombre = /^[A-Za-zñÑ\sáíéóúÁÍÉÓÚäÄëËïÏöÖüÜ]+$/;
  const regexBalance = /^\d+$/;
  nombre = nombre.toLowerCase().replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  if (!regexNombre.test(nombre)) {
    alert("El nombre solo puede contener letras");
    return;
  }
  if (nombre.length < 3) {
    alert("El nombre ingresado no puede ser menor a 3 carácteres");
    return;
  }
  if (nombre.length > 50) {
    alert("El nombre ingresado no puede ser mayor a 50 carácteres");
    return;
  }
  if (!regexBalance.test(balance)) {
    alert("El balance solo puede contener números");
    return;
  }
  if (parseInt(balance) > 1000000) {
    alert("El balance máximo permitido es 1000000");
    return;
  }
  if (balance < 1000) {
    alert("El balance inicial no puede ser menor a $1000");
    return false;
  }
  try {
    const response = await fetch(`${URL_BASE}/users/usuario`, {
      method: "post",
      body: JSON.stringify({
        nombre,
        balance,
      }),
      headers: { "Content-Type": "application/json" },
    });
    $("form:first input:first").val("");
    $("form:first input:nth-child(2)").val("");
    location.reload();
  } catch (e) {
    alert("Algo salió mal ..." + e);
  }
});

$("form:last").submit(async (e) => {
  e.preventDefault();
  let emisor = $("form:last select:first").val();
  let receptor = $("form:last select:last").val();
  let monto = $("#monto").val();
  const regexMonto = /^\d+$/;
  if (!regexMonto.test(monto)) {
    alert("El monto solo puede contener números");
    return;
  }
  if (parseInt(monto) > 1000000) {
    alert("El monto máximo permitido es 1000000");
    return;
  }
  if (!monto || !emisor || !receptor) {
    alert("Debe seleccionar un emisor, receptor y monto a transferir");
    return false;
  }
  if (receptor === emisor) {
    alert("No puedes realizar transacciones a ti mismo");
    return false;
  }
  if (monto < 1000) {
    alert("El monto minimo de transferencia es $1000");
    return false;
  }
  try {
    const response = await fetch(`${URL_BASE}/transaction/transferencia`, {
      method: "post",
      body: JSON.stringify({
        emisor,
        receptor,
        monto,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    location.reload();
  } catch (e) {
    console.log(e);
    alert("Algo salió mal..." + e);
  }
});

const getUsuarios = async () => {
  const response = await fetch(`${URL_BASE}/users/usuarios`);
  let data = await response.json();
  $(".usuarios").html("");

  $.each(data.listado, (i, c) => {
    $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${formatNumber(c.balance)}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')"
                  >Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
                </td>
              </tr>
         `);

    $("#emisor").append(`<option value="${c.id}">${c.nombre}</option>`);
    $("#receptor").append(`<option value="${c.id}">${c.nombre}</option>`);
  });
};

const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`${URL_BASE}/users/usuario?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      getUsuarios();
    } else {
      throw new Error("No se pudo eliminar el usuario.");
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    alert("Error al eliminar usuario: " + error.message);
  }
};

const getTransferencias = async () => {
  const { data } = await axios.get(`${URL_BASE}/transaction/transferencias`);
  $(".transferencias").html("");
  data.listado.forEach((t) => {
    $(".transferencias").append(`
       <tr>
         <td> ${formatDate(t.fecha)} </td>
         <td> ${t.nombre_emisor} </td>
         <td> ${t.nombre_receptor} </td>
         <td> ${formatNumber(t.monto)} </td>
       </tr>
     `);
  });
};

const formatDate = (date) => {
  const dateFormat = moment(date).format("L");
  const timeFormat = moment(date).format("LTS");
  return `${dateFormat} ${timeFormat}`;
};

const formatNumber = (number) => {
  return Number(number).toLocaleString("es-CL");
};

getTransferencias();
getUsuarios();
