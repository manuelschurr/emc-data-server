<template>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <a class="navbar-brand" href="#">
            <img alt="Teamproject University of Mannheim Logo" src="../assets/umm_team_logo.png" height="45" width="70" />
        </a>
        <form class="form-inline">
            <button class="btn btn-outline-dark rtwButton btn-lg" type="button" @click="changeRTW">
                <!-- <img src="../assets/ambulance.png" width="80" /> -->
                <div class="buttonFont">RTW wechseln</div>
            </button>
            
        </form>
        <h1 class="navbar-text biggerFont">Universitätsklinikum Mannheim</h1>
    </nav>
</template>

<script>
export default {
    props: {
        changeRTW: Function,
    },
};
</script>

<style scoped>
.rtwButton {
    margin: 10px 10px 10px 10px;
}
.buttonFont {
    font-weight: 400;
}
.biggerFont {
    color: rgb(51, 51, 51);
    font-size: 34;
    font-weight: 500;
    display: table-cell;
    vertical-align: middle;
    margin: 0px 0px 0px;
}
</style>