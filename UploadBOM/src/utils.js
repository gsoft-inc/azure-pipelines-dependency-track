class Utils {
    static sleepAsync(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static getErrorMessage(err){
        if (err.error) {
            let errorMsg;
            try {
            errorMsg = JSON.stringify(err.error);
            }
            catch {
            errorMsg = err.error;
            }

            return `${errorMsg}`;
        } else if (err.response) {
            return `${err.response.statusCode} - ${err.response.statusMessage}`;
        }

        return `${err}`;
    }
}
export default Utils;