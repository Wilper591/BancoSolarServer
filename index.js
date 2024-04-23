import { app, PORT } from "./src/app.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Se levanta el servidor */
app.listen(PORT, () => {
  console.log(`Servidor conectado al puerto ${PORT} - PID ${process.pid}`);
});

export { __dirname };