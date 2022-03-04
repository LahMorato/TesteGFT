import { AxiosRepository } from "../axios/axios.repository";
import { logger } from "../logger/logger.custom";

const axiosRepository = new AxiosRepository();

(async function main() {
  try {
    const token = await axiosRepository.getToken();
    logger.info({ message: "getToken success", token: token.access_token });

    const statement = await axiosRepository.getStatement(token.access_token);
    logger.info({ message: "getStatement success", statement: statement });

    const dcr = await axiosRepository.getDcr(statement);
    logger.info({ message: "Resultado DCR - Processo finalizado", DCR: dcr });
    console.log(dcr)
    
    return dcr;
    
  } catch (error) {
    logger.error({ message: "error to get API response", error });
    return error;
  }
})();
