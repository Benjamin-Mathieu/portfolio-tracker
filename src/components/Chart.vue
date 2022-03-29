<template>
    <div class="chart-container">
        <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
    name: 'Chart',
    components: { apexchart: VueApexCharts },
    setup() {
        const options = {
            chart: {
                id: 'vuechart-example'
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
        };

        const series = [{
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        }];

        return { options, series }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.chart-container {
    display: flex;
    justify-content: center;
}
</style>
