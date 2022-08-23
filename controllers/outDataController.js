const apikey = "HWjfCow2KnpSDltKA92htcsV3JYxCL2C";
const accuweather = require("node-accuweather")()(apikey);

class OutDataController {
    async getWeather(req, res) {
        try {
            let weather = await accuweather
                .getCurrentConditions(req.params.city_id, { unit: "Celsius" }) // can be type string or Number
                .then(function (result) {
                   return result
                })
                return res.json(weather);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Weather service is unavailable" });
        }
    }
}

module.exports = new OutDataController();
