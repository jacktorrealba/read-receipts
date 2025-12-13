import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                offWhite: {value: "#FAF9F6"},
                customGreen: {value: "#4F7942"},
                customYellow: {value: "#FFCD34"},
                customBlue: {value: "#9EB2E8"},
            },
        },
    },
})

export default createSystem(defaultConfig, config)
