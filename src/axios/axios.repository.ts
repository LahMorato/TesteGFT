const fs = require("fs");
const https = require("https");
const qs = require("qs");
const axios = require('axios')

const certificate = fs.readFileSync("teste_gft.pem", { encoding: "utf8" });
const key = fs.readFileSync("teste_gft.key", { encoding: "utf8" });

export class AxiosRepository {
  constructor() {
  }

  async getToken() {
    const url = `https://matls-auth.sandbox.directory.openbankingbrasil.org.br/token`;
    const method = "post";
    const data = qs.stringify({
      grant_type: "client_credentials",
      scope: "directory:software",
      client_id: "Cx-CluFpgHMDCIHBi2vl6",
    });
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return await this.callAxios({ url, method, headers, data });
  }

  async getStatement(token) {
    const url = `https://matls-api.sandbox.directory.openbankingbrasil.org.br/organisations/8292c33e-d95a-5fe7-8f27-dd7a95c68b55/softwarestatements/234c141e-d3a7-4ff2-b0cf-aae440061df1/assertion`;
    const method = "get";
    const headers = {
      Authorization: `Bearer ${token}`,
      'Accept': '*/*'
    };

    return await this.callAxios({ url, method, headers });
  }

  async getDcr(statement){
    const url = `https://matls-auth.mockbank.poc.raidiam.io/reg`;
    const method = "post";
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = JSON.stringify({
      "grant_types": [
        "authorization_code",
        "implicit",
        "refresh_token",
        "client_credentials"
      ],
      "tls_client_auth_subject_dn": "UID=234c141e-d3a7-4ff2-b0cf-aae440061df1,1.3.6.1.4.1.311.60.2.1.3=#13024252,2.5.4.15=#130f427573696e65737320456e74697479,2.5.4.5=#130e3435323436343130303030313535,CN=gobaas-itp.com,OU=8292c33e-d95a-5fe7-8f27-dd7a95c68b55,O=BANCO GENIAL S.A.,L=RIO DE JANEIRORJ,ST=RJ,C=BR",
      "jwks_uri": "https://keystore.sandbox.directory.openbankingbrasil.org.br/8292c33e-d95a-5fe7-8f27-dd7a95c68b55/234c141e-d3a7-4ff2-b0cf-aae440061df1/application.jwks",
      "token_endpoint_auth_method": "tls_client_auth",
      "response_types": [
        "code id_token"
      ],
      "redirect_uris": [
        "https://gobaas-itp.com:3003/gobaas-itp/payment/pix/callback"
      ],
      "software_statement": `${statement}`
    })

    return await this.callAxios({ url, method, headers, data });

  }

  private callAxios({ url, method, headers, data = null }) {

    return axios({
      url,
      method,
      headers,
      data,
      httpsAgent: new https.Agent({
        cert: certificate,
        key: key,
        rejectUnauthorized: false,
      }),
    })
      .then((response) => {
        return response.data;
      })
      .catch(({ response: err }) => {
        throw err;
      });
  }
  
}
