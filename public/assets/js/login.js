const URL_MAIN = "https://bancosolar.onrender.com";
const inputUser = document.querySelector("#user");
const inputPassword = document.querySelector("#password");
const btnLogin = document.querySelector("#ingresar");
let errorMess = document.querySelector("#errorMsj");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  login();
});

const login = async () => {
  try {
    const data = await axios.get(
      `${URL_MAIN}/apiV1/login/admin/?user=${inputUser.value}&password=${inputPassword.value}`
    );
    const DBuser = data.data.result.map((data) => data.email);
    const DBpass = data.data.result.map((data) => data.password);

    if (inputUser.value === String(DBuser) && inputPassword.value === String(DBpass)) {
      window.location.replace(`${URL_MAIN}/apiV1/dashboard`);
    } else {
      alert("Usuario o contraseña incorrectos");
      window.location.replace(`${URL_MAIN}`);
    }
  } catch (error) {
    errorMess.innerHTML = `<p class="bg-danger text-white p-1">Usuario o contraseña Incorrectos</p>`;
    setTimeout(() => {
      limpiarLogin(errorMess);
    }, 3000);
    console.log("Error en Login: " + error);
  }
};

const limpiarLogin = (mensaje) => {
  while (mensaje.firstChild) {
    mensaje.removeChild(mensaje.firstChild);
  }
};

