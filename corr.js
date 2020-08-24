async function init1() {

    const data_conf = await d3.csv("https://raw.githubusercontent.com/venky2k11/bank_d3/master/data/IncomeExpenses.csv", function (d) {
        return { DATE: d3.timeParse("%Y-%m-%d")(d.DATE), INCOME: d.INCOME }
    });

    function update(data) {
 

    }


    update(data_conf)

}