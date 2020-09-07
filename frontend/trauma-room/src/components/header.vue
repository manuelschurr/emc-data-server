<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
            Team
            <img alt="Teamproject University of Mannheim Logo" src="../assets/project_logo.png" height="45" width="75" />
            Uni Mannheim
        </a>
        <form class="form-inline">
            <button class="btn btn-outline-dark rtwButton btn-sm" type="button" @click="changeRTW">
                <img src="../assets/ambulance.png" width="80" />
                RTW wechseln
            </button>
            <h1>Universitätsklinikum Mannheim</h1>
        </form>
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
.form-inline h1 {
    display: table-cell;
    vertical-align: middle;
}
.rtwButton {
    margin: 0 10px 0;
}
</style>