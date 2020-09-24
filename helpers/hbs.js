
module.exports = {
    divide : function(numerator, denominator){
        return numerator/denominator;
    },
    formatDate : function(date){
        const moment = require('moment');
        const boughtDate = moment(date).format('dddd Do MMMM, YYYY');
        return boughtDate;
    }

}
