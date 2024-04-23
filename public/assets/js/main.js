const URL_MAIN = "https://bancosolar.onrender.com";
const URL_BASE = "https://bancosolar.onrender.com/apiV1/dashboard";
let errorMsj = document.querySelector("#errorMsj");
let errorModal = document.querySelector("#errorModal");
let successMsj = document.querySelector("#successMsj");
const btnLogout = document.querySelector("#salir");

btnLogout.addEventListener("click", () => {
  logout();
});

const setInfoModal = (nombre, balance, id) => {
  $("#nombreEdit").val(nombre);
  $("#balanceEdit").val(balance);
  $("#editButton").attr("onclick", `editUsuario('${id}')`);
};
/* Editar nombre y balance de usuario */
const editUsuario = async (id) => {
  let nombre = $("#nombreEdit").val();
  const balance = $("#balanceEdit").val();
  const regexNombre = /^[A-Za-zñÑ\sáíéóúÁÍÉÓÚäÄëËïÏöÖüÜ]+$/;
  const regexBalance = /^\d+$/;
  nombre = nombre.toLowerCase().replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  if (!regexNombre.test(nombre)) {
    errorModal.innerHTML = `<p class="bg-danger">El nombre solo puede contener letras</p>`;
    setTimeout(() => {
      limpiarMsj(errorModal);
    }, 3000);
    return;
  }
  if (nombre.length < 3) {
    errorModal.innerHTML = `<p class="bg-danger">El nombre ingresado no puede ser menor a 3 carácteres</p>`;
    setTimeout(() => {
      limpiarMsj(errorModal);
    }, 3000);
    return;
  }
  if (nombre.length > 50) {
    errorModal.innerHTML = `<p class="bg-danger">El nombre ingresado no puede ser mayor a 50 carácteres</p>`;
    setTimeout(() => {
      limpiarMsj(errorModal);
    }, 3000);
    return;
  }
  if (!regexBalance.test(balance)) {
    errorModal.innerHTML = `<p class="bg-danger">El balance solo puede contener números</p>`;
    setTimeout(() => {
      limpiarMsj(errorModal);
    }, 3000);
    return;
  }
  if (parseInt(balance) > 1000000) {
    errorModal.innerHTML = `<p class="bg-danger">El balance máximo permitido es $1000000</p>`;
    setTimeout(() => {
      limpiarMsj(errorModal);
    }, 3000);
    return;
  }
  try {
    const { data } = await axios.put(`${URL_BASE}/users/usuario/?id=${id}`, {
      nombre,
      balance,
    });
    $("#exampleModal").modal("hide");
    console.log(data);
    successMsj.innerHTML = `<p>${data.message}</p>`;
    setTimeout(() => {
      limpiarMsj(successMsj);
      location.reload();
    }, 3000);
    getUsuarios();
  } catch (e) {
    console.error("Algo salió mal..." + e);
  }
};
/* Crea un nuevo usuario */
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
    errorMsj.innerHTML = `<p class="bg-danger">El nombre solo puede contener letras</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return;
  }
  if (nombre.length < 3) {
    errorMsj.innerHTML = `<p class="bg-danger">El nombre ingresado no puede ser menor a 3 carácteres</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return;
  }
  if (nombre.length > 50) {
    errorMsj.innerHTML = `<p class="bg-danger">El nombre ingresado no puede ser mayor a 50 carácteres</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return;
  }
  if (!regexBalance.test(balance)) {
    errorMsj.innerHTML = `<p class="bg-danger">El balance solo puede contener números</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return;
  }
  if (balance > 1000000) {
    errorMsj.innerHTML = `<p class="bg-danger">El balance máximo permitido es $1000000</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return;
  }
  if (balance < 1000) {
    errorMsj.innerHTML = `<p class="bg-danger">El balance inicial no puede ser menor a $1000</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
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
    const data = await response.json();
    $("form:first input:first").val("");
    $("form:first input:nth-child(2)").val("");
    getUsuarios();
    successMsj.innerHTML = `<p>${data.message}</p>`;
    setTimeout(() => {
      limpiarMsj(successMsj);
      location.reload();
    }, 3000);
  } catch (error) {
    console.error("Algo salió mal..." + error);
    errorMsj.innerHTML = `<p>${error}</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
  }
});
/* Crea una nueva transferencia y actualiza balance de usuarios */
$("form:last").submit(async (e) => {
  e.preventDefault();
  let emisor = $("form:last select:first").val();
  let receptor = $("form:last select:last").val();
  let monto = $("#monto").val();
  const regexMonto = /^\d+$/;
  if (!monto || !emisor || !receptor) {
    errorMsj.innerHTML = `<p class="bg-danger">Debe seleccionar un emisor, receptor y monto a transferir</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return false;
  }
  if (!regexMonto.test(monto)) {
    errorMsj.innerHTML = `<p class="bg-danger">El monto solo puede contener números</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return false;
  }
  if (monto > 1000000) {
    errorMsj.innerHTML = `<p class="bg-danger">El monto máximo permitido es $1000000</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
    return false;
  }
  if (monto < 1000) {
    errorMsj.innerHTML = `<p class="bg-danger">El monto minimo de transferencia es $1000</p>`;
    setTimeout(() => {
      limpiarMsj();
    }, 3000);
    return false;
  }
  if (receptor === emisor) {
    errorMsj.innerHTML = `<p class="bg-danger">No puedes realizar transacciones a ti mismo</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
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
    if (data.status === "Success") {
      successMsj.innerHTML = `<p>${data.message}</p>`;
      getTransferencias();
      setTimeout(() => {
        limpiarMsj(successMsj);
        location.reload();
      }, 3000);
    } else {
      errorMsj.innerHTML = `<p>${data.message}</p>`;
      setTimeout(() => {
        limpiarMsj(errorMsj);
      }, 3000);
    }
  } catch (error) {
    console.error("Algo salió mal..." + error);
    errorMsj.innerHTML = `<p>${error}</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
  }
});

const getUsuarios = async () => {
  try {
    const response = await fetch(`${URL_BASE}/users/usuarios`);
    let data = await response.json();
    $(".usuarios").html("");
    data.listado.forEach((c) => {
      $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${formatNumber(c.balance)}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${
        c.id
      }')"
                  >Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${
                    c.id
                  }')">Eliminar</button>
                </td>
              </tr>
         `);

      $("#emisor").append(`<option value="${c.id}">${c.nombre}</option>`);
      $("#receptor").append(`<option value="${c.id}">${c.nombre}</option>`);
    });
  } catch (error) {
    $(".usuarios").append(`
    <tr>
      <td>No hay usuarios registrados</td>
      <td>No hay balance registrado</td>
    </tr>`);
  }
};

const eliminarUsuario = async (id) => {
  const response = await axios.delete(`${URL_BASE}/users/usuario?id=${id}`);
  if (response.data.erase) {
    successMsj.innerHTML = `<p>${response.data.message}</p>`;
    getUsuarios();
    setTimeout(() => {
      limpiarMsj(successMsj);
      location.reload();
    }, 3000);
  } else {
    console.error("Error al eliminar usuario");
    errorMsj.innerHTML = `<p class="bg-danger">${response.data.mensajeDelProgramador}</p>`;
    setTimeout(() => {
      limpiarMsj(errorMsj);
    }, 3000);
  }
};

const getTransferencias = async () => {
  try {
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
  } catch (error) {
    $(".transferencias").append(`
       <tr>
        <td>No</td>
        <td>Hay</td>
        <td>Transferencias</td>
        <td>Registradas</td>
       </tr>`);
  }
};

const formatDate = (date) => {
  const dateFormat = moment(date).format("L");
  const timeFormat = moment(date).format("LTS");
  return `${dateFormat} ${timeFormat}`;
};

const formatNumber = (number) => {
  return Number(number).toLocaleString("es-CL");
};

const limpiarMsj = (tagHtml) => {
  while (tagHtml.firstChild) {
    tagHtml.removeChild(tagHtml.firstChild);
  }
};

const logout = () => {
  try {
    window.location.replace(`${URL_MAIN}`);
  } catch (error) {
    console.log("Error en Login: " + error);
  }
};

getUsuarios();
getTransferencias();
