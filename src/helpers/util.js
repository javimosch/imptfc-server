import flatted from "flatted";
import btoa from "btoa";
export default function(app) {
    return async function getFunqlGetUrl(data) {
        let encoded = btoa(
            JSON.stringify({
                name: this.name,
                ...data
            })
        );
        return `http${this.req.secure ? "s" : ""}://${
      this.req.headers.host
    }/funql-api?body=${encoded}&name=${this.name}`;
    }
}