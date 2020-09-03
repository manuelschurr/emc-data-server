<template>
    <div>
        <!-- Gallery for Screenshots -->
        <b>
            <u>Screenshots</u>
        </b>
        <!-- make border around screenshots with div -->
        <canvas ref="canvas" class="galleryCanvas" id="galleryCanvas" width="640" height="480"></canvas>
        <ul>
            <li v-for="i in screenshots" :key="i.id">
                <img v-bind:src="i" height="50" />
            </li>
        </ul>
        <!-- <Gallery /> -->
    </div>
</template>

<script>
// import Gallery from "./Gallery";
export default {
    // components: {
    //     Gallery,
    // },
    data() {
        return {
            screenshots: [],
            output: "",
        };
    },
    mounted() {
        // this.$root.emit("selectScreenshots", "captures");
        this.$root.$on("selectScreenshots", (data) => {
            this.screenshots = data;
        });
    },
};
</script>

