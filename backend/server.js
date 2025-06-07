const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "config/.env" });

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
